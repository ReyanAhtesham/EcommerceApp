import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
import favoritesReducer from './features/favorites/favoriteSlice'
import cartSliceReducer from "../redux/features/cart/cartSlice";
import shopReducer from "../redux/features/shop/shopSlice";

const store = configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      auth: authReducer,
      favorites: favoritesReducer,
      cart: cartSliceReducer,
      shop: shopReducer,
    },
  
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
  });
  
  setupListeners(store.dispatch);
  export default store;