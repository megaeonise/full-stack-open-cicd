import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const notificationSlice = createSlice({
  name: "notification",
  initialState, //intialstate
  reducers: {
    setMessage(_state, action) {
      return action.payload;
    },
    // eslint-disable-next-line no-unused-vars
    removeNotification(_state, _action) {
      return initialState;
    },
  },
});

export const { removeNotification, setMessage } = notificationSlice.actions;

export const setNotification = (message, time) => {
  return async (dispatch) => {
    dispatch(setMessage(message));
    setTimeout(() => {
      dispatch(removeNotification());
    }, time);
  };
};

export default notificationSlice.reducer;
