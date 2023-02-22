import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../client";

const initialState = {
    payerId: null,
    payeeId: null,
    amount: 0
}

export const calculationSlice = createSlice({
    name: 'calculation',
    initialState
});

export default calculationSlice.reducer;
