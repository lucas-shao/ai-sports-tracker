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
**后端**: Vercel Serverless Functions + Supabase (PostgreSQL)  
**AI**: Google Gemini AI

## 🚀 部署到 Vercel（推荐）

### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/ai-sports-tracker)

### 手动部署

1. **推送代码到 GitHub**（如果还没有）

2. **在 Vercel 导入项目**
   - 访问 [Vercel Dashboard](https://vercel.com/new)
   - 选择你的 GitHub 仓库
   - Vercel 会自动检测 Vite 项目并配置

3. **配置环境变量**
   在 Vercel Project Settings → Environment Variables 添加：
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   DEFAULT_USER_ID=your_user_id_from_seed
   ```

4. **部署**
   - 点击 "Deploy"
   - Vercel 自动构建和部署前后端
   - 完成！访问分配的 URL

### 数据库设置（首次部署前）

1. 在 [Supabase Dashboard](https://supabase.com/dashboard) 创建项目
2. 在 SQL Editor 运行 `server/supabase_schema.sql`
3. 本地运行 `npm run seed` 获取 `DEFAULT_USER_ID`

---

## 💻 本地开发

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
创建 `.env.local` 文件：

```bash
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your_supabase_anon_key
DEFAULT_USER_ID=your_user_id
```

### 3. 运行开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

**或使用 Vercel CLI 测试 Serverless Functions:**
```bash
npm install -g vercel
vercel dev
```

---

## 📁 项目结构

```
├── api/                    # Vercel Serverless Functions
│   ├── _lib/
│   │   └── supabase.ts    # 共享 Supabase 客户端
│   ├── users/
│   │   └── [id]/
│   │       └── profile.ts # GET /api/users/:id/profile
│   ├── sports/[sportId]/records.ts
│   ├── records.ts         # POST /api/records
│   └── ai/
│       ├── analyze.ts
│       └── weekly-report.ts
├── server/                # 本地开发用 Express 服务器（可选）
├── services/              # 前端 API 服务层
├── App.tsx
└── vercel.json           # Vercel 配置
```

## 🔌 API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/users/:id/profile` | GET | 获取用户完整档案 |
| `/api/users/:userId/sports` | GET/POST | 获取/创建运动类别 |
| `/api/sports/:sportId/records` | GET | 获取运动记录 |
| `/api/records` | POST | 创建记录 |
| `/api/ai/analyze` | POST | AI 文本分析 |
| `/api/ai/weekly-report` | POST | 生成 AI 周报 |

## 🎯 常见问题

### 部署后显示错误？
1. 检查 Vercel 环境变量是否正确配置
2. 确认 Supabase 数据库表已创建
3. 查看 Vercel 部署日志

### 本地开发 API 调用失败？
- 使用 `npm run dev`（原 Express 方式）
- 或使用 `vercel dev`（模拟 Serverless）

## 📄 许可证

MIT License

