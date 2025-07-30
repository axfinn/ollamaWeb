/**
 * Ollama API 工具类
 * 提供与Ollama后端服务的交互功能
 */

class OllamaAPI {
  /**
   * 构造函数
   * @param {string} baseUrl - Ollama服务的基础URL
   */
  constructor(baseUrl = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
    this.chatEndpoint = `${this.baseUrl}/api/chat`;
  }

  /**
   * 设置基础 URL
   * @param {string} baseUrl - 新的基础 URL
   */
  setBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
    this.chatEndpoint = `${this.baseUrl}/api/chat`;
  }

  /**
   * 获取当前基础 URL
   * @returns {string} 当前基础 URL
   */
  getBaseUrl() {
    return this.baseUrl;
  }

  /**
   * 获取可用模型列表
   * @returns {Promise<Array>} 模型列表
   */
  async getModels() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.models;
    } catch (error) {
      console.error('获取模型列表失败:', error);
      throw error;
    }
  }

  /**
   * 发送聊天消息
   * @param {string} model - 模型名称
   * @param {Array} messages - 消息历史
   * @param {Object} options - 配置选项
   * @returns {Promise<string>} 模型响应
   */
  async chat(model, messages, options = {}) {
    try {
      const payload = {
        model: model,
        messages: messages,
        stream: false,
        options: {
          temperature: options.temperature,
          num_predict: options.maxTokens
        }
      };
      
      const response = await fetch(this.chatEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.message.content;
    } catch (error) {
      console.error('聊天请求失败:', error);
      throw error;
    }
  }
}

// 导出OllamaAPI类
export default OllamaAPI;