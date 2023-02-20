import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../client';

const initialState = {
    list: [],
    status: 'idle'
}

export const fetchPersons = createAsyncThunk('persons/fetchPersons', async () => {
    const response = await client.get('/person/');
    return response.data;
});

export const personsSlice = createSlice({
    name: 'persons',
    initialState,
    reducers: null,
    extraReducers(builder) {
        builder
            .addCase(fetchPersons.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchPersons.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
    }
});

export default personsSlice.reducer;
