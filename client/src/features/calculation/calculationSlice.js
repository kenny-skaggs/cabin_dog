import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../client";

const initialState = {
    payer: {
        id: null,
        paid: 0
    },
    payee: {
        id: null,
        paid: 0
    },
    balancingPayment: 0,
    status: 'idle',
    showModal: false
}

export const fetchCalculation = createAsyncThunk('calculation/fetchCalculation', async () => {
    const response = await client.get('/calculation/');
    return response.data;
});

export const postPayment = createAsyncThunk('calculation/postPayment', async (amount) => {
    const response = await client.post('/payment/', {amount: amount});
    return response.data;
});

export const calculationSlice = createSlice({
    name: 'calculation',
    initialState,
    reducers: {
        showCalculationModal(state) {
            state.showModal = true;
        },
        closeCalculationModal(state) {
            state.showModal = false;
        }
    },
    extraReducers(builder) {
        builder
        .addCase(fetchCalculation.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchCalculation.fulfilled, (state, action) => {
            return {
                status: 'succeeded',
                balancingPayment: action.payload.balancingPayment,
                payer: action.payload.payer,
                payee: action.payload.payee
            }
        })
        .addCase(postPayment.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(postPayment.fulfilled, (state) => {
            state.status = 'succeeded'
            state.showModal = false
        });
    }
});

export const { showCalculationModal, closeCalculationModal } = calculationSlice.actions;

export default calculationSlice.reducer;
