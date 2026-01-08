import { combineReducers } from '@reduxjs/toolkit';
import { filterSlice } from './filter-slice';

// Combine all the individual slice reducers here
const rootReducer = combineReducers({
  filters: filterSlice.reducer,
});

export default rootReducer;