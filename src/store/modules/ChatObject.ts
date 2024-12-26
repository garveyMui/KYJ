import {createSlice} from '@reduxjs/toolkit';

const ChatObjectSlice = createSlice({
  name: 'ChatObject',
  initialState: {
    id: 'initial_id',
    name: 'user_name',
    avatar: 'avatar',
    conversationId: null,
  },
  reducers: {
    setChatObject: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.avatar = action.payload.avatar;
      state.conversationId = action.payload.id;
    },
  },
});

interface ChatObject {
    id: string;
    name: string;
    avatar: string;
}

export const {setChatObject} = ChatObjectSlice.actions;
export type {ChatObject};
export default ChatObjectSlice.reducer;
