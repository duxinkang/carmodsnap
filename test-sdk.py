#!/usr/bin/env python3
"""
阿里云 DashScope 视频生成 - 使用官方 SDK 方式
"""

import json
import time
import dashscope
from dashscope import VideoGeneration

# 设置 API Key
dashscope.api_key = "sk-8f795071bc9948eb80f850ea57000e98"

def create_video_task(prompt):
    """使用官方 SDK 创建视频生成任务"""
    print(f"📤 提交视频生成任务...")
    print(f"提示词：{prompt}")
    
    try:
        # 使用官方 SDK 调用
        response = VideoGeneration.call(
            model="wanx-v1",
            prompt=prompt,
            size="1280*720",
            duration=5
        )
        
        print(f"状态码：{response.status_code}")
        print(f"响应：{response}")
        
        if response.status_code == 200:
            task_id = response.output.get("task_id")
            print(f"✅ 任务提交成功！Task ID: {task_id}")
            return task_id
        else:
            print(f"❌ 提交失败：{response.code} - {response.message}")
            return None
            
    except Exception as e:
        print(f"❌ 异常：{e}")
        return None

def check_status(task_id):
    """查询任务状态"""
    try:
        response = VideoGeneration.wait(task_id)
        
        if response.status_code == 200:
            status = response.output.get("task_status")
            print(f"当前状态：{status}")
            
            if status == "SUCCEEDED":
                video_url = response.output.get("video_url")
                print(f"✅ 视频 URL: {video_url}")
                return video_url
            elif status in ["FAILED", "CANCELED"]:
                print(f"❌ 任务失败：{response.output.get('message')}")
            
            return status
        else:
            print(f"查询失败：{response.status_code}")
            return None
    except Exception as e:
        print(f"查询异常：{e}")
        return None

def main():
    print("=" * 70)
    print("阿里云 DashScope SDK - 视频生成测试")
    print("=" * 70)
    
    prompt = "360 度环绕一辆汽车拍摄，专业产品展示，电影灯光，平滑相机运动"
    
    task_id = create_video_task(prompt)
    
    if task_id:
        print(f"\n⏳ 等待视频生成完成...")
        
        # 轮询状态
        for i in range(60):  # 最多等待 10 分钟
            status = check_status(task_id)
            
            if status == "SUCCEEDED":
                print(f"\n🎬 视频生成成功！")
                return
            elif status == "FAILED":
                print(f"\n❌ 视频生成失败")
                return
            elif status:
                time.sleep(10)
            else:
                time.sleep(10)
        
        print(f"\n⏰ 等待超时")

if __name__ == "__main__":
    main()
