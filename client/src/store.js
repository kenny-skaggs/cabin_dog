import { configureStore }  from '@reduxjs/toolkit';

import calculationReducer from './features/calculation/calculationSlice';
import expenseReducer from './features/expenses/expensesSlice';
import personsReducer from './features/persons/personsSlice';

export default configureStore({
    reducer: {
        calculation: calculationReducer,
        expenses: expenseReducer,
        persons: personsReducer
    }
});
