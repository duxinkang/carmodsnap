/**
 * POST /api/builds - 创建新的改装方案
 */
import { envConfigs } from '@/config';
import { getUuid } from '@/shared/lib/hash';
import { respData, respErr } from '@/shared/lib/resp';
import { createCarBuild } from '@/shared/models/car_build';
import { getUserInfo } from '@/shared/models/user';

export async function POST(request: Request) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in', 401);
    }

    const body = await request.json();
    const {
      carId,
      carName,
      carNameZh,
      carBrand,
      carType,
      carPrice,
      carImage,
      model3dUrl,
      customCarInput,
      wheels,
      paint,
      finish,
      mods,
      accents,
      suspension,
      brakes,
      generatedImages,
      aiPrompt,
      totalPrice,
      isPublic,
      title,
      description,
    } = body;

    if (!carId || !carName) {
      return respErr('carId and carName are required', 400);
    }

    const shareId = getUuid();

    const newBuild = await createCarBuild({
      id: getUuid(),
      userId: user.id,
      shareId,
      carId,
      carName,
      carNameZh: carNameZh || null,
      carBrand: carBrand || null,
      carType: carType || null,
      carPrice: carPrice || 0,
      carImage: carImage || null,
      model3dUrl: model3dUrl || null,
      customCarInput: customCarInput ? JSON.stringify(customCarInput) : null,
      
      wheelsId: wheels?.id || null,
      wheelsName: wheels?.name || null,
      wheelsSize: wheels?.size || null,
      wheelsColor: wheels?.color || null,
      wheelsPrice: wheels?.price || 0,
      
      paintId: paint?.id || null,
      paintName: paint?.name || null,
      paintColor: paint?.color || null,
      paintPrice: paint?.price || 0,
      
      finishId: finish?.id || null,
      finishName: finish?.name || null,
      finishPrice: finish?.price || 0,
      
      modsIds: mods?.ids ? JSON.stringify(mods.ids) : null,
      modsNames: mods?.names ? JSON.stringify(mods.names) : null,
      modsPrice: mods?.price || 0,
      
      accentsIds: accents?.ids ? JSON.stringify(accents.ids) : null,
      accentsNames: accents?.names ? JSON.stringify(accents.names) : null,
      accentsPrice: accents?.price || 0,
      
      suspensionId: suspension?.id || null,
      suspensionName: suspension?.name || null,
      suspensionPrice: suspension?.price || 0,
      
      brakesId: brakes?.id || null,
      brakesName: brakes?.name || null,
      brakesPrice: brakes?.price || 0,
      
      generatedImages: generatedImages ? JSON.stringify(generatedImages) : null,
      aiPrompt: aiPrompt || null,
      totalPrice: totalPrice || 0,
      isPublic: isPublic || false,
      title: title || null,
      description: description || null,
    });

    return respData({
      id: newBuild.id,
      shareId: newBuild.shareId,
      shareUrl: `${envConfigs.app_url}/builds/${newBuild.shareId}`,
    });
  } catch (error: any) {
    console.error('create build error:', error);
    return respErr(error.message || 'create build failed', 500);
  }
}
