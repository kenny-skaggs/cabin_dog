import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../client";

const initialState = {
    list: [],
    status: 'idle',
    error: null,
    showModal: false,
    editItemId: null
}

export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async () => {
    const response = await client.get('/expenses/');
    return response.data;
});

export const addExpense = createAsyncThunk('expenses/addExpense', async (expense) => {
    const response = await client.post('/expenses/', expense);
    return response.data;
});

export const updateExpense = createAsyncThunk('expenses/updateExpense', async (expense) => {
    const response = await client.put(`/expenses/${expense.id}/`, expense);
    return response.data;
});

export const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        createNew: (state) => {
            state.showModal = true;
        },
        closeModal: (state) => {
            state.showModal = false;
            state.editItemId = null;
        },
        edit: (state, action) => {
            state.showModal = true;
            state.editItemId = action.payload;
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
            })
            .addCase(addExpense.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addExpense.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list.push(action.payload);
                state.showModal = false;
            })
            .addCase(updateExpense.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list.push(action.payload);
                state.list = [
                    ...state.list.filter(expense => expense.id !== action.payload.id),
                    action.payload
                ]
                state.editItemId = null;
                state.showModal = false;
            });
    }
});

export const { createNew, edit, closeModal } = expenseSlice.actions;

export default expenseSlice.reducer;
