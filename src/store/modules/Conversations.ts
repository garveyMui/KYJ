import {createSlice} from '@reduxjs/toolkit';
import {User} from '@/store/modules/User';
import {Message} from '@/store/modules/Messages';

export interface Conversation {
  conversationId: string;    // 会话ID
  participants: User[];      // 会话的参与者（单聊是2人，群聊是多人）
  messages: Message[];       // 该会话的所有消息
  unreadCounts: { [uid: string]: number };
  unreadCountTotal: number;       // 未读消息数量（群聊中所有成员的总和）
  lastMessage: Message;      // 最近一条消息
  isGroup: boolean;          // 是否是群聊
  pushNotificationEnabled?: boolean;  // 是否启用推送通知
  isMuted: boolean;
  groupInfo?: GroupInfo;
}

interface GroupInfo {
  groupName: string;                // 群聊名称
  groupAvatar?: string;             // 群聊头像（可选）
  members: User[];                  // 群聊成员
  adminIds: string[];               // 群聊管理员的用户ID
}

const Conversation = createSlice({
  name: 'conversation',
  initialState: {
    conversationId: null,
    conversations: [],
  },
  reducers: {
    setConversationId: (state, action) => {
      state.conversationId = action.payload;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action) => {
      state.conversations.push(action.payload);
    },
    removeConversation: (state, action) => {
      state.conversations.splice(state.conversations.indexOf(action.payload), 1);
    },
  },
});

export const { setConversationId, setConversations, removeConversation, addConversation } = Conversation.actions;

export default Conversation.reducer;
