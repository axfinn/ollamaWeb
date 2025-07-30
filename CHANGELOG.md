# 更新日志

所有重要的项目变更都会记录在这个文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.2.0] - 2025-07-30

### 添加

- 实现完整的 Ollama API 端点支持，包括模型管理、嵌入计算等
- 添加动态 API 地址配置功能，用户可在界面中更改 Ollama 服务地址
- 实现 API 地址的本地存储，自动记住用户配置

### 更改

- 重构 OllamaAPI 类，支持运行时动态修改 baseUrl
- 增强 ChatComponent 组件，支持动态配置 Ollama API 地址
- 更新用户界面，添加 API 地址配置输入框

## [1.1.2] - 2025-07-30

### 修复

- 修复README中的代码块语法错误

## [1.1.1] - 2025-07-30

### 修复

- 修复README中捐赠二维码图片的显示问题
- 优化README文件的Markdown格式

## [1.1.0] - 2025-07-30

### 添加

- 初始化项目基础结构
- 实现基本的聊天界面
- 添加模型选择功能
- 实现参数配置功能 (Temperature, Max Tokens)
- 添加响应式设计
- 集成Vite构建工具
- 创建组件化结构 (ChatComponent, OllamaAPI)
- 添加Git开发流程支持
- 添加捐赠支持 (微信和支付宝付款码)

### 更改

- 重构项目结构以符合前端开发规范
- 优化用户界面和交互体验
- 完善README文档说明
- 添加package.json配置文件
- 添加开发服务器和构建配置

### 修复

- 无