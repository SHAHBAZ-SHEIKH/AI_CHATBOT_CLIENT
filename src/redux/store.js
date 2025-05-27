import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/user.jsx";
import chatReducer from "./slices/chat.jsx";
const store = configureStore(
  {
    reducer: {
      user: userReducer,
      chat: chatReducer,
    },
  },
  +window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;