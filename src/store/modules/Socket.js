import {createSlice} from '@reduxjs/toolkit';
const SocketSlice = createSlice({
  name: 'socket',
  initialState: {
    isConnected: false,
    error: null,
  },
  reducers: {
    connect: (state) => {
      state.isConnected = true;
    },
    disconnect: (state) => {
      state.isConnected = false;
    },
    errorOccurred: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { connect, disconnect, errorOccurred } = SocketSlice.actions;
export default SocketSlice.reducer;
