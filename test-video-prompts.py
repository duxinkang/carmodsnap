#!/usr/bin/env python3
"""
阿里云视频生成 - 提示词测试脚本
测试不同提示词对车辆环绕视频生成效果的影响
"""

import json
import time
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

API_KEY = "sk-8f795071bc9948eb80f850ea57000e98"
VIDEO_API = "https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis"
TASK_API = "https://dashscope.aliyuncs.com/api/v1/tasks"

def create_task(prompt, img_url=None):
    """创建视频生成任务"""
    payload = {
        "model": "wanx2.1-t2v-turbo",
        "input": {
            "prompt": prompt
        },
        "parameters": {
            "size": "1280*720",
            "duration": 5
        }
    }
    
    if img_url:
        payload["input"]["img_url"] = img_url
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "X-DashScope-Async": "enable"
    }
    
    response = requests.post(VIDEO_API, headers=headers, json=payload, verify=False)
    result = response.json()
    
    if response.ok:
        return result["output"]["task_id"]
    else:
        print(f"❌ 创建失败：{result}")
        return None

def wait_for_task(task_id, timeout=120):
    """等待任务完成"""
    start = time.time()
    
    while time.time() - start < timeout:
        headers = {"Authorization": f"Bearer {API_KEY}"}
        response = requests.get(f"{TASK_API}/{task_id}", headers=headers)
        result = response.json()
        
        status = result["output"]["task_status"]
        print(f"  状态：{status}", end="\r")
        
        if status == "SUCCEEDED":
            return result["output"]["video_url"]
        elif status in ["FAILED", "CANCELED"]:
            return None
        
        time.sleep(5)
    
    return None

def test_prompts():
    """测试不同提示词"""
    
    prompts = [
        {
            "name": "基础环绕",
            "prompt": "360 degree orbit around a car, professional product showcase, cinematic lighting, smooth camera movement, 4k quality"
        },
        {
            "name": "摄影棚效果",
            "prompt": "Car in professional photography studio, 360 degree rotating shot, white background, studio lighting, commercial quality, 4k"
        },
        {
            "name": "电影感",
            "prompt": "Cinematic car reveal, orbit camera movement, dramatic lighting, lens flare, slow motion, Hollywood style, 4k"
        },
        {
            "name": "夜景",
            "prompt": "Car at night, neon lights, 360 orbit shot, cyberpunk city background, moody lighting, 4k"
        },
        {
            "name": "户外阳光",
            "prompt": "Car on coastal highway, sunny day, ocean background, 360 degree orbit, golden hour lighting, 4k"
        },
        {
            "name": "改装车展示",
            "prompt": "Modified sports car, car show, 360 degree view, spotlights, crowd in background, automotive exhibition, 4k"
        },
        {
            "name": "极简风格",
            "prompt": "Minimalist car presentation, clean background, soft lighting, 360 rotation, product photography style, 4k"
        },
        {
            "name": "动态镜头",
            "prompt": "Dynamic car shot, fast camera movement, action movie style, motion blur, 360 orbit, exciting, 4k"
        }
    ]
    
    print("=" * 70)
    print("阿里云视频生成 - 提示词效果测试")
    print("=" * 70)
    print(f"模型：wanx2.1-t2v-turbo")
    print(f"测试数量：{len(prompts)} 个提示词")
    print("=" * 70)
    
    results = []
    
    for i, test in enumerate(prompts, 1):
        print(f"\n[{i}/{len(prompts)}] 测试：{test['name']}")
        print(f"提示词：{test['prompt'][:80]}...")
        
        task_id = create_task(test['prompt'])
        
        if not task_id:
            print("❌ 任务创建失败，跳过")
            continue
        
        print(f"Task ID: {task_id}")
        print("等待生成完成...", end="", flush=True)
        
        video_url = wait_for_task(task_id)
        
        if video_url:
            print(f"\n✅ 成功！")
            print(f"视频 URL: {video_url[:100]}...")
            results.append({
                "name": test["name"],
                "prompt": test["prompt"],
                "video_url": video_url,
                "status": "success"
            })
        else:
            print(f"\n❌ 生成失败")
            results.append({
                "name": test["name"],
                "prompt": test["prompt"],
                "video_url": None,
                "status": "failed"
            })
        
        # 等待 10 秒再进行下一个测试
        if i < len(prompts):
            print("等待 10 秒后继续下一个测试...")
            time.sleep(10)
    
    # 输出汇总报告
    print("\n" + "=" * 70)
    print("测试汇总报告")
    print("=" * 70)
    
    success_count = sum(1 for r in results if r["status"] == "success")
    print(f"成功：{success_count}/{len(results)}")
    print(f"失败：{len(results) - success_count}/{len(results)}")
    print(f"成功率：{success_count/len(results)*100:.1f}%")
    
    print("\n成功案例:")
    for r in results:
        if r["status"] == "success":
            print(f"  ✅ {r['name']}: {r['video_url'][:80]}...")
    
    # 保存结果到 JSON
    with open("video_test_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\n详细结果已保存到：video_test_results.json")
    print("=" * 70)

if __name__ == "__main__":
    test_prompts()
