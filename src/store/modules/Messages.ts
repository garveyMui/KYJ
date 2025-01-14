import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '@/store/modules/User';
import {GroupInfo} from '@/store/modules/Conversations.ts';
// import {_postMessage} from '@/components/functional/MessageManager';

export interface MessageInterface {
  messageId: string;    // 唯一的消息ID
  conversationId: string; // 会话ID，单聊或群聊的唯一标识
  sender: User;         // 发送者的信息
  terminalIds?: number[];
  recipient?: User[] | User;  // 收件人（单聊或群聊） 发送时有效
  content: MessageContent; // 消息内容（文本、图片、文件等）
  timestamp: string;    // 发送时间（ISO 格式时间）
  status?: MessageStatus;  // 消息状态（送达、已读等）
  isRead?: boolean;      // 标记消息是否已读
  isRecalled?: boolean;  // 是否已撤回
  recalledBy?: string;
  recallTime?: string;  // 撤回时间
  metadata?: MessageMetadata;  // 消息附加信息
  pushNotification?: boolean;  // 是否推送通知
  mentions?: string[];
  groupInfo?: GroupInfo;
}

interface MessageContent {
  type: 'text' | 'image' | 'video' | 'file' | 'location' | 'audio' | 'default';  // 消息类型
  text: string;       // 文本消息
  mediaUrl?: string;   // 媒体消息URL
  mediaInfo?: MediaInfo; // 文件信息
  downloaded?: boolean;
  location?: LocationInfo;  // 位置信息
}

interface MediaInfo {
  name: string;   // 文件名
  size: number;   // 文件大小
  mimeType: string;  // mime类型
  localPath: string;
}

interface LocationInfo {
  latitude: number;  // 纬度
  longitude: number;  // 经度
  address: string;  // 地址描述
}

interface MessageStatus {
  delivered: boolean;  // 是否已送达
  downloaded?: boolean;
  isRead: boolean;  // 是否已读
  isRecalled: boolean;
  recalledBy?: string;
  recallTime?: string;  // 撤回时间
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
  messagesList: MessageInterface[];
}

const initialState: MessagesState = {
  messagesList: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<MessageInterface | MessageInterface[]>) => {
      if (action.payload instanceof Array) {
        state.messagesList = [...state.messagesList, ...action.payload];
      }else{
        state.messagesList.push(action.payload);
      }
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      state.messagesList = state.messagesList.filter(
        message => message.messageId !== action.payload,
      );
    },
    setMessage: (state, action: PayloadAction<MessageInterface[]>) => {
      state.messagesList = action.payload;
    },
    updateMessage: (state, action: PayloadAction<MessageInterface> ) => {
      state.messagesList = state.messagesList.map(message => {
        if (message.messageId === action.payload.messageId) {
          return action.payload;
        }else{
          return message;
        }
      });
    },
  },
});

// const postMessage = (message: MessageInterface, callbacks: (()=> void)[]) => {
//   return async (dispatch: any) => {
//     dispatch(addMessage(message));
//     callbacks.forEach(callback => callback());
//     await _postMessage(message);
//   };
// };


export const {addMessage, removeMessage, setMessage, updateMessage} = messagesSlice.actions;

// export {postMessage};

export default messagesSlice.reducer;
