/**
 * 聊天组件
 * 负责处理聊天界面的交互逻辑
 */

import OllamaAPI from '../utils/ollama.js';

class ChatComponent {
  /**
   * 构造函数
   * @param {Object} options - 组件选项
   */
  constructor(options = {}) {
    this.options = {
      container: options.container || document.getElementById('app'),
      ...options
    };
    
    this.chatHistory = document.getElementById('chat-history');
    this.userInput = document.getElementById('user-input');
    this.sendButton = document.getElementById('send-btn');
    this.clearButton = document.getElementById('clear-btn');
    this.modelSelect = document.getElementById('model-select');
    this.temperatureSlider = document.getElementById('temperature');
    this.temperatureValue = document.getElementById('temperature-value');
    this.maxTokensInput = document.getElementById('max-tokens');
    this.apiHostInput = document.getElementById('api-host');
    this.saveApiConfigButton = document.getElementById('save-api-config');
    
    this.messages = [];
    this.ollamaAPI = new OllamaAPI();
    
    // 加载保存的 API 配置
    this.loadApiConfig();
    
    this.init();
  }
  
  /**
   * 初始化组件
   */
  init() {
    // 绑定事件
    this.bindEvents();
    
    // 初始化参数显示
    this.temperatureValue.textContent = this.temperatureSlider.value;
    
    // 设置 API host 输入框的值
    this.apiHostInput.value = this.ollamaAPI.getBaseUrl();
    
    // 加载模型列表
    this.loadModels();
  }
  
  /**
   * 绑定事件监听器
   */
  bindEvents() {
    this.sendButton.addEventListener('click', () => this.sendMessage());
    this.clearButton.addEventListener('click', () => this.clearChat());
    this.saveApiConfigButton.addEventListener('click', () => this.saveApiConfig());
    
    this.userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    this.temperatureSlider.addEventListener('input', () => {
      this.temperatureValue.textContent = this.temperatureSlider.value;
    });
  }
  
  /**
   * 加载 API 配置
   */
  loadApiConfig() {
    const savedConfig = localStorage.getItem('ollamaApiConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      this.ollamaAPI.setBaseUrl(config.host);
    }
  }
  
  /**
   * 保存 API 配置
   */
  saveApiConfig() {
    const host = this.apiHostInput.value.trim() || 'http://localhost:11434';
    this.ollamaAPI.setBaseUrl(host);
    
    // 保存到 localStorage
    localStorage.setItem('ollamaApiConfig', JSON.stringify({ host }));
    
    // 显示保存成功的消息
    this.addMessageToUI('system', `API 配置已保存: ${host}`);
    
    // 重新加载模型列表
    this.loadModels();
  }
  
  /**
   * 加载模型列表
   */
  async loadModels() {
    try {
      const models = await this.ollamaAPI.getModels();
      // 清空现有选项
      this.modelSelect.innerHTML = '';
      
      // 添加新选项
      models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.name;
        option.textContent = model.name;
        this.modelSelect.appendChild(option);
      });
    } catch (error) {
      console.error('加载模型列表失败:', error);
      // 出错时保留默认选项
      this.addMessageToUI('system', `加载模型列表失败: ${error.message}`);
    }
  }
  
  /**
   * 发送消息
   */
  async sendMessage() {
    const message = this.userInput.value.trim();
    if (!message) return;
    
    // 添加用户消息到界面
    this.addMessageToUI('user', message);
    this.messages.push({ role: 'user', content: message });
    
    // 清空输入框
    this.userInput.value = '';
    
    // 获取参数
    const model = this.modelSelect.value;
    const temperature = parseFloat(this.temperatureSlider.value);
    const maxTokens = parseInt(this.maxTokensInput.value);
    
    // 显示加载状态
    const loadingElement = this.addLoadingIndicator();
    
    try {
      // 调用Ollama API
      const response = await this.ollamaAPI.chat(
        model, 
        this.messages, 
        { temperature, maxTokens }
      );
      
      // 移除加载状态
      loadingElement.remove();
      
      // 添加助手消息到界面
      this.addMessageToUI('assistant', response);
      this.messages.push({ role: 'assistant', content: response });
      
    } catch (error) {
      // 移除加载状态
      loadingElement.remove();
      
      // 显示错误信息
      this.addMessageToUI('system', `错误: ${error.message}`);
    }
  }
  
  /**
   * 添加消息到界面
   * @param {string} role - 消息发送者角色
   * @param {string} content - 消息内容
   */
  addMessageToUI(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${role}-message`);
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = content;
    
    messageDiv.appendChild(contentDiv);
    this.chatHistory.appendChild(messageDiv);
    
    // 滚动到底部
    this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
  }
  
  /**
   * 添加加载指示器
   * @returns {HTMLElement} 加载元素
   */
  addLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'assistant-message');
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.innerHTML = '<div class="loading"></div> 正在思考中...';
    
    loadingDiv.appendChild(contentDiv);
    this.chatHistory.appendChild(loadingDiv);
    
    // 滚动到底部
    this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
    
    return loadingDiv;
  }
  
  /**
   * 清空聊天记录
   */
  clearChat() {
    this.chatHistory.innerHTML = `
      <div class="message system-message">
        <div class="message-content">
          对话已清空。请选择模型并开始新的对话。
        </div>
      </div>
    `;
    this.messages = [];
  }
}

// 导出ChatComponent类
export default ChatComponent;