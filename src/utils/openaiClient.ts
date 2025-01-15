import OpenAI from 'openai';
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {MessageInterface} from '@/store/modules/Messages.ts';
import {Readable} from 'openai/_shims';

const APIKeys = require('@/assets/API_keys.json');
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: `${APIKeys.deepseek}`,
});

export async function syncChat(message: MessageInterface, llmConfig:Object={}) {
  console.log('message in syncChat', message);
  const messageConverted = messageConvertion(message);
  const completion = await openai.chat.completions.create({
    messages: [messageConverted],
    model: "deepseek-chat",
  });
  return completion.choices[0].message.content;
}

export function messageConvertion(message: MessageInterface){
  const messageConverted = {
    role: 'user',
    content: message.content.text || message.content.type,
  };
  return messageConverted;
}

export async function streamChat(messages: MessageInterface, llmConfig:Object={}) {
  const messagesConverted = messageConvertion(messages);
  if (!llmConfig){
    llmConfig = {
      'baseURL': 'https://api.deepseek.com/',
      'apiKey': APIKeys.deepseek,
    };
  }

  console.log('------------------here------------------');
  try {
    let data = JSON.stringify({
      "messages": [
        messagesConverted,
      ],
      "model": "deepseek-chat",
      "frequency_penalty": 0,
      "max_tokens": 2048,
      "presence_penalty": 0,
      "response_format": {
        "type": "text"
      },
      "stop": null,
      "stream": true,
      "stream_options": null,
      "temperature": 1,
      "top_p": 1,
      "tools": null,
      "tool_choice": "none",
      "logprobs": false,
      "top_logprobs": null
    });

    let config: AxiosRequestConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.deepseek.com/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${APIKeys.deepseek}`,
      },
      data : data,
      // responseType: 'stream',
    };

    const response = await axios(config);
    // 检查响应状态
    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }
    const chuncks = [];
    // 获取响应的可读流并处理流数据
    let done = false;
    while (!done) {
      const chunk = await JSON.stringify(response.data);
      console.log(JSON.parse(chunk).data);
      chuncks.push(chunk);
      if (chunk.includes('data: [DONE]')) {
        done = true;
      }
      break;
    }
  } catch (error) {
    console.error('Error during API call:', error.response ? error.response.data : error.message);
  }
}













