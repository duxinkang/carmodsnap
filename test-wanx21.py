#!/usr/bin/env python3
"""
阿里云 DashScope 视频生成测试 - 使用正确的模型名称
根据 SDK 源码：wanx2.1-t2v-plus / wanx2.1-t2v-turbo
"""

import json
import time
import requests
import urllib3
from dashscope import VideoSynthesis
import dashscope

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

API_KEY = "sk-8f795071bc9948eb80f850ea57000e98"
dashscope.api_key = API_KEY

def test_with_sdk():
    """使用 SDK 测试"""
    print("=" * 70)
    print("阿里云 DashScope VideoSynthesis SDK 测试")
    print("=" * 70)
    
    # SDK 中定义的可用模型
    models = [
        VideoSynthesis.Models.wanx_2_1_t2v_turbo,  # wanx2.1-t2v-turbo
        VideoSynthesis.Models.wanx_2_1_t2v_plus,   # wanx2.1-t2v-plus
    ]
    
    prompt = "360 degree orbit around a car, professional product showcase"
    
    for model in models:
        print(f"\n测试模型：{model}")
        
        try:
            # 异步调用创建任务
            response = VideoSynthesis.async_call(
                model=model,
                prompt=prompt,
                size="1280*720",
                duration=5
            )
            
            print(f"状态码：{response.status_code}")
            
            if response.status_code == 200:
                task_id = response.output.get("task_id")
                print(f"✅ 任务提交成功！Task ID: {task_id}")
                
                # 等待完成
                print("等待视频生成完成...")
                result = VideoSynthesis.wait(task_id)
                
                if result.status_code == 200:
                    status = result.output.get("task_status")
                    print(f"最终状态：{status}")
                    
                    if status == "SUCCEEDED":
                        video_url = result.output.get("video_url")
                        print(f"🎬 视频 URL: {video_url}")
                        return video_url
                    else:
                        print(f"❌ 任务失败：{result.output.get('message')}")
                else:
                    print(f"❌ 等待失败：{result.status_code}")
            else:
                print(f"❌ 提交失败：{response.code} - {response.message}")
                
        except Exception as e:
            print(f"❌ 异常：{e}")
        
        print("等待 5 秒后测试下一个模型...")
        time.sleep(5)
    
    return None

if __name__ == "__main__":
    video_url = test_with_sdk()
    
    if video_url:
        print("\n" + "=" * 70)
        print("✅ 视频生成成功！")
        print(f"下载链接：{video_url}")
        print("=" * 70)
    else:
        print("\n" + "=" * 70)
        print("❌ 所有模型测试失败")
        print("=" * 70)
        print("\n可能原因:")
        print("1. API Key 没有视频生成权限")
        print("2. 账户余额不足")
        print("3. 服务未开通")
        print("\n请前往 https://bailian.console.aliyun.com 检查")
