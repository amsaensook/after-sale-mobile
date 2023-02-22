import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage'

const initialState = {
  authResult: {}
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.authResult = action.payload
      AsyncStorage.setItem('auth', JSON.stringify(action.payload))
      AsyncStorage.setItem('accessStatus', JSON.stringify(action.payload?.status || false))
      AsyncStorage.setItem('accessToken', JSON.stringify(action.payload?.data?.token || ''))
    }
  }
});

//get state (useSelector)
export const selectAuth = (state: any) => state.auth;

//set actions (useDispatch)
export const { setAuth } = authSlice.actions;

//set reducer (use store)
export default authSlice.reducer;