import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  savedAdvertIds: [],
}

export const savedAdvertsSlice = createSlice({
  name: 'savedAdverts',
  initialState,
  reducers: {
    addSavedAdvert: (state, action) => {
      state.savedAdvertIds.push(action.payload);
    },
    removeSavedAdvert: (state, action) => {
      state.savedAdvertIds = state.savedAdvertIds.filter(id => id !== action.payload);
    },
  },
})

export const { addSavedAdvert, removeSavedAdvert } = savedAdvertsSlice.actions;

export const selectSavedAdvertIds = (state) => state.savedAdverts.savedAdvertIds;

export default savedAdvertsSlice.reducer;
