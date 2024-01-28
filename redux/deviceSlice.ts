import { createSlice } from "@reduxjs/toolkit";

export const deviceSlice = createSlice({
  name: 'device',
  initialState: {
    value: {
      isMobile: false,
      isTablet: false,
    }
  },
  reducers: {
    setMobile: state => {
      state.value = {
        isMobile: true,
        isTablet: false,
      }
    },
    setTablet: state => {
      state.value = {
        isMobile: false,
        isTablet: true,
      }
    },
    setDesktop: state => {
      state.value = {
        isMobile: false,
        isTablet: false,
      }
    }
  }
})

export const { setMobile, setTablet, setDesktop } = deviceSlice.actions

export default deviceSlice.reducer