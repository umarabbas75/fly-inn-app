// app/features/filterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  destination: string;
  dates: {
    start: string | null;
    end: string | null;
  };
  lodgingType: string;
  guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  price: {
    min: null | number;
    max: null | number;
  };
  openDropdown: string | null;
}

const initialState: FilterState = {
  destination: "",
  dates: {
    start: null,
    end: null,
  },
  lodgingType: "",
  guests: {
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  },
  openDropdown: null,
  price: {
    min: null,
    max: null,
  },
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setDestination: (state, action: PayloadAction<string>) => {
      state.destination = action.payload;
    },
    setDates: (
      state,
      action: PayloadAction<{ start: string | null; end: string | null }>
    ) => {
      state.dates = action.payload;
    },
    setLodgingType: (state, action: PayloadAction<string>) => {
      state.lodgingType = action.payload;
    },
    updateGuestCount: (
      state,
      action: PayloadAction<{
        type: keyof FilterState["guests"];
        value: number;
      }>
    ) => {
      const { type, value } = action.payload;
      state.guests[type] = Math.max(0, value);
    },
    resetGuests: (state) => {
      state.guests = initialState.guests;
    },
    resetSearch: () => {
      return initialState;
    },
    setOpenDropdown: (state, action: PayloadAction<string | null>) => {
      state.openDropdown = action.payload;
    },
    setCloseDropdown: (state, action: PayloadAction<string | null>) => {
      state.openDropdown = action.payload;
    },
    setPriceRange: (
      state,
      action: PayloadAction<{ min: number | null; max: number | null }>
    ) => {
      state.price.min = action.payload.min;
      state.price.max = action.payload.max;
    },
    setMinPrice: (state, action: PayloadAction<number | null>) => {
      state.price.min = action.payload;
    },
    setMaxPrice: (state, action: PayloadAction<number | null>) => {
      state.price.max = action.payload;
    },
  },
});

export const {
  setDestination,
  setDates,
  setLodgingType,
  updateGuestCount,
  resetGuests,
  resetSearch,
  setOpenDropdown,
  setPriceRange,
  setMinPrice,
  setMaxPrice,
} = filterSlice.actions;

export default filterSlice.reducer;
