/**
 * Ollama API 工具类
 * 提供与Ollama后端服务的交互功能
 */

import { OLLAMA_API_HOST } from '../config.js';

class OllamaAPI {
  /**
   * 构造函数
   */
  constructor() {
    this.baseUrl = OLLAMA_API_HOST;
    // 在开发环境中使用代理以避免CORS问题
    // 注意：如果不再使用Vite代理，此useProxy逻辑可能需要调整或移除
    this.useProxy = import.meta.env?.DEV && !this.baseUrl.includes(window.location.hostname);
    this.initEndpoints();
  }

  /**
   * 初始化所有端点
   */
  initEndpoints() {
    if (this.useProxy) {
      // 使用相对路径通过代理访问API
      this.chatEndpoint = `/api/chat`;
      this.tagsEndpoint = `/api/tags`;
      this.generateEndpoint = `/api/generate`;
      this.embeddingsEndpoint = `/api/embeddings`;
      this.psEndpoint = `/api/ps`;
      this.showEndpoint = `/api/show`;
      this.createEndpoint = `/api/create`;
      this.pullEndpoint = `/api/pull`;
      this.pushEndpoint = `/api/push`;
      this.copyEndpoint = `/api/copy`;
      this.deleteEndpoint = `/api/delete`;
      this.listEndpoint = `/api/tags`;
      this.embedEndpoint = `/api/embed`;
      this.blobsEndpoint = `/api/blobs`;
    } else {
      // 直接访问API
      this.chatEndpoint = `${this.baseUrl}/api/chat`;
      this.tagsEndpoint = `${this.baseUrl}/api/tags`;
      this.generateEndpoint = `${this.baseUrl}/api/generate`;
      this.embeddingsEndpoint = `${this.baseUrl}/api/embeddings`;
      this.psEndpoint = `${this.baseUrl}/api/ps`;
      this.showEndpoint = `${this.baseUrl}/api/show`;
      this.createEndpoint = `${this.baseUrl}/api/create`;
      this.pullEndpoint = `${this.baseUrl}/api/pull`;
      this.pushEndpoint = `${this.baseUrl}/api/push`;
      this.copyEndpoint = `${this.baseUrl}/api/copy`;
      this.deleteEndpoint = `${this.baseUrl}/api/delete`;
      this.listEndpoint = `${this.baseUrl}/api/tags`;
      this.embedEndpoint = `${this.baseUrl}/api/embed`;
      this.blobsEndpoint = `${this.baseUrl}/api/blobs`;
    }
  }

  /**
   * 更新API基础URL
   * @param {string} newBaseUrl - 新的基础URL
   */
  updateBaseUrl(newBaseUrl) {
    this.baseUrl = newBaseUrl;
    // 重新判断是否使用代理
    this.useProxy = import.meta.env?.DEV && !this.baseUrl.includes(window.location.hostname);
    this.initEndpoints();
  }

  /**
   * 刷新API配置
   */
  refreshConfig() {
    // 重新从 config.js 获取配置
    this.baseUrl = OLLAMA_API_HOST;
    // 重新判断是否使用代理
    this.useProxy = import.meta.env?.DEV && !this.baseUrl.includes(window.location.hostname);
    this.initEndpoints();
  }

