// src/redux/rootReducer.ts

import { combineReducers } from "@reduxjs/toolkit";
import { fireStoreApi } from "./services/apiSlice";
import featuresReducer from "./features/appSlice";

export const rootReducer = combineReducers({
  [fireStoreApi.reducerPath]: fireStoreApi.reducer,
  features: featuresReducer,
});