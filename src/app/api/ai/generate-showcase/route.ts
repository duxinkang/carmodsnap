import { envConfigs } from '@/config';
import { AIMediaType, AITaskStatus } from '@/extensions/ai';
import { trackServerEvent } from '@/shared/lib/analytics/server-track';
import { getUuid } from '@/shared/lib/hash';
import { respData, respErr } from '@/shared/lib/resp';
import { createAITask, NewAITask } from '@/shared/models/ai_task';
import { getAllConfigs } from '@/shared/models/config';
import { getRemainingCredits } from '@/shared/models/credit';
import { getUserInfo } from '@/shared/models/user';
import { getAIService } from '@/shared/services/ai';

type ShowcaseShotType = 'panorama' | 'closeup';

interface ShowcaseTaskResult {
  shotType: ShowcaseShotType;
  id?: string;
  status: AITaskStatus | 'failed';
  message?: string;
  taskInfo?: string | null;
  taskResult?: string | null;
  prompt?: string;
}

const VALID_SHOTS: ShowcaseShotType[] = ['panorama', 'closeup'];

function isShotType(value: string): value is ShowcaseShotType {
  return VALID_SHOTS.includes(value as ShowcaseShotType);
}

export async function POST(request: Request) {
  try {
    const {
      provider,
      model,
      scene,
      prompts,
      referenceImage,
      retryShotType,
      bundleId: rawBundleId,
    } = await request.json();

    if (!provider || !model || !scene || !prompts) {
      throw new Error('invalid params');
    }

    if (scene !== 'text-to-image' && scene !== 'image-to-image') {
      throw new Error('invalid scene');
    }

    if (
      retryShotType &&
      (typeof retryShotType !== 'string' || !isShotType(retryShotType))
    ) {
      throw new Error('invalid retryShotType');
    }

    const shouldGenerateShots: ShowcaseShotType[] = retryShotType
      ? [retryShotType]
      : VALID_SHOTS;

    for (const shotType of shouldGenerateShots) {
      if (!prompts[shotType] || typeof prompts[shotType] !== 'string') {
        throw new Error(`invalid prompt for ${shotType}`);
      }
    }

    const aiService = await getAIService();
    const aiProvider = aiService.getProvider(provider);
    if (!aiProvider) {
      throw new Error('invalid provider');
    }

    const user = await getUserInfo();
    if (!user) {
      throw new Error('no auth, please sign in');
    }
    const configs = await getAllConfigs();

    const bundleId =
      typeof rawBundleId === 'string' && rawBundleId.trim()
        ? rawBundleId.trim()
        : getUuid();

    const chargeShotType: ShowcaseShotType = 'panorama';
    const needCharge =
      shouldGenerateShots.includes(chargeShotType) && !retryShotType;
    const costCredits = needCharge ? 4 : 0;

    if (costCredits > 0) {
      const remainingCredits = await getRemainingCredits(user.id);
      if (remainingCredits < costCredits) {
        await trackServerEvent(
          'carmodder_insufficient_credits',
          {
            user_id: user.id,
            is_authenticated: true,
            source: 'server_generate_request',
            cost_credits: costCredits,
            remaining_credits: remainingCredits,
          },
          configs
        );
        throw new Error('insufficient credits');
      }
    }

    const callbackUrl = `${envConfigs.app_url}/api/ai/notify/${provider}`;

    const generationResults = await Promise.allSettled(
      shouldGenerateShots.map(async (shotType) => {
        const prompt = String(prompts[shotType]).trim();
        const result = await aiProvider.generate({
          params: {
            mediaType: AIMediaType.IMAGE,
            model,
            prompt,
            callbackUrl,
            options: {
              size: '1024*1024',
              n: 1,
              ...(scene === 'image-to-image' && referenceImage
                ? { ref_image: referenceImage }
                : {}),
            },
          },
        });

        if (!result?.taskId) {
          throw new Error(
            `ai generate failed, provider: ${provider}, model: ${model}, shotType: ${shotType}`
          );
        }

        const newAITask: NewAITask = {
          id: getUuid(),
          userId: user.id,
          mediaType: AIMediaType.IMAGE,
          provider,
          model,
          prompt,
          scene,
          status: result.taskStatus,
          costCredits: shotType === chargeShotType ? costCredits : 0,
          taskId: result.taskId,
          taskInfo: result.taskInfo ? JSON.stringify(result.taskInfo) : null,
          taskResult: result.taskResult
            ? JSON.stringify(result.taskResult)
            : null,
          options: JSON.stringify({
            size: '1024*1024',
            n: 1,
            bundleId,
            shotType,
            isComplimentary: shotType !== chargeShotType,
          }),
        };
        const created = await createAITask(newAITask);

        return {
          shotType,
          id: created.id,
          status: created.status as AITaskStatus,
          taskInfo: created.taskInfo,
          taskResult: created.taskResult,
          prompt: created.prompt,
        } as ShowcaseTaskResult;
      })
    );

    const tasks = generationResults.map((result, index) => {
      const shotType = shouldGenerateShots[index];
      if (result.status === 'fulfilled') {
        return result.value;
      }

      return {
        shotType,
        status: 'failed',
        message: result.reason?.message || 'generate failed',
      } as ShowcaseTaskResult;
    });

    const hasSuccess = tasks.some((item) => item.id);
    if (!hasSuccess) {
      return respErr('showcase generation failed');
    }

    await trackServerEvent(
      'carmodder_generation_requested',
      {
        user_id: user.id,
        is_authenticated: true,
        bundle_id: bundleId,
        provider,
        model,
        scene,
        shot_count: shouldGenerateShots.length,
        charged_credits: costCredits,
      },
      configs
    );

    return respData({
      bundleId,
      scene,
      tasks,
    });
  } catch (e: any) {
    console.log('showcase generate failed', e);
    return respErr(e.message);
  }
}
