import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '@/store/modules/User';
import {MessageInterface} from '@/store/modules/Messages';
import {ChatObject} from '@/store/modules/ChatObject.ts';

export interface ConversationInterface {
  lastUpdateTime: string;
  conversationId: string; // 会话ID
  unreadCountTotal: number; // 未读消息数量（群聊中所有成员的总和）
  isGroup: boolean; // 是否是群聊
  isMuted: boolean;
  chatObject: ChatObject;
  lastMessageAbstract: string;
  groupInfo?: GroupInfo | null | undefined;
  messages: MessageInterface[]; // 该会话的所有消息
  currentPage: number;
  totalPages: number;
  unreadCounts?: {[uid: string]: number};
}

export interface GroupInfo {
  // groupName: string;                // 群聊名称
  // groupAvatar?: string;             // 群聊头像（可选）
  members: User[];                  // 群聊成员
  adminIds: string[];               // 群聊管理员的用户ID
  maxMembers?: number;
}

// 初始状态接口定义
interface ConversationsState {
  activeConversationId: string | null; // 当前会话ID
  // conversations: ConversationInterface[]; // 所有会话
  conversations: Conversations;
  // conversations: Map<string, ConversationInterface>;  // 使用 Map 存储所有会话
}

export interface Conversations {
  [conversationId: string]: ConversationInterface;  // 使用 conversationId 作为键，存储对应的 Conversation
}
// type Conversations = Map<string, ConversationInterface>;

// 初始状态
const initialState: ConversationsState = {
  activeConversationId: null,
  conversations: {},
  // conversations: new Map(),
};

const Conversations = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setConversationId: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
    setConversations: (state, action: PayloadAction<Conversations>) => {
      state.conversations = {...state.conversations, ...action.payload};
    },
    addConversation: (state, action: PayloadAction<ConversationInterface>) => {
      state.conversations[action.payload.conversationId] = action.payload;
      // state.conversations.set(action.payload.conversationId, action.payload);
    },
    removeConversation: (state, action: PayloadAction<string>) => {
      delete state.conversations[action.payload];
      // state.conversations.delete(action.payload);
    },
    updateConversation: (state, action: PayloadAction<ConversationInterface>) => {
      state.conversations[action.payload.conversationId] = action.payload;
    },
    addMessageToConversation : (state: any, action: PayloadAction<MessageInterface>) => {
      console.log('addMessageToConversation', action.payload);
      const message = action.payload;
      const conversation = state.conversations[message.conversationId];
      conversation.messages.push(message);  // 添加消息到会话
      conversation.lastMessage = message;   // 更新最后一条消息
      conversation.unreadCountTotal += message.isRead ? 0 : 1;   // 更新总未读消息数
      if (message.sender.id !== -1){
        conversation.unreadCounts[message.sender.id] = (conversation.unreadCounts[message.sender.id] || 0) + 1;  // 更新发送者的未读消息数
      }
    },
    removeMessageFromConversation : (state: any, action: PayloadAction<{ conversationId: string, messageId: string }>) => {
      const { conversationId, messageId } = action.payload;
      const conversation = state.conversations[conversationId];

      if (conversation) {
        // 删除指定的消息
        conversation.messages = conversation.messages.filter((message: MessageInterface) => message.messageId !== messageId);

        // 如果删除的是最后一条消息，需要更新 `lastMessage`
        if (conversation.messages.length > 0) {
          conversation.lastMessage = conversation.messages[conversation.messages.length - 1];
        } else {
          // 如果该会话没有消息，清空最后一条消息
          conversation.lastMessage = null;
        }

        // 更新未读消息数（这里的更新逻辑要根据需求来调整）
        conversation.unreadCountTotal = conversation.messages.filter((message: MessageInterface)=> !message.isRead).length;
      }
    },
  },
});

// 导出 actions 和 reducer
export const {
  setConversationId,
  setConversations,
  addConversation,
  removeConversation,
  addMessageToConversation,
  removeMessageFromConversation,
  updateConversation,
} = Conversations.actions;

export default Conversations.reducer;
