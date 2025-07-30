# Ollama Web Interface

![GitHub](https://img.shields.io/github/license/axfinn/ollamaWeb)
![GitHub package.json version](https://img.shields.io/github/package-json/v/axfinn/ollamaWeb)
![GitHub last commit](https://img.shields.io/github/last-commit/axfinn/ollamaWeb)

一个现代化的 Web 界面，用于与 [Ollama](https://ollama.ai) 本地 AI 模型进行交互。支持模型选择、连续对话和参数配置。

![界面预览](docs/screenshot.png)

## 功能特性

- 🤖 **多模型支持** - 动态加载并选择已安装的 Ollama 模型
- 💬 **连续对话** - 保留上下文对话历史，实现真正的对话体验
- ⚙️ **参数配置** - 可调整 Temperature、Max Tokens 等生成参数
- 🎨 **响应式设计** - 适配桌面和移动设备的现代化界面
- 🌙 **暗色主题** - 舒适的夜间使用体验
- 🔧 **开发者友好** - 基于现代前端工具链构建

## 目录

- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [开发指南](#开发指南)
- [部署](#部署)
- [配置说明](#配置说明)
- [API 集成](#api-集成)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## 快速开始

### 前置要求

- [Ollama](https://ollama.ai) 已安装并运行
- [Node.js](https://nodejs.org) (推荐 v16+)
- npm 或 yarn 包管理器

### 安装

```
# 克隆项目
git clone https://github.com/axfinn/ollamaWeb.git
cd ollamaWeb

# 安装依赖
npm install
```

### 启动开发服务器

```
# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 构建生产版本

```
# 构建生产版本
npm run build

# 预览生产构建
npm run serve
```

## 项目结构

```
ollamaWeb/
├── src/                    # 源代码目录
│   ├── components/         # UI 组件
│   ├── utils/              # 工具类
│   ├── styles/             # 样式文件
│   ├── assets/             # 静态资源
│   ├── index.html          # 主页面
│   └── main.js             # 应用入口文件
├── dist/                   # 构建输出目录
├── docs/                   # 文档资源
├── package.json            # 项目配置文件
├── vite.config.js          # 构建工具配置
├── .gitignore              # Git 忽略文件
└── README.md               # 项目说明文档
```

## 开发指南

### 技术栈

- [Vite](https://vitejs.dev) - 构建工具
- 原生 JavaScript (ES6+)
- CSS3 with modern features

### 代码规范

1. 使用 ES6 模块系统
2. 遵循 [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
3. 组件化开发模式
4. 语义化 HTML 和 CSS

### 项目开发流程

本项目遵循严格的 Git 开发流程：

1. 从 `main` 分支创建功能分支: `git checkout -b feature/your-feature-name`
2. 开发并提交更改
3. 发起 Pull Request 进行代码审查
4. 审查通过后合并到 `main` 分支

### 目录说明

- `src/components/` - 可复用的 UI 组件
- `src/utils/` - 工具函数和类
- `src/styles/` - 全局样式文件
- `src/assets/` - 图片、字体等静态资源

## 部署

### 静态部署

构建后的文件位于 `dist/` 目录，可部署到任何静态文件服务器：

```bash
# 构建生产版本
npm run build

# 将 dist/ 目录内容部署到服务器
```

### Docker 部署 (可选)

```
# 构建镜像
docker build -t ollama-web .

# 运行容器
docker run -p 8080:80 ollama-web
```

## 配置说明

### 模型参数

| 参数 | 说明 | 默认值 | 范围 |
|------|------|--------|------|
| Model | Ollama 模型名称 | llama2 | 已安装的模型 |
| Temperature | 控制输出随机性 | 0.7 | 0 - 1 |
| Max Tokens | 最大生成标记数 | 2048 | 1 - 4096 |

### 环境变量

创建 `.env` 文件以配置环境变量：

```env
# Ollama 服务地址
VITE_OLLAMA_HOST=http://localhost:11434

# 应用配置
VITE_APP_TITLE=Ollama Web Interface
```

## API 集成

本项目通过 Ollama REST API 与模型进行交互：

### 主要 API 端点

1. **获取模型列表**: `GET /api/tags`
2. **聊天接口**: `POST /api/chat`

### API 调用示例

``javascript
// 获取模型列表
const response = await fetch('/api/tags');
const { models } = await response.json();

// 聊天接口
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama2',
    messages: [{ role: 'user', content: 'hello' }]
  })
});
```

### 错误处理

API 调用包含完整的错误处理机制，会在界面上显示友好的错误信息。

## 贡献指南

欢迎任何形式的贡献！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范

- 遵循现有的代码风格
- 添加适当的注释
- 确保通过所有测试
- 更新相关文档

## 更新日志

详细变更请查看 [CHANGELOG.md](./CHANGELOG.md)

## 许可证

本项目采用 MIT 许可证。查看 [LICENSE](./LICENSE) 文件了解详情。

## 联系方式

项目维护者: [axfinn](https://github.com/axfinn)

项目链接: [https://github.com/axfinn/ollamaWeb](https://github.com/axfinn/ollamaWeb)

## 请作者喝杯咖啡 ☕

如果您觉得这个项目对您有帮助，欢迎扫码请作者喝杯咖啡！

<div align="center">
  <div style="display: flex; justify-content: center; gap: 50px; margin: 20px 0;">
    <div>
      <img src="./img/wxpay.JPG" alt="微信捐赠码" width="200" />
      <p>微信捐赠</p>
    </div>
    <div>
      <img src="./img/alipay.JPG" alt="支付宝捐赠码" width="200" />
      <p>支付宝捐赠</p>
    </div>
  </div>
</div>

---