import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: 'user',
  initialState: {
    value: undefined
  },
  reducers: {
    login: (state, action) => {
      state.value = action.payload
    },
    logoff: state => {
      state.value = undefined
    }
  }
})

export const { login, logoff } = authSlice.actions

export default authSlice.reducer