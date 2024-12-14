import { createSlice } from '@reduxjs/toolkit';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter((message) => message.id !== action.payload);
    },
    setMessage: (state, action) => {
      state.messages = action.payload;
    },
  },
});



export const {
  addMessage,
  removeMessage,
  setMessage,
} = messagesSlice.actions;

export default messagesSlice.reducer;
