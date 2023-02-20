import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../client";

const initialState = {
    list: [],
    status: 'idle',
    error: null
}

export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async () => {
    const response = await client.get('/expenses/');
    return response.data;
})

export const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        add: (state, action) => {
            state.list.push(action.payload);
        },
        remove: (state, action) => {
            state.list = state.list.filter(expense => expense.id != action.payload);
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchExpenses.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            });
    }
});

export const { add, remove } = expenseSlice.actions;

export default expenseSlice.reducer;
