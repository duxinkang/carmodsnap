#!/usr/bin/env python3
"""查询阿里云 DashScope 可用模型列表"""

import requests
import json

API_KEY = "sk-8f795071bc9948eb80f850ea57000e98"

# 查询模型列表
url = "https://dashscope.aliyuncs.com/api/v1/models"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

try:
    response = requests.get(url, headers=headers, timeout=30)
    print(f"HTTP 状态码：{response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
        # 查找视频相关模型
        models = result.get("data", [])
        video_models = [m for m in models if "video" in m.get("model", "").lower() or "wanx" in m.get("model", "").lower()]
        
        print("\n\n=== 视频/万相相关模型 ===")
        for m in video_models:
            print(f"- {m.get('model')}")
    else:
        print(f"查询失败：{response.text}")
        
except Exception as e:
    print(f"错误：{e}")
