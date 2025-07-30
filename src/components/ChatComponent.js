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
    
    this.messages = [];
    this.ollamaAPI = new OllamaAPI();
    
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
    
    // 加载模型列表
    this.loadModels();
  }
  
  /**
   * 绑定事件监听器
   */
  bindEvents() {
    this.sendButton.addEventListener('click', () => this.sendMessage());
    this.clearButton.addEventListener('click', () => this.clearChat());
    
    this.userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    this.temperatureSlider.addEventListener('input', () => {
      this.temperatureValue.textContent = this.temperatureSlider.value;
    });
    
    // 添加刷新模型按钮事件
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '刷新模型';
    refreshBtn.className = 'btn btn-primary';
    refreshBtn.style.marginLeft = '10px';
    refreshBtn.addEventListener('click', () => this.refreshModels());
    
    // 将刷新按钮添加到模型选择器旁边
    const modelSelectParent = this.modelSelect.parentNode;
    modelSelectParent.appendChild(refreshBtn);
  }
  
  /**
   * 加载模型列表
   */
  async loadModels() {
    try {
      const models = await this.ollamaAPI.getModels();
      this.updateModelList(models);
    } catch (error) {
      console.error('加载模型列表失败:', error);
      this.addMessageToUI('system', `警告: ${error.message}`);
    }
  }
  
  /**
   * 刷新模型列表
   */
  async refreshModels() {
    try {
      // 显示加载状态
      const originalText = this.modelSelect.nextElementSibling.textContent;
      this.modelSelect.nextElementSibling.textContent = '刷新中...';
      
      const models = await this.ollamaAPI.refreshModels();
      this.updateModelList(models);
      
      // 恢复按钮文本
      this.modelSelect.nextElementSibling.textContent = '刷新模型';
      
      this.addMessageToUI('system', '模型列表已更新');
    } catch (error) {
      console.error('刷新模型列表失败:', error);
      this.addMessageToUI('system', `错误: ${error.message}`);
      this.modelSelect.nextElementSibling.textContent = '刷新模型';
    }
  }
  
  /**
   * 更新模型下拉列表
   * @param {Array} models - 模型列表
   */
  updateModelList(models) {
    // 保存当前选中的模型
    const currentModel = this.modelSelect.value;
    
    // 清空现有选项
    this.modelSelect.innerHTML = '';
    
    if (models && models.length > 0) {
      // 添加新选项
      models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.name;
        option.textContent = model.name;
        this.modelSelect.appendChild(option);
      });
      
      // 尝试恢复之前选中的模型
      if (currentModel && Array.from(this.modelSelect.options).some(opt => opt.value === currentModel)) {
        this.modelSelect.value = currentModel;
      }
    } else {
      // 如果没有模型，添加默认选项
      const option = document.createElement('option');
      option.value = '';
      option.textContent = '暂无可用模型';
      this.modelSelect.appendChild(option);
      this.modelSelect.disabled = true;
    }
  }
  
  /**
   * 发送消息
   */
  async sendMessage() {
    const message = this.userInput.value.trim();
    if (!message) return;
    
    // 检查是否选择了模型
    if (!this.modelSelect.value) {
      this.addMessageToUI('system', '请先选择一个模型');
      return;
    }
    
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
      console.error('聊天请求失败:', error);
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
    this.scrollToBottom();
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
    this.scrollToBottom();
    
    return loadingDiv;
  }
  
  /**
   * 滚动聊天历史到底部
   */
  scrollToBottom() {
    this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
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