import { configureStore }  from '@reduxjs/toolkit';

import expenseReducer from './features/expenses/expensesSlice';
import personsReducer from './features/persons/personsSlice';

export default configureStore({
    reducer: {
        expenses: expenseReducer,
        persons: personsReducer
    }
});
