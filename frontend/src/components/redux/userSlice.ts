import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: localStorage.getItem('token') || null,
  user: localStorage.getItem('email') || null,
};



const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login:(state, action)=> {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token); 
      localStorage.setItem('email', action.payload.user.email) 
    },
    logout:(state)=> {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('email')
    },
  },
});

export const { login, logout } = userSlice.actions;
export const selectIsAuthenticated = (state)=> state.user.isAuthenticated;
export default userSlice.reducer;

