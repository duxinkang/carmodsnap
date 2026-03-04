# 360°视频生成功能集成文档

## ✅ 已完成的功能

### 1. 后端 API

**文件：** `/src/app/api/video/generate/route.ts`

**端点：**
- `POST /api/video/generate` - 创建视频生成任务
  ```json
  {
    "carImage": "https://...",  // 可选，车辆图片 URL
    "prompt": "360 degree...",   // 可选，自定义提示词
    "duration": 5                // 视频时长（秒）
  }
  ```
  响应：
  ```json
  {
    "data": {
      "task_id": "xxx",
      "message": "Video generation task created",
      "estimated_time": 60
    }
  }
  ```

- `GET /api/video/status?task_id=xxx` - 查询任务状态
  响应：
  ```json
  {
    "data": {
      "task_id": "xxx",
      "status": "SUCCEEDED",  // PENDING/RUNNING/SUCCEEDED/FAILED/CANCELED
      "video_url": "https://...",
      "message": ""
    }
  }
  ```

**使用模型：**
- 文生视频：`wanx2.1-t2v-turbo`（快速版）
- 图生视频：`wanx2.1-i2v-turbo`（基于图片生成）

---

### 2. 前端组件

**文件：** `/src/components/vehicle-3d-viewer/`

#### VehicleViewer.tsx
支持三种模式：
1. **视频模式** - 播放 360°环绕视频
   - 自动播放/暂停控制
   - 静音切换
   - 加载状态显示
   - 错误处理

2. **3D 模型模式** - Three.js 交互视图
   - OrbitControls 拖拽旋转
   - 车身颜色切换
   - 环境光照

3. **空状态** - 无内容时显示提示

#### useVideoGeneration.ts
视频生成 Hook：
```typescript
const videoState = useVideoGeneration();

// 生成视频
videoState.generateVideo(carImageUrl, prompt);

// 状态
videoState.isGenerating  // 是否正在生成
videoState.status        // 任务状态
videoState.videoUrl      // 生成的视频 URL
videoState.error         // 错误信息

// 重置
videoState.reset();
```

---

### 3. 数据库 Schema

**文件：** `/src/config/db/schema.*.ts`

**新增字段：**
```typescript
generatedVideos: text('generated_videos'), // JSON array
// 格式：[{url, prompt, taskId, status, createdAt}]
```

---

### 4. 页面集成

**文件：** `/src/app/[locale]/(landing)/carmodder/page.tsx`

#### 新增功能

1. **视图切换按钮**（预览区右上角）
   - 2D 视图 - 查看 AI 生成的静态图片
   - 3D 视图 - Three.js 交互模型
   - 🎬 视频 - 360°环绕视频（生成后可用）

2. **视频生成按钮**（操作区）
   ```tsx
   <Button onClick={generateVideo}>
     🎬 Generate 360° Orbit Video
   </Button>
   ```
   - 基于当前选择的车辆图片生成
   - 显示生成进度
   - 生成完成后提示切换视图

3. **视频播放器**
   - 集成在预览区
   - 支持播放/暂停/静音
   - 自动循环播放

---

## 🎯 使用流程

### 步骤 1：选择车辆配置
1. 选择车型
2. 选择轮毂、漆面、改装件等
3. 点击 "Generate Showcase" 生成静态图片

### 步骤 2：生成 360°视频
1. 点击 "Generate 360° Orbit Video" 按钮
2. 等待 60-90 秒（显示进度）
3. 生成成功后显示 "✅ Video ready!"

### 步骤 3：查看视频
1. 点击右上角 "🎬 Video" 按钮
2. 观看 360°环绕视频
3. 可播放/暂停/静音

### 步骤 4：保存方案（可选）
1. 点击 "Share" 保存配置
2. 视频 URL 会保存到 `generatedVideos` 字段

---

## 📊 提示词测试

**测试文件：** `/test-prompts.py`

**已测试的提示词：**
1. ✅ 基础 360°环绕
   - "360 degree orbit around a car, professional product showcase..."
   
2. ⏳ 专业摄影棚
   - "Professional studio shot of a car, 360 degree camera rotation..."

3. ⏹️ 城市街道
4. ⏹️ 自然风光
5. ⏹️ 极简白色
6. ⏹️ 动态展示
7. ⏹️ 中文提示词
8. ⏹️ 改装车展示

**推荐提示词：**
```
"360 degree orbit around a car, professional product showcase, 
cinematic lighting, smooth camera movement, 4k quality"
```

---

## 🔧 配置

### 环境变量
确保 `.env.development` 包含：
```bash
DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxx
```

### 阿里云 DashScope
- API Key 需要在 [阿里云百炼控制台](https://bailian.console.aliyun.com/) 开通
- 视频生成服务按量计费
- 参考：[DashScope 视频生成文档](https://help.aliyun.com/zh/dashscope/developer-reference/wanx-video-generation-api)

---

## 🚀 下一步优化

1. **进度显示优化**
   - 显示预估剩余时间
   - 添加进度条

2. **视频管理**
   - 支持生成多个视频
   - 视频列表切换
   - 下载视频功能

3. **成本优化**
   - 显示视频生成消耗积分
   - 用户余额检查

4. **提示词优化**
   - 预设多种风格模板
   - 用户自定义提示词
   - A/B 测试不同提示词效果

5. **性能优化**
   - 视频 CDN 加速
   - 懒加载视频播放器
   - 视频压缩

---

## 📝 注意事项

1. **API 调用限制**
   - 每个任务约需 60-90 秒
   - 建议添加队列管理
   - 避免并发过多请求

2. **错误处理**
   - 网络超时
   - API Key 权限不足
   - 账户余额不足

3. **用户体验**
   - 生成过程中禁用重复提交
   - 提供明确的进度反馈
   - 生成失败时显示原因

---

## 🎬 演示视频

测试生成的视频示例：
- 基础 360°环绕：https://dashscope-result-wlcb-acdr-1.oss-cn-wulanchabu-acdr-1.aliyuncs.com/1d/ef/20260304/ad0627fd/d4b1e42c-475d-4af8-934e-7783a17cbd85.mp4

---

**最后更新：** 2026-03-04  
**状态：** ✅ 集成完成，待测试
