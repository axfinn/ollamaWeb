/**
 * 聊天组件
 * 负责处理聊天界面的交互逻辑
 */

import OllamaAPI from '../utils/ollama.js';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';

// 初始化mermaid
mermaid.initialize({ startOnLoad: false });

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
    // API配置相关元素
    this.apiHostInput = document.getElementById('api-host');
    this.saveApiHostButton = document.getElementById('save-apiHost-button');
    
    // 会话标签页相关元素
    this.sessionTabs = document.getElementById('session-tabs');
    this.newSessionButton = document.getElementById('new-session-btn');
    
    this.sessions = [];
    this.currentSessionId = null;
    this.sessionCounter = 1;
    
    // 用户输入历史相关
    this.inputHistory = [];
    this.currentHistoryIndex = -1;
    
    this.init();
  }
  
  /**
   * 初始化组件
   */
  init() {
    // 初始化OllamaAPI实例，优先使用环境变量
    this.ollamaAPI = new OllamaAPI();
    
    // 从localStorage加载保存的API地址，如果环境变量未设置
    this.loadSavedApiHost();
    
    // 从localStorage加载会话数据
    this.loadSessions();
    
    // 绑定事件
    this.bindEvents();
    
    // 初始化参数显示
    this.temperatureValue.textContent = this.temperatureSlider.value;
    
    // 加载模型列表
    this.loadModels();
    
    // 创建初始会话
    if (this.sessions.length === 0) {
      this.createSession();
    } else {
      this.switchToSession(this.sessions[0].id);
    }
    
    // 更新标签页显示
    this.renderSessionTabs();
  }
  
  /**
   * 从localStorage加载保存的API地址
   */
  loadSavedApiHost() {
    // 优先使用环境变量 VITE_OLLAMA_HOST
    if (import.meta.env?.VITE_OLLAMA_HOST) {
      this.ollamaAPI.updateBaseUrl(import.meta.env.VITE_OLLAMA_HOST);
      this.apiHostInput.value = import.meta.env.VITE_OLLAMA_HOST;
    } else {
      const savedApiHost = localStorage.getItem('ollama-api-host');
      if (savedApiHost) {
        this.apiHostInput.value = savedApiHost;
        // 更新API实例的baseUrl
        this.ollamaAPI.updateBaseUrl(savedApiHost);
      } else {
        // 如果没有保存的API地址，则使用OllamaAPI的默认值
        this.apiHostInput.value = this.ollamaAPI.baseUrl;
      }
    }
  }
  
  /**
   * 从localStorage加载会话数据
   */
  loadSessions() {
    const savedSessions = localStorage.getItem('ollama-sessions');
    if (savedSessions) {
      this.sessions = JSON.parse(savedSessions);
      // 更新会话计数器，避免ID冲突
      this.sessionCounter = Math.max(...this.sessions.map(s => s.id), 0) + 1;
    }
  }
  
  /**
   * 保存会话数据到localStorage
   */
  saveSessions() {
    localStorage.setItem('ollama-sessions', JSON.stringify(this.sessions));
  }
  
  /**
   * 创建新会话
   */
  createSession() {
    const sessionId = this.sessionCounter++;
    const session = {
      id: sessionId,
      name: `会话 ${sessionId}`,
      messages: [],
      createdAt: new Date().toISOString()
    };
    
    this.sessions.push(session);
    this.switchToSession(sessionId);
    this.saveSessions();
    this.renderSessionTabs();
  }
  
  /**
   * 切换到指定会话
   * @param {number} sessionId - 会话ID
   */
  switchToSession(sessionId) {
    // 更新当前会话ID
    this.currentSessionId = sessionId;
    
    // 获取当前会话
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) return;
    
    // 更新界面显示
    this.renderMessages(session.messages);
    
    // 更新标签页激活状态
    this.renderSessionTabs();
  }
  
  /**
   * 删除会话
   * @param {number} sessionId - 会话ID
   */
  deleteSession(sessionId) {
    if (this.sessions.length <= 1) {
      alert('至少需要保留一个会话');
      return;
    }
    
    // 删除会话
    this.sessions = this.sessions.filter(s => s.id !== sessionId);
    
    // 如果删除的是当前会话，切换到第一个会话
    if (this.currentSessionId === sessionId) {
      this.switchToSession(this.sessions[0].id);
    }
    
    this.saveSessions();
    this.renderSessionTabs();
  }
  
  /**
   * 重命名会话
   * @param {number} sessionId - 会话ID
   * @param {string} newName - 新名称
   */
  renameSession(sessionId, newName) {
    const session = this.sessions.find(s => s.id === sessionId);
    if (session) {
      session.name = newName;
      this.saveSessions();
      this.renderSessionTabs();
    }
  }
  
  /**
   * 渲染会话标签页
   */
  renderSessionTabs() {
    this.sessionTabs.innerHTML = '';
    
    this.sessions.forEach(session => {
      const tabContainer = document.createElement('div');
      tabContainer.className = 'session-tab-container';
      
      const tab = document.createElement('div');
      tab.className = `session-tab ${session.id === this.currentSessionId ? 'active' : ''}`;
      tab.textContent = session.name;
      tab.dataset.sessionId = session.id;
      
      tab.addEventListener('click', (e) => {
        const sessionId = parseInt(e.currentTarget.dataset.sessionId);
        this.switchToSession(sessionId);
      });
      
      // 添加右键菜单事件
      tab.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const newName = prompt('请输入新的会话名称:', session.name);
        if (newName) {
          this.renameSession(session.id, newName);
        }
      });
      
      // 添加删除按钮
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-session-btn';
      deleteBtn.textContent = '×';
      deleteBtn.dataset.sessionId = session.id;
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sessionId = parseInt(e.currentTarget.dataset.sessionId);
        // 确认删除
        if (this.sessions.length <= 1) {
          alert('至少需要保留一个会话');
          return;
        }
        
        if (confirm(`确定要删除会话 "${session.name}" 吗？`)) {
          this.deleteSession(sessionId);
        }
      });
      
      tabContainer.appendChild(tab);
      tabContainer.appendChild(deleteBtn);
      this.sessionTabs.appendChild(tabContainer);
    });
  }
  
  /**
   * 渲染消息
   * @param {Array} messages - 消息列表
   */
  renderMessages(messages) {
    this.chatHistory.innerHTML = '';
    
    if (messages.length === 0) {
      const welcomeMessage = document.createElement('div');
      welcomeMessage.className = 'message system-message';
      welcomeMessage.innerHTML = `
        <div class="message-content">
          欢迎使用 Ollama Web Interface！请选择模型并开始对话。
        </div>
      `;
      this.chatHistory.appendChild(welcomeMessage);
      return;
    }
    
    messages.forEach(message => {
      this.addMessageToUI(message.role, message.content, false);
    });
    
    // 滚动到底部
    this.scrollToBottom();
    
    // 渲染流程图
    this.renderDiagrams();
  }
  
  /**
   * 渲染流程图等图表
   */
  async renderDiagrams() {
    // 获取所有包含mermaid图表的代码块
    const codeBlocks = this.chatHistory.querySelectorAll('pre code.language-mermaid');
    codeBlocks.forEach(async (codeBlock, index) => {
      try {
        const code = codeBlock.textContent;
        const { svg, bindFunctions } = await mermaid.render(`mermaid-${Date.now()}-${index}`, code);
        const diagramDiv = document.createElement('div');
        diagramDiv.className = 'mermaid-diagram';
        diagramDiv.innerHTML = svg;
        codeBlock.parentNode.replaceWith(diagramDiv);
      } catch (error) {
        console.error('渲染Mermaid图表失败:', error);
      }
    });
  }
  
  /**
   * 获取当前会话
   * @returns {Object} 当前会话对象
   */
  getCurrentSession() {
    return this.sessions.find(s => s.id === this.currentSessionId);
  }
  
  /**
   * 绑定事件监听器
   */
  bindEvents() {
    this.sendButton.addEventListener('click', () => this.sendMessage());
    this.clearButton.addEventListener('click', () => this.clearChat());
    
    this.userInput.addEventListener('keydown', (e) => {
      // Ctrl + Enter 发送消息
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        this.sendMessage();
        return;
      }
      
      // Enter 发送消息（保持原有功能）
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
        e.preventDefault();
        this.sendMessage();
        return;
      }
      
      // 上下箭头键处理输入历史
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        this.handleInputHistory(e);
      }
    });
    
    this.temperatureSlider.addEventListener('input', () => {
      this.temperatureValue.textContent = this.temperatureSlider.value;
    });
    
    // API地址保存事件
    if (this.saveApiHostButton) {
      this.saveApiHostButton.addEventListener('click', () => this.saveApiHost());
    }
    
    // 添加刷新模型按钮事件
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '刷新模型';
    refreshBtn.className = 'btn btn-primary';
    refreshBtn.style.marginLeft = '10px';
    refreshBtn.addEventListener('click', () => this.refreshModels());
    
    // 将刷新按钮添加到模型选择器旁边
    const modelSelectParent = this.modelSelect.parentNode;
    modelSelectParent.appendChild(refreshBtn);
    
    // 会话标签页事件
    this.newSessionButton.addEventListener('click', () => this.createSession());
  }
  
  /**
   * 处理输入历史记录（上下箭头键）
   * @param {Event} e - 键盘事件
   */
  handleInputHistory(e) {
    const currentSession = this.getCurrentSession();
    if (!currentSession) return;
    
    // 获取用户消息历史
    const userMessages = currentSession.messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content);
    
    // 合并当前输入历史和会话历史
    this.inputHistory = [...userMessages];
    
    if (this.inputHistory.length === 0) return;
    
    e.preventDefault();
    
    if (e.key === 'ArrowUp') {
      // 如果当前没有历史记录索引，则从最后一条开始
      if (this.currentHistoryIndex === -1) {
        this.currentHistoryIndex = this.inputHistory.length - 1;
      } else if (this.currentHistoryIndex > 0) {
        // 否则向前移动
        this.currentHistoryIndex--;
      }
    } else if (e.key === 'ArrowDown') {
      if (this.currentHistoryIndex < this.inputHistory.length - 1) {
        this.currentHistoryIndex++;
      } else {
        // 到达最新记录时清空输入框
        this.currentHistoryIndex = -1;
        this.userInput.value = '';
        return;
      }
    }
    
    // 更新输入框内容
    if (this.currentHistoryIndex >= 0 && this.currentHistoryIndex < this.inputHistory.length) {
      this.userInput.value = this.inputHistory[this.currentHistoryIndex];
      // 将光标移到末尾
      this.userInput.selectionStart = this.userInput.value.length;
      this.userInput.selectionEnd = this.userInput.value.length;
    }
  }
  
  /**
   * 保存API地址到localStorage
   */
  saveApiHost() {
    const apiHost = this.apiHostInput.value.trim();
    if (apiHost) {
      localStorage.setItem('ollama-api-host', apiHost);
      // 更新API实例的baseUrl
      this.ollamaAPI.updateBaseUrl(apiHost);
      
      // 显示保存成功的提示
      this.addMessageToUI('system', 'API地址已保存！刷新页面后将使用新的配置。');
    }
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
      
      // 提供解决方案建议
      this.addMessageToUI('system', '解决建议:');
      this.addMessageToUI('system', '1. 确保 Ollama 服务正在运行');
      this.addMessageToUI('system', '2. 检查 API 地址是否正确 (当前: ' + this.ollamaAPI.baseUrl + ')');
      this.addMessageToUI('system', '3. 如果是跨域问题，请配置 Ollama 服务允许 CORS 或使用代理');
      this.addMessageToUI('system', '4. 检查防火墙设置是否阻止了连接');
    }
  }
  
  /**
   * 刷新模型列表
   */
  async refreshModels() {
    try {
      // 显示加载状态
      const refreshBtn = this.modelSelect.nextElementSibling;
      const originalText = refreshBtn.textContent;
      refreshBtn.textContent = '刷新中...';
      
      const models = await this.ollamaAPI.refreshModels();
      this.updateModelList(models);
      
      // 恢复按钮文本
      refreshBtn.textContent = '刷新模型';
      
      this.addMessageToUI('system', '模型列表已更新');
    } catch (error) {
      console.error('刷新模型列表失败:', error);
      this.addMessageToUI('system', `错误: ${error.message}`);
      
      // 恢复按钮文本
      const refreshBtn = this.modelSelect.nextElementSibling;
      if (refreshBtn) {
        refreshBtn.textContent = '刷新模型';
      }
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
    
    const currentSession = this.getCurrentSession();
    if (!currentSession) return;
    
    // 添加用户消息到界面和会话
    this.addMessageToUI('user', message);
    currentSession.messages.push({ role: 'user', content: message });
    this.saveSessions();
    
    // 添加到输入历史
    this.inputHistory.push(message);
    this.currentHistoryIndex = -1;
    
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
        currentSession.messages, 
        { temperature, maxTokens }
      );
      
      // 移除加载状态
      loadingElement.remove();
      
      // 添加助手消息到界面和会话
      this.addMessageToUI('assistant', response);
      currentSession.messages.push({ role: 'assistant', content: response });
      this.saveSessions();
      
    } catch (error) {
      // 移除加载状态
      loadingElement.remove();
      
      // 显示错误信息
      this.addMessageToUI('system', `错误: ${error.message}`);
      console.error('聊天请求失败:', error);
      
      // 提供解决方案建议
      if (error.message.includes('CORS') || error.message.includes('连接')) {
        this.addMessageToUI('system', '解决建议:');
        this.addMessageToUI('system', '1. 检查 Ollama 服务是否正在运行');
        this.addMessageToUI('system', '2. 确保 API 地址配置正确');
        this.addMessageToUI('system', '3. 如果是跨域问题，请配置 Ollama 服务允许 CORS');
      }
    }
  }
  
  /**
   * 添加系统消息到界面
   * @param {string} content - 消息内容
   */
  addSystemMessage(content) {
    this.addMessageToUI('system', content);
  }
  
  /**
   * 添加消息到界面
   * @param {string} role - 消息发送者角色
   * @param {string} content - 消息内容
   * @param {boolean} scrollToBottom - 是否滚动到底部
   */
  addMessageToUI(role, content, scrollToBottom = true) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${role}-message`);
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    
    // 如果是助手消息，解析Markdown
    if (role === 'assistant') {
      contentDiv.innerHTML = this.renderMarkdown(content);
    } else {
      contentDiv.textContent = content;
    }
    
    messageDiv.appendChild(contentDiv);
    this.chatHistory.appendChild(messageDiv);
    
    // 滚动到底部
    if (scrollToBottom) {
      this.scrollToBottom();
    }
    
    // 如果是助手消息，渲染其中可能包含的图表
    if (role === 'assistant') {
      setTimeout(() => {
        this.renderDiagrams();
      }, 100);
    }
  }
  
  /**
   * 渲染Markdown内容
   * @param {string} content - Markdown内容
   * @returns {string} 渲染后的HTML
   */
  renderMarkdown(content) {
    // 自定义渲染器以支持Mermaid图表
    const renderer = new marked.Renderer();
    
    // 保存原始的代码渲染方法
    const originalCode = renderer.code;
    
    // 重写代码块渲染方法，为mermaid代码块添加特殊标识
    renderer.code = function(code, infostring, escaped) {
      if (infostring === 'mermaid') {
        return `<pre class="mermaid-code"><code class="language-mermaid">${code}</code></pre>`;
      }
      return originalCode.call(this, code, infostring, escaped);
    };
    
    // 配置marked选项
    marked.setOptions({
      renderer: renderer,
      gfm: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    });
    
    return marked.parse(content);
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
   * 清空当前会话的聊天记录
   */
  clearChat() {
    const currentSession = this.getCurrentSession();
    if (currentSession) {
      currentSession.messages = [];
      this.saveSessions();
      this.renderMessages([]);
    }
  }
}

// 导出ChatComponent类
export default ChatComponent;