# ollamaWeb

一个基于 Ollama API 的 Web 界面，支持模型选择、连续对话和参数配置。

## 功能特性

- 🤖 多模型支持 - 可选择不同的 Ollama 模型
- 💬 连续对话 - 支持上下文对话历史
- ⚙️ 参数配置 - 可调整 Temperature 和 Max Tokens 参数
- 🎨 响应式设计 - 适配桌面和移动设备
- 🌙 现代化界面 - 简洁美观的用户界面

## 使用方法

1. 确保已安装并运行 [Ollama](https://ollama.ai)
2. 克隆此项目
3. 在浏览器中打开 `index.html`
4. 开始与模型对话！

## 项目结构

```
ollamaWeb/
├── index.html     # 主页面
├── styles.css     # 样式文件
├── script.js      # JavaScript 逻辑
└── README.md      # 项目说明
```

## 配置说明

- **模型选择**: 从下拉菜单中选择已安装的 Ollama 模型
- **Temperature**: 控制输出的随机性 (0-1)
- **Max Tokens**: 控制生成文本的最大长度

## 注意事项

当前版本为前端界面演示，实际使用时需要：
1. 运行 Ollama 服务
2. 取消注释 [script.js](file:///Volumes/M20/code/docs/ollamaWeb/script.js) 中的实际 API 调用代码
3. 注释掉模拟响应代码

## 许可证

MIT