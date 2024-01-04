import { combineReducers, configureStore } from "@reduxjs/toolkit";
import articlesReducer from "./articlesSlice";
import { createWrapper } from "next-redux-wrapper";
import singleArticleReducer from "./singleArticleSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version:1,
  storage,
};

const rootReducer = combineReducers({
  articles: articlesReducer,
  singleArticle: singleArticleReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
  });

  // Create the persistor after the store is defined
  store.__persistor = persistStore(store);

  return store;
};

export const wrapper = createWrapper(makeStore);
