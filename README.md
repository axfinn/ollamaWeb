# ollamaWeb

一个基于 Ollama API 的 Web 界面，支持模型选择、连续对话和参数配置。

## 功能特性

- 🤖 多模型支持 - 可选择不同的 Ollama 模型
- 💬 连续对话 - 支持上下文对话历史
- ⚙️ 参数配置 - 可调整 Temperature 和 Max Tokens 参数
- 🎨 响应式设计 - 适配桌面和移动设备
- 🌙 现代化界面 - 简洁美观的用户界面

## 项目结构

```
ollamaWeb/
├── src/                 # 源代码目录
│   ├── components/      # 组件目录
│   ├── utils/           # 工具类目录
│   ├── styles/          # 样式文件目录
│   ├── index.html       # 主页面
│   └── main.js          # 应用入口文件
├── dist/                # 构建输出目录
├── package.json         # 项目配置文件
├── vite.config.js       # 构建工具配置文件
├── .gitignore           # Git忽略文件
└── README.md            # 项目说明文档
```

## 使用方法

1. 确保已安装并运行 [Ollama](https://ollama.ai)
2. 克隆此项目
3. 安装依赖:
   ```bash
   npm install
   ```
4. 启动开发服务器:
   ```bash
   npm run dev
   ```
5. 构建生产版本:
   ```bash
   npm run build
   ```

## 配置说明

- **模型选择**: 从下拉菜单中选择已安装的 Ollama 模型
- **Temperature**: 控制输出的随机性 (0-1)
- **Max Tokens**: 控制生成文本的最大长度

## 开发规范

本项目遵循以下开发规范：

### Git开发流程
- 开发前新建功能分支，分支命名格式为 `feature/<功能名>`
- 主分支保持稳定，禁止直接在主分支上开发
- 所有新功能开发必须在新建的功能分支上进行
- 功能完成后需经过代码审查（CR）后才能合并到主分支

### 代码结构
- 使用模块化JavaScript (ES6 Modules)
- 组件化开发
- 样式与逻辑分离

### 构建工具
- 使用 Vite 作为构建工具
- 支持热重载开发

## 注意事项

当前版本为前端界面演示，实际使用时需要：
1. 运行 Ollama 服务
2. 取消注释 [src/utils/ollama.js](file:///Volumes/M20/code/docs/ollamaWeb/src/utils/ollama.js) 中的实际 API 调用代码
3. 注释掉模拟响应代码

## 许可证

MIT