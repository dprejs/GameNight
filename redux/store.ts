import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import deviceReducer from './deviceSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    device: deviceReducer,
  }
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch


///////////////////////////////////////////////////////////////////////////////
// import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
// import type { RootState, AppDispatch } from './store'

// // Use throughout your app instead of plain `useDispatch` and `useSelector`
// export const useAppDispatch = () => useDispatch<AppDispatch>()
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
//////////////////////////////////////////////////////////////////////////////