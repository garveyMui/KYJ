import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import OpenAI from 'openai';
import axios from 'axios';
export const DocsContext = createContext();

export const DocsContextProvider = ({ children }) => {
  const [baseURL, setBaseURL] = useState('');
  const coversationId = 'LLM';
  const optionalLLM = {
    'deepseek': {
      baseURL: baseURL,
      apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
    'chatglm': {

    },
    'doubao': {

    },
    'qwen': {

    },
    'hunyuan': {

    },
    'diy': {

    },
  };
  const registerDIY  = useCallback((baseURL, apikey) => {
    optionalLLM[baseURL] = apikey;
  }, [optionalLLM]);
  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: '<DeepSeek API Key>'
  });
  async function main() {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "deepseek-chat",
    });

    console.log(completion.choices[0].message.content);
  }
  const conversationContext = {};
  // 处理用户输入的函数
  async function handleUserInput(userInput) {
    try {
      const { conversationId, parentMessageId } = conversationContext;

      // 调用 ChatGPT 接口
      const response = await api.sendMessage(userInput, {
        conversationId, // 传递会话 ID
        parentMessageId, // 传递父消息 ID
        onProgress: (partialResponse) => {
          process.stdout.write(partialResponse.text); // 实时输出流式响应
        },
      });

      console.log('\n'); // 完成一轮流式输出后换行

      // 更新对话上下文
      conversationContext = {
        conversationId: response.conversationId,
        parentMessageId: response.id,
      };

      return response.text;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  // 主函数，模拟多轮对话
  async function main() {
    console.log('欢迎使用 ChatGPT 多轮对话！按 Ctrl+C 退出程序。');

    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // 循环处理用户输入
    while (true) {
      const userInput = await new Promise((resolve) => {
        rl.question('你: ', (input) => resolve(input));
      });

      if (userInput.toLowerCase() === 'exit') {
        console.log('再见！');
        rl.close();
        break;
      }

      console.log('ChatGPT:');
      await handleUserInput(userInput);
    }
  }
  async function streamChatGPT(apiKey, messages) {
    const url = 'https://api.openai.com/v1/chat/completions';

    try {
      const response = await axios({
        method: 'post',
        url: url,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        data: {
          model: 'gpt-4', // 或者 'gpt-3.5-turbo'
          messages: messages,
          stream: true,
        },
        responseType: 'stream',
      });

      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          if (line === '[DONE]') {
            console.log('Stream finished');
            return;
          }
          const json = JSON.parse(line.replace(/^data: /, ''));
          if (json.choices && json.choices.length > 0) {
            const content = json.choices[0].delta?.content || '';
            process.stdout.write(content);
          }
        }
      });

      response.data.on('end', () => {
        console.log('\nStream closed by server.');
      });

      response.data.on('error', (err) => {
        console.error('Stream error:', err);
      });
    } catch (error) {
      console.error('Error during API call:', error.response ? error.response.data : error.message);
    }
  }

// 使用示例
  const apiKey = 'your-openai-api-key'; // 替换为您的 API 密钥
  const messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Can you explain how streaming works in ChatGPT?' },
  ];

  const docsContext = {

  };
  return (
    <DocsContext.Provider value={docsContext}>
      {children}
    </DocsContext.Provider>
  );
};

export const useDocsContext = () => {
  return useContext(DocsContext);
};
