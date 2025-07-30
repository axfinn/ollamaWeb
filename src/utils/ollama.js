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
   * 获取可用模型列表
   * @returns {Promise<Array>} 模型列表
   */
  async getModels() {
    try {
      // 在实际实现中，应该调用Ollama API获取模型列表
      // 这里返回模拟数据
      return [
        { name: 'llama2', modified_at: '2023-08-23T09:12:30Z' },
        { name: 'mistral', modified_at: '2023-10-15T14:30:45Z' },
        { name: 'codellama', modified_at: '2023-11-20T11:22:33Z' }
      ];
      
      /* 实际API调用应如下所示:
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.models;
      */
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
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 返回模拟响应
      const responses = [
        `这是来自 ${model} 模型的响应。Temperature设置为 ${options.temperature || 0.7}。`,
        `我理解您的问题。基于您选择的 ${model} 模型，我会尽力回答。`,
        `这是一个模拟响应，展示了连续对话功能。您可以继续提问。`,
        `在实际应用中，这里会是Ollama模型的真实响应。`
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
      
      /* 实际API调用应如下所示:
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
      */
    } catch (error) {
      console.error('聊天请求失败:', error);
      throw error;
    }
  }
}

// 导出OllamaAPI类
export default OllamaAPI;