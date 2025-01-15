import {postMessageAPI} from '@/apis/messages';
import {getAttachAPI, postAttachAPI} from '@/apis/attachments';
import {addDocument, addMessage, MessageInterface, MessageStatus} from '@/store/modules/Messages';
import {useDispatch, useSelector} from 'react-redux';
import {
  addConversation,
  addMessageToConversation,
  ConversationInterface,
  setConversationId,
} from '@/store/modules/Conversations';
import _ from 'lodash';
import {
  getMessagesByPage,
  insertConversation,
  insertMessages,
} from '@/utils/database.ts';
import {Contact} from '@/store/modules/Contacts.ts';
import {streamChatGPT, syncChat} from '@/utils/openaiClient.ts';
import {v4 as uuidv4} from 'uuid';
import dayjs from 'dayjs';
import {ChatObject} from '@/store/modules/ChatObject.ts';


export const _postMessage = async (message: MessageInterface) => {
  try {
    console.log('msg pending sending', message);
    const formData = new FormData();
    formData.append('message', message);
    // 附加普通字段 sender 和 recipient
    formData.append('sender', message.sender.id); // 发送者ID
    formData.append('recipient', message.recipient); // 所有接收者ID
    let response: any | null = null;
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
  const {contacts} = useSelector(state => state.contacts);

  const handleSendMessage = (message: MessageInterface, callbacks: (()=>void)[]) => {
    // Internet
    postMessage(message);
    // Database
    // Insert into SQLite
    insertMessages([message]);
    // Dispatch Redux action to update the conversation state
    console.log('sendMessage', message);
    dispatch(addMessageToConversation(message));
    dispatch(addMessage(message));
    callbacks.forEach((callback) => callback());
  };

  const fetchAttachments = async (attachmentUrl: string, mimeType: string = 'image/jpeg') => {
    try {
      const response = await getAttachAPI(attachmentUrl);
      // const blob = await response.data.blob();
      const blob = new Blob([response.data], { type:  mimeType });
      const url = URL.createObjectURL(blob);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error fetching attachment:', error);
    }
  };
  // Handle received message
  const handleReceivedMessages = async (messages: MessageInterface[]) => {
    const DocsMsgs = messages.filter((msg) => {
      return msg.content.type === 'file';
    });
    dispatch(addDocument(DocsMsgs));
    // 按 conversationId 对消息分组
    const groupedMessages = _.groupBy(messages, 'conversationId');
    Object.entries(groupedMessages).forEach(([conversationId, msgs]) => {
      const conversation: ConversationInterface = conversations[conversationId];

      if (conversation) {
        // 如果会话已存在，将所有消息批量添加到会话
        console.log('inserting msgs', msgs);
        console.log('conversationId', conversationId);
        console.log('activeConversationId', activeConversationId);
        msgs.forEach((msg) => {
          dispatch(addMessageToConversation(msg));
          console.log(conversation.conversationId);
          if (conversation.conversationId === activeConversationId) {
            console.log('here reached');
            dispatch(addMessage(msg));
          }
        });
      } else {
        // 如果会话不存在，创建新的会话
        const lastMessage = msgs[msgs.length - 1];
        const isGroup = Array.isArray(lastMessage.recipient) && lastMessage.recipient.length > 1;
        let displayName = '';
        let avatar = '';
        let contact: Contact|undefined;
        if (Array.isArray(lastMessage.recipient) && lastMessage.recipient.length > 1) {
          displayName = '[group chat]' + lastMessage.recipient.map((user) => user.name).join(', ');
          avatar = lastMessage.recipient[0].avatar;
        }else{
          contact = contacts.find((c: Contact) => c.user.id === lastMessage.sender.id);
          displayName = contact?.nickname || lastMessage.sender.name || 'husky';
          avatar = lastMessage.sender.avatar;
        }
        let lastMessageAbstract = '';
        const truncLength = 50;
        if (lastMessage.content.type === 'text') {
          lastMessageAbstract = lastMessage.content.text.length > truncLength ?
            lastMessage.content.text.substring(0, truncLength) :
            lastMessage.content.text;
        }else{
          lastMessageAbstract = `[${lastMessage.content.type}]`;
        }
        const newConversation: ConversationInterface = {
          lastUpdateTime: lastMessage.timestamp,
          conversationId,
          unreadCountTotal: msgs.length,
          isGroup: isGroup, // 根据需要判断是否为群聊
          isMuted: isGroup ? false : contact?.settings.mute ?? false,
          chatObject: {
            id: lastMessage.sender.id,
            displayName: displayName,
            avatar: avatar,
            conversationId,
          },
          lastMessageAbstract,
          groupInfo: lastMessage.groupInfo,
          messages: msgs, // 将分组的消息作为初始消息列表
          currentPage: 1,
          totalPages: 1,
          unreadCounts: {
            [lastMessage.sender.id]: msgs.length,
          },
        };
        dispatch(addConversation(newConversation));
        insertConversation(newConversation);
      }
    });
    insertMessages(messages);
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

  type ContentHandler = (content: string, name?: string) => {
    text?: string;
    mediaUrl?: string;
    mediaInfo?: {
      name: string;
      size: number;
      mimeType: string;
    };
  };

  const chatObject = useSelector((state: any) => state.chatObject) as ChatObject;
  const contentHandlers: Record<
    'text' | 'video' | 'image' | 'file' | 'location' | 'audio' | 'default',
    ContentHandler
  > = {
    text: (content: string) => ({ text: content }),
    default: (content: string, name: string = '') => ({
      mediaUrl: content,
      mediaInfo: {
        name,
        size: 0,
        mimeType: 'image/jpeg', // 默认 MIME 类型
      },
    }),
  };
  const createMessage = (
    contentRaw: string,
    contentType: 'video' | 'text' | 'image' | 'file' | 'location' | 'audio' | 'default',
    fileName = '',
    senderId = '-1'
  ): MessageInterface => {
    const handler = contentHandlers[contentType] || contentHandlers.default;
    const name = senderId === 'LLM' ? 'LLM' : 'user';
    const avatar = senderId === 'LLM' ? chatObject.avatar : require('@/assets/avatar.jpg');
    const msgStatus: MessageStatus = {
      delivered: false,
      downloaded: true,
      isRead: true,
      isRecalled: false,
    };
    let content: any = {};
    console.log(contentRaw);
    content['type'] = contentType;
    if (contentType==='text'){
      content['text'] = contentRaw;
    }else{
      content['mediaUrl'] = contentRaw;
      content['mediaInfo'] = {
        name: fileName,
      };
      content['downloaded'] = true;
      content['location'] = contentRaw;
    }
    return {
      messageId: uuidv4(),
      conversationId: chatObject.conversationId,
      sender: {
        id: senderId,
        name,
        avatar,
        status: {
          online: true,
          lastSeen: null,
        },
      },
      recipient: [chatObject.id],
      status: msgStatus,
      content,
      timestamp: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss') + 'Z',
    };
  };
  // 发送消息的逻辑
  const postMessage = async (message: MessageInterface) => {
    console.log('msg pending sending', message);
    try {
      if (message.recipient.length === 1 && message.recipient[0] === 'LLM') {
        console.log('message recipient is LLM', message.recipient);
        const responseText = await syncChat(message, undefined);
        console.log('responseText', responseText);
        const responseMsg = createMessage(responseText, 'text', '', 'LLM');
        dispatch(addMessage(responseMsg));
      }else{
        await _postMessage(message);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return { postMessage, handleReceivedMessage: handleReceivedMessages, handleSendMessage, createMessage };
};
