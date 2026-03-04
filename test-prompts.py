#!/usr/bin/env python3
"""
阿里云 DashScope 视频生成 - 提示词测试
测试不同提示词对 360°汽车视频生成效果的影响
"""

import json
import time
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

API_KEY = "sk-8f795071bc9948eb80f850ea57000e98"

def create_task(prompt, model="wanx2.1-t2v-turbo"):
    """创建视频生成任务"""
    url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "X-DashScope-Async": "enable"
    }
    
    payload = {
        "model": model,
        "input": {
            "prompt": prompt
        },
        "parameters": {
            "size": "1280*720",
            "duration": 5
        }
    }
    
    response = requests.post(url, headers=headers, json=payload, timeout=30, verify=False)
    result = response.json()
    
    if response.status_code == 200:
        return result["output"]["task_id"]
    else:
        print(f"❌ 提交失败：{result}")
        return None

def wait_for_result(task_id, max_wait=300):
    """等待任务完成"""
    url = f"https://dashscope.aliyuncs.com/api/v1/tasks/{task_id}"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    start_time = time.time()
    while time.time() - start_time < max_wait:
        response = requests.get(url, headers=headers, timeout=30, verify=False)
        result = response.json()
        
        status = result["output"]["task_status"]
        
        if status == "SUCCEEDED":
            return result["output"]["video_url"]
        elif status in ["FAILED", "CANCELED"]:
            return None
        
        time.sleep(10)
    
    return None

def test_prompts():
    """测试不同提示词"""
    
    prompts = [
        # 基础款
        {
            "name": "基础 360°环绕",
            "prompt": "360 degree orbit around a car, professional product showcase, cinematic lighting, smooth camera movement, 4k quality"
        },
        # 详细款
        {
            "name": "专业摄影棚",
            "prompt": "Professional studio shot of a car, 360 degree camera rotation, soft box lighting, white background, commercial photography, ultra detailed, 4k"
        },
        # 场景款
        {
            "name": "城市街道",
            "prompt": "Car on city street at night, neon lights, 360 degree orbit shot, cinematic, blade runner style, rain reflections, 4k"
        },
        # 自然款
        {
            "name": "自然风光",
            "prompt": "Sports car on mountain road, scenic landscape, golden hour, 360 degree camera movement, nature background, professional automotive photography"
        },
        # 极简款
        {
            "name": "极简白色",
            "prompt": "White car on pure white background, minimal, clean, 360 rotation, studio lighting, product photography, high key"
        },
        # 动态款
        {
            "name": "动态展示",
            "prompt": "Dynamic car showcase, rotating platform, spotlight, dark background, dramatic lighting, 360 view, automotive commercial"
        },
        # 中文款
        {
            "name": "中文提示词",
            "prompt": "一辆跑车在摄影棚中，360 度环绕拍摄，专业灯光，商业广告级别，4K 画质"
        },
        # 改装车款
        {
            "name": "改装车展示",
            "prompt": "Modified sports car, custom body kit, aftermarket wheels, car show, 360 degree walkaround, exhibition lighting, detailed"
        },
    ]
    
    print("=" * 80)
    print("阿里云 DashScope 视频生成 - 提示词测试")
    print("=" * 80)
    
    results = []
    
    for i, test in enumerate(prompts, 1):
        print(f"\n[{i}/{len(prompts)}] 测试：{test['name']}")
        print(f"提示词：{test['prompt'][:80]}...")
        
        task_id = create_task(test["prompt"])
        
        if task_id:
            print(f"Task ID: {task_id}")
            print("等待生成中...", end="", flush=True)
            
            video_url = wait_for_result(task_id)
            
            if video_url:
                print("\n✅ 成功！")
                print(f"视频 URL: {video_url}")
                results.append({
                    "name": test["name"],
                    "prompt": test["prompt"],
                    "video_url": video_url,
                    "status": "success"
                })
            else:
                print("\n❌ 失败")
                results.append({
                    "name": test["name"],
                    "prompt": test["prompt"],
                    "status": "failed"
                })
        else:
            results.append({
                "name": test["name"],
                "prompt": test["prompt"],
                "status": "submit_failed"
            })
        
        # 间隔 10 秒再测试下一个
        if i < len(prompts):
            print("\n等待 10 秒后继续下一个测试...")
            time.sleep(10)
    
    # 输出汇总
    print("\n" + "=" * 80)
    print("测试结果汇总")
    print("=" * 80)
    
    for r in results:
        status_icon = "✅" if r["status"] == "success" else "❌"
        print(f"{status_icon} {r['name']}")
        if r.get("video_url"):
            print(f"   {r['video_url'][:100]}...")
    
    # 保存结果
    with open("video_test_results.json", "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n结果已保存到 video_test_results.json")

if __name__ == "__main__":
    test_prompts()
