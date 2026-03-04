#!/usr/bin/env python3
"""
阿里云 DashScope 视频生成测试脚本
使用正确的模型名称：wanx-video-generation
"""

import json
import time
import requests

API_KEY = "sk-8f795071bc9948eb80f850ea57000e98"
BASE_URL = "https://dashscope.aliyuncs.com/api/v1"

def create_video_task(prompt, size="1280*720", duration=5):
    """创建视频生成任务 - 使用 wanx-video-generation 模型"""
    url = f"{BASE_URL}/services/aigc/video-generation/generation"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "X-DashScope-Async": "enable"
    }
    
    # 阿里云万相视频生成模型
    payload = {
        "model": "wanx-video-generation",
        "input": {
            "prompt": prompt
        },
        "parameters": {
            "resolution": size,
            "duration": duration
        }
    }
    
    print(f"📤 提交视频生成任务...")
    print(f"提示词：{prompt}")
    print(f"模型：wanx-video-generation")
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        result = response.json()
        
        print(f"HTTP 状态码：{response.status_code}")
        
        if response.status_code == 200:
            task_id = result.get("output", {}).get("task_id")
            print(f"✅ 任务提交成功！Task ID: {task_id}")
            return task_id
        else:
            print(f"❌ 提交失败：{response.status_code}")
            print(json.dumps(result, indent=2, ensure_ascii=False))
            return None
    except Exception as e:
        print(f"❌ 请求错误：{e}")
        return None

def check_task_status(task_id):
    """查询任务状态"""
    url = f"{BASE_URL}/tasks/{task_id}"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        result = response.json()
        
        if response.status_code == 200:
            return result
        else:
            print(f"查询失败：{response.status_code}")
            return None
    except Exception as e:
        print(f"查询错误：{e}")
        return None

def wait_for_completion(task_id, max_wait=600):
    """等待任务完成"""
    print(f"⏳ 等待视频生成完成...")
    
    start_time = time.time()
    while time.time() - start_time < max_wait:
        status = check_task_status(task_id)
        
        if not status:
            time.sleep(5)
            continue
        
        task_status = status.get("output", {}).get("task_status", "UNKNOWN")
        print(f"当前状态：{task_status}")
        
        if task_status == "SUCCEEDED":
            video_url = status.get("output", {}).get("video_url")
            print(f"✅ 视频生成成功！")
            print(f"视频 URL: {video_url}")
            return video_url
        elif task_status in ["FAILED", "CANCELED"]:
            print(f"❌ 任务失败：{status.get('output', {}).get('message', 'Unknown error')}")
            return None
        
        time.sleep(10)
    
    print(f"⏰ 等待超时")
    return None

def main():
    print("=" * 60)
    print("阿里云 DashScope 视频生成测试")
    print("模型：wanx-video-generation")
    print("=" * 60)
    
    # 测试提示词
    prompts = [
        "360 度环绕一辆汽车拍摄，专业产品展示，电影灯光，平滑相机运动",
        "Car 360 degree orbit shot, professional product showcase, cinematic lighting"
    ]
    
    for i, prompt in enumerate(prompts, 1):
        print(f"\n{'='*60}")
        print(f"测试 {i}/2")
        print(f"{'='*60}")
        
        task_id = create_video_task(prompt)
        
        if task_id:
            video_url = wait_for_completion(task_id)
            
            if video_url:
                print(f"\n🎬 测试 {i} 完成！")
            else:
                print(f"\n❌ 测试 {i} 失败")
        
        if i < len(prompts):
            print(f"\n等待 30 秒后继续...")
            time.sleep(30)

if __name__ == "__main__":
    main()
