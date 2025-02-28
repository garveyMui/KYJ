import OpenAI from 'openai';
import {addMessage, MessageInterface, updateLastMessage} from '@/store/modules/Messages.ts';
import {AppDispatch} from '@/store/index.ts';
// import {fetch} from 'expo/fetch';
import SSE from 'react-native-sse';
import {useMessageManager} from '@/components/functional/MessageManager';

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

export async function streamChat(messages: MessageInterface, llmConfig:Object={},
                                 createMessage) {
  const messagesConverted = messageConvertion(messages);
  if (!llmConfig) {
    llmConfig = {
      baseURL: 'https://api.deepseek.com/',
      apiKey: APIKeys.deepseek,
    };
  }
  console.log('messagesConverted', messagesConverted);
  const messageBody = {
    messages: [messagesConverted],
    model: "deepseek-chat",
    frequency_penalty: 0,
    max_tokens: 2048,
    presence_penalty: 0,
    response_format: {
      type: "text",
    },
    stop: null,
    stream: true,
    stream_options: null,
    temperature: 1,
    top_p: 1,
    tools: null,
    tool_choice: "none",
    logprobs: false,
    top_logprobs: null,
  };
  return async (dispatch: AppDispatch) => {
    try {
      let chunks = [];
      const eventSource = new SSE('https://api.deepseek.com/chat/completions', {
        headers: {
          Authorization: `Bearer ${APIKeys.deepseek}`,
          "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify(messageBody),
        pollingInterval: 0,
      });

      eventSource.addEventListener('message', (event) => {
        const chunk = event.data;
        const match = chunk.match(/{"content":".*?"}/g);
        let content = "";
        if (match) {
          content = "".concat(
            ...match.map((item) => {
              return item
                .toString()
                .substring(12, item.length - 2);
            }));
        }
        dispatch(updateLastMessage(
          {
            content,
            role: "assistant",
          }
        ));
        chunks.push(content);
        console.log('Received message:', chunks);
      });

      eventSource.addEventListener('open', () => {
        console.log('SSE connection opened');
        const response_msg = createMessage(
          '', 'text', '', 'LLM');
        dispatch(addMessage(
          response_msg
        ));
      });

      eventSource.addEventListener('error', (error) => {
        console.error('SSE error:', error);
      });
    } catch (error) {
      console.error("Error posting message: ", error);
    }
  };
}













