import {createSlice} from '@reduxjs/toolkit';

const BottomTabSlice = createSlice({
  name: 'BottomTab',
  initialState: {
    routeName: 'Docs',
  },
  reducers: {
    setBottomTab: (state, action) => {
      state.routeName = action.payload;
    },
  },
});

export const { setBottomTab } = BottomTabSlice.actions;
export default BottomTabSlice.reducer;