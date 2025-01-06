import {createSlice} from '@reduxjs/toolkit';
import {postMessageAPI} from '@/apis/messages';
import {postAttachAPI} from '@/apis/attachments';
import {User} from '@/store/modules/User';

export interface Message {
  messageId: string;    // 唯一的消息ID
  conversationId: string; // 会话ID，单聊或群聊的唯一标识
  sender: User;         // 发送者的信息
  recipient: User[] | User;  // 收件人（单聊或群聊）
  content: MessageContent; // 消息内容（文本、图片、文件等）
  timestamp: string;    // 发送时间（ISO 格式时间）
  status: MessageStatus;  // 消息状态（送达、已读等）
  isRead: boolean;      // 标记消息是否已读
  isRecalled?: boolean;  // 是否已撤回
  recalledBy?: string;
  recallTime?: string;  // 撤回时间
  metadata: MessageMetadata;  // 消息附加信息
  editedAt?: string;  // 编辑时间（如果编辑过）
  pushNotification?: boolean;  // 是否推送通知
  mentions?: string[];
}

interface MessageContent {
  type: 'text' | 'image' | 'video' | 'file' | 'location' | 'audio';  // 消息类型
  text?: string;       // 文本消息
  mediaUrl?: string;   // 媒体消息URL
  mediaInfo?: MediaInfo; // 文件信息
  location?: LocationInfo;  // 位置信息
}
interface MediaInfo {
  name: string;   // 文件名
  size: number;   // 文件大小
  mimeType: string;  // mime类型
}

interface LocationInfo {
  latitude: number;  // 纬度
  longitude: number;  // 经度
  address: string;  // 地址描述
}

interface MessageStatus {
  delivered: boolean;  // 是否已送达
  read: boolean;  // 是否已读
}

interface MessageMetadata {
  threadId: string;  // 线程ID（如果有多级消息）
  replyToMessageId?: string;  // 回复的消息ID
  forwarded?: boolean;  // 是否转发消息
  edited?: boolean;  // 是否编辑过
  replyCount?: number;  // 回复数量
}

// 定义状态的类型
interface MessagesState {
  messagesList: Message[];
}

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messagesList: [],
  } as MessagesState,
  reducers: {
    addMessage: (state, action) => {
      state.messagesList.push(action.payload);
    },
    removeMessage: (state, action) => {
      state.messagesList = state.messagesList.filter(
        message => message.messageId !== action.payload,
      );
    },
    setMessage: (state, action) => {
      state.messagesList = action.payload;
    },
  },
});

const postMessage = (message: Message, callbacks: (()=> void)[]) => {
  return async (dispatch: any) => {
    dispatch(addMessage(message));
    callbacks.forEach(callback => callback());
    await _postMessage(message);
  };
};

const _postMessage = async (message: Message) => {
  try {
    const formData = new FormData();
    formData.append('message', message);
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
    return result.url;
  } catch (error) {
    throw error; // 抛出错误，以便可以在外部捕获
  }
};

export const {addMessage, removeMessage, setMessage} = messagesSlice.actions;

export {postMessage};

export default messagesSlice.reducer;
