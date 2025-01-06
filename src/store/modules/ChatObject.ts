import {createSlice} from '@reduxjs/toolkit';
import {User} from './User';

interface ChatObject {
  user: User;
  nickname: string;
  conversationId: string;
}
const ChatObjectSlice = createSlice({
  name: 'ChatObject',
  initialState: {
    user: {
      id: '-1',
      name: 'user_name',
      avatar: 'avatar',
      status: {
        lastSeen: '',
        statusMessage: 'offline',
        online: false,
      },
    },
    nickname: 'nickname',
    conversationId: '',
  } as ChatObject,
  reducers: {
    setChatObject: (state, action) => {
      state.user = action.payload.user;
      state.nickname = action.payload.nickname;
      state.conversationId = action.payload.conversationId;
    },
  },
});

export const {setChatObject} = ChatObjectSlice.actions;
export type {ChatObject};
export default ChatObjectSlice.reducer;
