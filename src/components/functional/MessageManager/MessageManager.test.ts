import { _postMessage, useMessageManager } from './MessageManager';
import React from "react";
import { render } from "@testing-library/react-native";
const fetchData = jest.fn(() => Promise.resolve({ data: "hello" }));

describe('_postMessage 函数', () => {
  test('发送文本消息', async () => {
    const message = {
      content: {
        type: 'text',
        text: '这是一条文本消息',
      },
      sender: { id: '123' },
      recipient: '456',
    };

    const result = await _postMessage(message);

    expect(result).toBeDefined();
  });

  test('发送图片消息', async () => {
    const message = {
      content: {
        type: 'image',
        mediaUrl: 'image.jpg',
      },
      sender: { id: '123' },
      recipient: '456',
    };

    const result = await _postMessage(message);

    expect(result).toBeDefined();
  });

  test('发送文件消息', async () => {
    const message = {
      content: {
        type: 'file',
        mediaUrl: 'file.pdf',
      },
      sender: { id: '123' },
      recipient: '456',
    };

    const result = await _postMessage(message);

    expect(result).toBeDefined();
  });

  test('不支持的消息类型', async () => {
    const message = {
      content: {
        type: 'unsupportedType',
      },
      sender: { id: '123' },
      recipient: '456',
    };

    await expect(_postMessage(message)).rejects.toThrow('Unsupported message type: unsupportedType');
  });
});

describe('useMessageManager 函数', () => {
  let messageManager;

  beforeEach(() => {
    messageManager = useMessageManager();
  });

  test('发送消息', () => {
    const message = {
      content: {
        type: 'text',
        text: '这是一条文本消息',
      },
      sender: { id: '123' },
      recipient: '456',
    };

    const callbacks = [];

    messageManager.handleSendMessage(message, callbacks);

    // 可以添加更多的断言来检查 Redux 状态的更新等
  });

  test('接收消息', async () => {
    const messages = [
      {
        content: {
          type: 'text',
          text: '这是一条接收的文本消息',
        },
        sender: { id: '123' },
        recipient: '456',
      },
    ];

    await messageManager.handleReceivedMessages(messages);

    // 可以添加更多的断言来检查 Redux 状态的更新等
  });

  test('创建消息', () => {
    const contentRaw = '这是消息内容';
    const contentType = 'text';

    const message = messageManager.createMessage(contentRaw, contentType);

    expect(message).toBeDefined();
    expect(message.content.type).toEqual(contentType);
  });
});
