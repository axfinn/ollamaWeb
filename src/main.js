/**
 * Ollama Web 应用主入口文件
 */

import ChatComponent from './components/ChatComponent.js';

/**
 * 应用主类
 */
class OllamaWebApp {
  /**
   * 构造函数
   */
  constructor() {
    this.chatComponent = null;
    this.init();
  }
  
  /**
   * 初始化应用
   */
  init() {
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', () => {
      this.chatComponent = new ChatComponent();
    });
  }
}

// 启动应用
const app = new OllamaWebApp();

// 用于模块化支持的导出
export default OllamaWebApp;