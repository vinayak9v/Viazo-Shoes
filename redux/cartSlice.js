'use client';

import { createSlice } from '@reduxjs/toolkit';

// Browser check karne ke liye helper function (Next.js SSR ke liye zaroori hai)
const getInitialCart = () => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('viazo_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }
  return [];
};

const initialState = {
  items: getInitialCart(), // Refresh hone par yahan se data reload hoga
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.items.push(action.payload);
      }
      // LocalStorage mein save karein
      localStorage.setItem('viazo_cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      // LocalStorage mein save karein
      localStorage.setItem('viazo_cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item && quantity >= 1) {
        item.quantity = quantity;
      }
      // LocalStorage mein save karein
      localStorage.setItem('viazo_cart', JSON.stringify(state.items));
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;