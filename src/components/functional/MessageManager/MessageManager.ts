import {postMessageAPI} from '@/apis/messages';
import {postAttachAPI} from '@/apis/attachments';
import {MessageInterface} from '@/store/modules/Messages';
import { useDispatch, useSelector } from 'react-redux';
import {
  setConversations,
  setConversationId,
  addConversation,
  addMessageToConversation,
} from '@/store/modules/Conversations';
import { addMessage, setMessage } from '@/store/modules/Messages';
import { useEffect } from 'react';
import _ from 'lodash';
import { ConversationInterface } from '@/store/modules/Conversations';
import { getMessagesByPage, insertMessage } from '@/utils/database.ts';

export const _postMessage = async (message: MessageInterface) => {
  try {
    const formData = new FormData();
    formData.append('message', message);
    // 附加普通字段 sender 和 recipient
    formData.append('sender', message.sender.id);  // 发送者ID
    if (Array.isArray(message.recipient)){
      formData.append('recipient', message.recipient[0].id);  // TODO: 暂时只支持单聊
    }else{
      formData.append('recipient', message.recipient.id);  // 接收者ID
    }
    let response: any|null = null;
    let result = null;
    switch (message.content.type) {
      case 'text':
        await postMessageAPI(JSON.stringify(message));
        break;
      case 'image':
        formData.append('image', {
          uri: message.content.mediaUrl,
          type: message.content.mediaInfo?.mimeType || 'image/jpeg',
          name: message.content.mediaInfo?.name || 'image',
        });
        response = await postAttachAPI(formData);
        await postMessageAPI(
          JSON.stringify({
            ...message,
            content: {
              ...message.content,
              url: response.data.url,
            },
          }),
        );
        break;
      case 'file':
        formData.append('file', {
          uri: message.content.mediaUrl,
          type: message.content.mediaInfo?.mimeType || 'file/pdf',
          name: message.content.mediaInfo?.name,
        });
        response = await postAttachAPI(formData);
        await postMessageAPI(
          JSON.stringify({
            ...message,
            content: {
              ...message.content,
              url: response.data.url,
            },
          }),
        );
        result = await response.json();
        break;
      default:
        console.error('Unsupported message type:', message.content.type);
        break;
    }
    return result?.url;
  } catch (error) {
    throw error; // 抛出错误，以便可以在外部捕获
  }
};

// MessageManager逻辑
export const useMessageManager = () => {
  const dispatch = useDispatch();
  const {activeConversationId} = useSelector((state) => state.conversation);
  const conversations = useSelector((state) => state.conversation.conversations);
  const handleSendMessage = (message: MessageInterface, callbacks: (()=>void)[]) => {
    postMessage(message);
    // Insert into SQLite
    // insertMessage(message);
    // Dispatch Redux action to update the conversation state
    dispatch(addMessageToConversation(message));
    dispatch(addMessage(message));
    callbacks.forEach((callback) => callback());
  };

  // Handle received message
  const handleReceivedMessages = (messages: MessageInterface[]) => {
    // 按 conversationId 对消息分组
    const groupedMessages = _.groupBy(messages, 'conversationId');
    // console.log('groupedMessages', groupedMessages);
    // console.dir(groupedMessages);
    Object.entries(groupedMessages).forEach(([conversationId, msgs]) => {
      const conversation = conversations[conversationId];

      if (conversation) {
        // 如果会话已存在，将所有消息批量添加到会话
        msgs.forEach((message) => {
          dispatch(addMessageToConversation(message));
          if (conversation.id === activeConversationId) {
            dispatch(addMessage(message));
          }
        });
      } else {
        // 如果会话不存在，创建新的会话
        const firstMessage = msgs[0]; // 获取分组中的第一条消息，用于初始化会话
        const newConversation: ConversationInterface = {
          chatObject: {
            user: firstMessage.sender,
            nickname: 'peter',
            conversationId,
          },
          conversationId,
          participants: [
            firstMessage.sender,
            ...(Array.isArray(firstMessage.recipient) ? firstMessage.recipient : [firstMessage.recipient]),
          ],
          messages: msgs, // 将分组的消息作为初始消息列表
          currentPage: 1,
          totalPages: 1,
          unreadCounts: {
            [firstMessage.sender.id]: msgs.length,
          },
          unreadCountTotal: msgs.length,
          lastMessage: msgs[msgs.length - 1], // 最后一条消息
          isGroup: false, // 根据需要判断是否为群聊
          isMuted: false,
        };
        // console.log('newConversation', newConversation);
        dispatch(addConversation(newConversation));
      }
      // insertMessage(message);
    });
  };

  const loadMessages = async (conversation: ConversationInterface, page: number) => {
    if (conversation && page <= conversation.totalPages) {
      // 从后端或者本地存储获取消息数据（假设有一个 API 或数据库）
      const newMessages = await getMessagesByPage(conversation.conversationId, page);
      conversation.messages = [...newMessages, ...conversation.messages];
      conversation.currentPage = page;
    }
  };

  const onScrollToTop = () => {
    const conversation = conversations[activeConversationId];
    if (conversation.currentPage < conversation.totalPages) {
      loadMessages(activeConversationId, conversation.currentPage + 1);
    }
  };
  // Set the current conversation to be active
  const setActiveConversation = (conversationId: string) => {
    dispatch(setConversationId(conversationId));
  };

  // 获取特定会话的消息
  const getMessagesForConversation = (conversationId: string) => {
    const conversation = conversations[conversationId];
    return conversation ? conversation.messages : [];
  };

  // 更新会话的逻辑
  const updateConversation = (message: MessageInterface) => {
    const conversation:ConversationInterface = conversations[message.conversationId];
    if (conversation) {
      dispatch(addMessageToConversation(message));
    } else {
      // 如果该会话不存在，创建新的会话并添加消息
      const newConversation: ConversationInterface = {
        conversationId: message.conversationId,
        participants: [message.sender, ...(Array.isArray(message.recipient) ? message.recipient : [message.recipient])],
        messages: [message],
        currentPage: 1,
        totalPages: 1,
        unreadCounts: { [message.sender.id]: 1 },
        unreadCountTotal: 1,
        lastMessage: message,
        isGroup: false,  // 你可以根据需要来判断是否为群聊
        isMuted: false,
      };
      console.log('newConversation', newConversation);
      dispatch(addConversation(newConversation));
    }
  };

  // 发送消息的逻辑
  const postMessage = async (message: MessageInterface) => {
    try {
      await _postMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return { postMessage, handleReceivedMessage: handleReceivedMessages, handleSendMessage };
};