  /**
   * 获取可用模型列表
   * @returns {Promise<Array>} 模型列表
   */
  async getModels() {
    try {
      const response = await fetch(this.tagsEndpoint);
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        if (response.status === 403) {
          errorMessage += ' (访问被拒绝，可能是CORS问题或防火墙阻止)';
        } else if (response.status === 404) {
          errorMessage += ' (API路径未找到，请检查Ollama服务是否正常运行)';
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('获取模型列表失败:', error);
      let errorMessage = `无法连接到 Ollama 服务，请确保服务正在运行且可访问 (${this.baseUrl})`;
      
      // 提供更具体的错误信息
      if (error instanceof TypeError && error.message.includes('fetch')) {
        if (error.message.includes('ERR_CONNECTION_REFUSED')) {
          errorMessage = `连接被拒绝，请检查 Ollama 服务是否正在运行，或防火墙是否阻止了连接 (${this.baseUrl})`;
        } else if (error.message.includes('CORS')) {
          errorMessage = `跨域请求被阻止，请确保 Ollama 服务已正确配置 CORS 或使用代理 (${this.baseUrl})`;
        } else {
          errorMessage = `网络错误，请检查网络连接或 Ollama 服务地址是否正确 (${this.baseUrl})`;
        }
      } else if (error.message.includes('403')) {
        errorMessage = `访问被禁止，请检查 Ollama 服务配置或防火墙设置 (${this.baseUrl})`;
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * 刷新模型列表
   * @returns {Promise<Array>} 模型列表
   */
  async refreshModels() {
    // 重新加载模型列表
    return await this.getModels();
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
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorData}`);
      }
      
      const data = await response.json();
      return data.message.content;
    } catch (error) {
      console.error('聊天请求失败:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('无法连接到 Ollama 服务，请确保服务正在运行且可访问');
      }
      throw error;
    }
  }

  /**
   * 生成文本内容
   * @param {string} model - 模型名称
   * @param {string} prompt - 提示词
   * @param {Object} options - 配置选项
   * @returns {Promise<string>} 生成的文本
   */
  async generate(model, prompt, options = {}) {
    try {
      const payload = {
        model: model,
        prompt: prompt,
        stream: false,
        options: options
      };
      
      const response = await fetch(this.generateEndpoint, {
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
      return data.response;
    } catch (error) {
      console.error('生成请求失败:', error);
      throw error;
    }
  }

  /**
   * 获取嵌入向量 (新版本API)
   * @param {string} model - 模型名称
   * @param {string|Array} input - 输入文本或文本数组
   * @returns {Promise<Object>} 嵌入结果
   */
  async embed(model, input) {
    try {
      const payload = {
        model: model,
        input: input
      };
      
      const response = await fetch(this.embedEndpoint, {
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
      return data;
    } catch (error) {
      console.error('嵌入请求失败:', error);
      throw error;
    }
  }

  /**
   * 获取嵌入向量 (旧版本API)
   * @param {string} model - 模型名称
   * @param {string} input - 输入文本
   * @returns {Promise<Array>} 嵌入向量
   */
  async embeddings(model, input) {
    try {
      const payload = {
        model: model,
        prompt: input
      };
      
      const response = await fetch(this.embeddingsEndpoint, {
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
      return data.embedding;
    } catch (error) {
      console.error('嵌入请求失败:', error);
      throw error;
    }
  }

  /**
   * 获取运行中的模型列表
   * @returns {Promise<Array>} 运行中的模型列表
   */
  async ps() {
    try {
      const response = await fetch(this.psEndpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.models;
    } catch (error) {
      console.error('获取运行中模型列表失败:', error);
      throw error;
    }
  }

  /**
   * 获取模型信息
   * @param {string} model - 模型名称
   * @returns {Promise<Object>} 模型信息
   */
  async show(model) {
    try {
      const payload = {
        name: model
      };
      
      const response = await fetch(this.showEndpoint, {
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
      return data;
    } catch (error) {
      console.error('获取模型信息失败:', error);
      throw error;
    }
  }

  /**
   * 创建模型
   * @param {string} model - 模型名称
   * @param {string} path - 模型文件路径
   * @param {Function} onProgress - 进度回调函数
   * @returns {Promise<Object>} 创建结果
   */
  async create(model, path, onProgress) {
    try {
      const payload = {
        name: model,
        path: path,
        stream: false
      };
      
      const response = await fetch(this.createEndpoint, {
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
      return data;
    } catch (error) {
      console.error('创建模型失败:', error);
      throw error;
    }
  }

  /**
   * 拉取模型
   * @param {string} model - 模型名称
   * @param {Function} onProgress - 进度回调函数
   * @returns {Promise<Object>} 拉取结果
   */
  async pull(model, onProgress) {
    try {
      const payload = {
        name: model,
        stream: false
      };
      
      const response = await fetch(this.pullEndpoint, {
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
      return data;
    } catch (error) {
      console.error('拉取模型失败:', error);
      throw error;
    }
  }

  /**
   * 推送模型
   * @param {string} model - 模型名称
   * @param {Function} onProgress - 进度回调函数
   * @returns {Promise<Object>} 推送结果
   */
  async push(model, onProgress) {
    try {
      const payload = {
        name: model,
        stream: false
      };
      
      const response = await fetch(this.pushEndpoint, {
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
      return data;
    } catch (error) {
      console.error('推送模型失败:', error);
      throw error;
    }
  }

  /**
   * 复制模型
   * @param {string} source - 源模型名称
   * @param {string} destination - 目标模型名称
   * @returns {Promise<Object>} 复制结果
   */
  async copy(source, destination) {
    try {
      const payload = {
        source: source,
        destination: destination
      };
      
      const response = await fetch(this.copyEndpoint, {
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
      return data;
    } catch (error) {
      console.error('复制模型失败:', error);
      throw error;
    }
  }

  /**
   * 删除模型
   * @param {string} model - 模型名称
   * @returns {Promise<Object>} 删除结果
   */
  async delete(model) {
    try {
      const payload = {
        name: model
      };
      
      const response = await fetch(this.deleteEndpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('删除模型失败:', error);
      throw error;
    }
  }

  /**
   * 创建 Blob
   * @param {string} digest - 摘要
   * @param {Blob} blob - Blob 数据
   * @returns {Promise<Object>} 创建结果
   */
  async createBlob(digest, blob) {
    try {
      const response = await fetch(`${this.blobsEndpoint}/${digest}`, {
        method: 'POST',
        body: blob
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('创建Blob失败:', error);
      throw error;
    }
  }

  /**
   * 检查 Blob 是否存在
   * @param {string} digest - 摘要
   * @returns {Promise<boolean>} 是否存在
   */
  async headBlob(digest) {
    try {
      const response = await fetch(`${this.blobsEndpoint}/${digest}`, {
        method: 'HEAD'
      });
      
      return response.ok;
    } catch (error) {
      console.error('检查Blob失败:', error);
      throw error;
    }
  }
}

// 导出OllamaAPI类
export default OllamaAPI;