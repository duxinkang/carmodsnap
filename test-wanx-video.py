#!/usr/bin/env python3
"""
阿里云 DashScope 视频生成测试
使用正确的模型：wanx-v1-video-generation
"""

import json
import time
import requests
import urllib3

# 忽略 SSL 警告
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

API_KEY = "sk-8f795071bc9948eb80f850ea57000e98"

def create_video_task(prompt):
    """创建视频生成任务"""
    # 阿里云百炼平台视频生成 API
    url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/generation"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "X-DashScope-Async": "enable"
    }
    
    # 使用正确的模型名称
    payload = {
        "model": "wanx-v1-video-generation",
        "input": {
            "prompt": prompt
        },
        "parameters": {
            "resolution": "1280*720",
            "duration": 5
        }
    }
    
    print(f"📤 提交视频生成任务...")
    print(f"模型：wanx-v1-video-generation")
    print(f"提示词：{prompt}")
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30, verify=False)
        print(f"HTTP 状态码：{response.status_code}")
        print(f"响应内容：{response.text[:500]}")
        
        result = response.json()
        
        if response.status_code == 200:
            task_id = result.get("output", {}).get("task_id")
            print(f"✅ 任务提交成功！Task ID: {task_id}")
            return task_id
        else:
            print(f"❌ 提交失败")
            print(json.dumps(result, indent=2, ensure_ascii=False))
            return None
    except Exception as e:
        print(f"❌ 请求错误：{e}")
        return None

def check_task_status(task_id):
    """查询任务状态"""
    url = f"https://dashscope.aliyuncs.com/api/v1/tasks/{task_id}"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=30, verify=False)
        result = response.json()
        
        if response.status_code == 200:
            return result
        else:
            print(f"查询失败：{response.status_code}")
            return None
    except Exception as e:
        print(f"查询错误：{e}")
        return None

def wait_for_completion(task_id, max_wait=300):
    """等待任务完成"""
    print(f"⏳ 等待视频生成完成...(最多等待{max_wait}秒)")
    
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

if __name__ == "__main__":
    print("=" * 60)
    print("阿里云 DashScope 视频生成测试")
    print("=" * 60)
    
    prompt = "360 度环绕一辆汽车拍摄，专业产品展示，电影灯光，平滑相机运动，4K"
    
    task_id = create_video_task(prompt)
    
    if task_id:
        video_url = wait_for_completion(task_id)
        
        if video_url:
            print(f"\n🎬 视频已生成！")
            print(f"下载链接：{video_url}")
        else:
            print(f"\n❌ 视频生成失败")
    else:
        print(f"\n❌ 任务提交失败，请检查 API Key 或模型权限")
