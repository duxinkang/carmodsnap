#!/usr/bin/env python3
"""
阿里云 DashScope 视频生成测试 - 直接使用 HTTP 请求
绕过 SDK 的 SSL 问题
"""

import json
import time
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

API_KEY = "sk-8f795071bc9948eb80f850ea57000e98"

def create_video_task(prompt):
    """创建视频合成任务"""
    # 根据 SDK 源码，VideoSynthesis 使用的端点
    url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "X-DashScope-Async": "enable"
    }
    
    # 参考 SDK 默认参数
    payload = {
        "model": "wanx-video-v1",  # 尝试正确的模型名称
        "input": {
            "prompt": prompt
        },
        "parameters": {
            "size": "1280*720",
            "duration": 5
        }
    }
    
    print(f"📤 提交视频生成任务...")
    print(f"模型：wanx-video-v1")
    print(f"提示词：{prompt}")
    print(f"端点：{url}")
    
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

def check_status(task_id):
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
            status = result.get("output", {}).get("task_status", "UNKNOWN")
            print(f"当前状态：{status}")
            
            if status == "SUCCEEDED":
                video_url = result.get("output", {}).get("video_url")
                print(f"✅ 视频 URL: {video_url}")
                return video_url
            elif status in ["FAILED", "CANCELED"]:
                print(f"❌ 任务失败：{result.get('output', {}).get('message')}")
                return None
            
            return status
        else:
            print(f"查询失败：{response.status_code}")
            return None
    except Exception as e:
        print(f"查询错误：{e}")
        return None

if __name__ == "__main__":
    print("=" * 70)
    print("阿里云 DashScope 视频生成测试 - HTTP 直连")
    print("=" * 70)
    
    prompt = "360 degree orbit around a car, professional product showcase, cinematic lighting"
    
    task_id = create_video_task(prompt)
    
    if task_id:
        print(f"\n⏳ 等待视频生成完成...(最多 5 分钟)")
        
        for i in range(30):
            status = check_status(task_id)
            
            if status == "SUCCEEDED":
                print(f"\n🎬 视频生成成功！")
                break
            elif status == "FAILED":
                print(f"\n❌ 视频生成失败")
                break
            elif status:
                time.sleep(10)
            else:
                time.sleep(10)
        else:
            print(f"\n⏰ 等待超时")
    else:
        print(f"\n❌ 任务提交失败")
