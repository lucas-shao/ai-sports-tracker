# AI Sports Tracker 🏆

一个由 AI 驱动的运动记录应用，支持语音录入、智能识别和数据可视化。

View your app in AI Studio: https://ai.studio/apps/drive/1Nm5jGtxA3mNeACr8pK0Fk0O9F7WFS5lo

## ✨ 特性

- 🎤 **语音录入**: 通过语音快速记录运动数据
- 🤖 **AI 识别**: 使用 Google Gemini AI 自动解析运动类型和数值
- 📊 **数据可视化**: 清晰展示最佳记录、最近成绩和历史趋势
- 💾 **数据持久化**: 使用 Supabase PostgreSQL 存储
- 🌓 **深色模式**: 支持亮色/暗色主题切换

## 🛠️ 技术栈

**前端**: React 19 + TypeScript + Vite + Tailwind CSS  
**后端**: Express + Supabase (PostgreSQL)  
**AI**: Google Gemini AI

## 📦 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
创建 `.env.local` 文件：

```bash
# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase 配置 (从 https://supabase.com/dashboard 获取)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here

# 默认用户 ID (运行 seed 后获取)
DEFAULT_USER_ID=
```

### 3. 设置数据库
在 [Supabase Dashboard](https://supabase.com/dashboard) 的 SQL Editor 中执行：
```bash
server/supabase_schema.sql
```

### 4. 初始化数据
```bash
npm run seed
```
将输出的 `DEFAULT_USER_ID` 添加到 `.env.local`

### 5. 启动应用
```bash
npm run dev
```

访问 http://localhost:3000

## 📁 项目结构

```
├── server/              # Express 后端
│   ├── routes/         # API 路由 (users, sports, records, ai)
│   ├── supabase_schema.sql
│   └── seed.ts
├── services/           # 前端 API 服务层
├── App.tsx             # React 主组件
└── types.ts
```

## 🔌 主要 API

- `GET /api/users/:id/profile` - 获取用户完整档案
- `POST /api/records` - 创建运动记录
- `POST /api/ai/analyze` - AI 文本分析
- `POST /api/ai/weekly-report` - 生成 AI 周报

## 📄 许可证

MIT License
