import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../client";

const initialState = {
    payerId: null,
    payeeId: null,
    amount: 0,
    status: 'idle',
}

export const fetchCalculation = createAsyncThunk('calculation/fetchCalculation', async () => {
    const response = await client.get('/calculation/');
    return response.data;
})

export const calculationSlice = createSlice({
    name: 'calculation',
    initialState,
    extraReducers(builder) {
        builder
        .addCase(fetchCalculation.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchCalculation.fulfilled, (state, action) => {
            return {
                status: 'succeeded',
                ...action.payload
            }
        });
    }
});

export default calculationSlice.reducer;
