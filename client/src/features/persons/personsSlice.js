import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../client';

const initialState = {
    list: [],
    status: 'idle',
    currentUserId: undefined
}

export const fetchPersons = createAsyncThunk('persons/fetchPersons', async () => {
    const response = await client.get('/person/');
    return response.data;
});

export const fetchCurrentUser = createAsyncThunk('persons/fetchCurrentUser', async () => {
    const response = await client.get('/user/');
    return response.data;
});

export const selectPersonById = (state, id) => {
    return state.persons.list.find(person => person.id == id)
};

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
            .addCase(fetchCurrentUser.pending, (state, action) => {
                state.status = 'loading';  // TODO: these are all going to override eachother, need to refactor
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentUserId = action.payload.id;
            });
    }
});

export default personsSlice.reducer;
