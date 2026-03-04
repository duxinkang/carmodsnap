#!/usr/bin/env python3
"""
阿里云 DashScope 视频生成测试 - 最终版本
尝试多个可能的模型名称
"""

import json
import time
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

API_KEY = "sk-8f795071bc9948eb80f850ea57000e98"

# 可能的模型名称列表
POSSIBLE_MODELS = [
    "wanx-v1-video-generation",
    "wanx-video-v1",
    "wanx2.0-t2v", 
    "wanx-t2v",
    "text-to-video-wanx",
    "wanx-v1",
    "modelscope-wanx-video"
]

def try_create_task(model, prompt):
    """尝试创建视频生成任务"""
    url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/generation"
    
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
            "resolution": "1280*720",
            "duration": 5
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30, verify=False)
        return response.status_code, response.json()
    except Exception as e:
        return None, str(e)

def main():
    print("=" * 60)
    print("阿里云 DashScope 视频模型探测")
    print("=" * 60)
    
    prompt = "car 360 degree orbit shot"
    
    for model in POSSIBLE_MODELS:
        print(f"\n尝试模型：{model}")
        status, result = try_create_task(model, prompt)
        
        if status == 200:
            print(f"✅ 成功！模型 {model} 可用")
            task_id = result.get("output", {}).get("task_id")
            print(f"Task ID: {task_id}")
            return task_id
        elif status == 400:
            error_code = result.get("code", "Unknown")
            print(f"❌ 失败 ({error_code}): {result.get('message', '')}")
        else:
            print(f"❌ 未知错误：{status}")
            print(result)
    
    print("\n" + "=" * 60)
    print("结论：当前 API Key 可能没有视频生成权限，或模型名称不正确")
    print("=" * 60)
    print("\n建议:")
    print("1. 访问 https://dashscope.console.aliyun.com 开通视频生成服务")
    print("2. 检查 API Key 是否有视频生成权限")
    print("3. 查看最新文档确认模型名称")
    
    return None

if __name__ == "__main__":
    main()
