class OllamaChat {
    constructor() {
        this.chatHistory = document.getElementById('chat-history');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-btn');
        this.clearButton = document.getElementById('clear-btn');
        this.modelSelect = document.getElementById('model-select');
        this.temperatureSlider = document.getElementById('temperature');
        this.temperatureValue = document.getElementById('temperature-value');
        this.maxTokensInput = document.getElementById('max-tokens');
        
        this.messages = [];
        this.init();
    }
    
    init() {
        // 绑定事件
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
        
        // 初始化参数显示
        this.temperatureValue.textContent = this.temperatureSlider.value;
    }
    
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
            const response = await this.callOllamaAPI(model, this.messages, temperature, maxTokens);
            
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
    
    async callOllamaAPI(model, messages, temperature, maxTokens) {
        // 这里应该调用实际的Ollama API
        // 由于我们没有实际的后端，暂时模拟API响应
        
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟响应
        const responses = [
            "这是来自Ollama的响应。您选择了模型: " + model + "，Temperature设置为: " + temperature,
            "我理解您的问题。基于您提供的参数，我会尽力回答。",
            "这是一个模拟响应，展示了连续对话功能。您可以继续提问。",
            "在实际应用中，这里会是Ollama模型的真实响应。"
        ];
        
        // 返回随机响应以模拟不同回答
        return responses[Math.floor(Math.random() * responses.length)];
        
        /* 实际的API调用应该如下所示:
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                stream: false,
                options: {
                    temperature: temperature,
                    num_predict: maxTokens
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        return data.message.content;
        */
    }
    
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

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new OllamaChat();
});