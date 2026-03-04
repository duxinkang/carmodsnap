#!/usr/bin/env python3
"""
阿里云百炼平台视频生成测试
尝试不同的 API 端点
"""

import json
import time
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

API_KEY = "sk-8f795071bc9948eb80f850ea57000e98"

def try_endpoint(endpoint, model, prompt):
    """测试 API 端点"""
    url = f"https://dashscope.aliyuncs.com{endpoint}"
    
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
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30, verify=False)
        return response.status_code, response.json()
    except Exception as e:
        return None, str(e)

def main():
    print("=" * 70)
    print("阿里云百炼平台 - 视频生成 API 端点探测")
    print("=" * 70)
    
    prompt = "car 360 degree orbit"
    model = "wanx-v1"
    
    # 可能的 API 端点
    endpoints = [
        "/api/v1/services/aigc/text-to-video/generation",
        "/api/v1/services/aigc/video-generation/generation",
        "/api/v1/services/aigc/video/t2v/generation",
        "/api/v1/services/video/t2v/generation",
        "/api/v1/services/aigc/multimodal-generation",
        "/api/v1/services/aigc/wanx/video-generation",
        "/api/v1/wanx/video/generation",
    ]
    
    for endpoint in endpoints:
        print(f"\n测试端点：{endpoint}")
        status, result = try_endpoint(endpoint, model, prompt)
        
        if status == 200:
            print(f"✅ 成功！端点 {endpoint} 可用")
            task_id = result.get("output", {}).get("task_id")
            print(f"Task ID: {task_id}")
            return endpoint, task_id
        elif status == 400:
            error_code = result.get("code", "Unknown")
            error_msg = result.get("message", "")[:100]
            print(f"❌ 失败 ({error_code}): {error_msg}")
        else:
            print(f"❌ 未知错误：{status}")
            print(result)
    
    print("\n" + "=" * 70)
    print("测试完成")
    print("=" * 70)
    
    return None, None

if __name__ == "__main__":
    main()
