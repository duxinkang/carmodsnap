#!/usr/bin/env python3
"""
阿里云百炼平台视频生成测试
根据官方文档使用正确的 API 端点和模型
"""

import json
import time
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

API_KEY = "sk-8f795071bc9948eb80f850ea57000e98"

# 根据阿里云官方文档，视频生成 API 端点
# https://help.aliyun.com/zh/dashscope/developer-reference/wanx-video-generation-api

def create_video_task(prompt, model="wanx-v2"):
    """
    创建视频生成任务
    阿里云百炼平台万相视频生成 API
    """
    # 正确的 API 端点
    url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-to-video/generation"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "X-DashScope-Async": "enable"
    }
    
    # 万相 2.0 视频生成模型
    payload = {
        "model": model,
        "input": {
            "prompt": prompt
        },
        "parameters": {
            "size": "1280*720",
            "video_duration": 5
        }
    }
    
    print(f"📤 提交视频生成任务...")
    print(f"模型：{model}")
    print(f"提示词：{prompt}")
    print(f"API 端点：{url}")
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30, verify=False)
        print(f"HTTP 状态码：{response.status_code}")
        print(f"响应内容：{response.text[:800]}")
        
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

def wait_for_completion(task_id, max_wait=600):
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

def test_with_different_models():
    """测试不同的模型名称"""
    prompt = "360 度环绕一辆汽车拍摄，专业产品展示，电影灯光，平滑相机运动"
    
    # 阿里云万相视频生成模型列表
    models = [
        "wanx-v2",           # 万相 2.0
        "wanx-v1",           # 万相 1.0
        "wanx",              # 万相通用
        "text-to-video",     # 通用文生视频
        "wanx2.0",           # 万相 2.0 简写
    ]
    
    for model in models:
        print(f"\n{'='*60}")
        print(f"测试模型：{model}")
        print(f"{'='*60}")
        
        task_id = create_video_task(prompt, model)
        
        if task_id:
            print(f"\n✅ 模型 {model} 可用！")
            return task_id, model
        
        print(f"\n等待 5 秒后测试下一个模型...")
        time.sleep(5)
    
    return None, None

if __name__ == "__main__":
    print("=" * 70)
    print("阿里云百炼平台 - 万相视频生成测试")
    print("文档：https://help.aliyun.com/zh/dashscope/developer-reference/wanx-video-generation-api")
    print("=" * 70)
    
    # 先尝试不同模型
    task_id, model = test_with_different_models()
    
    if task_id:
        print(f"\n{'='*70}")
        print(f"使用模型 {model} 等待视频生成...")
        print(f"{'='*70}")
        
        video_url = wait_for_completion(task_id)
        
        if video_url:
            print(f"\n🎬 视频已生成！")
            print(f"下载链接：{video_url}")
        else:
            print(f"\n❌ 视频生成失败")
    else:
        print(f"\n{'='*70}")
        print("❌ 所有模型测试失败")
        print("=" * 70)
        print("\n建议:")
        print("1. 访问 https://bailian.console.aliyun.com 检查服务开通状态")
        print("2. 确认 API Key 有视频生成权限")
        print("3. 查看账户余额是否充足")
