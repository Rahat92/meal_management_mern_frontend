import { createSlice } from "@reduxjs/toolkit"

const initialValue = {
    totalMealBodyRef: null
}

const refSlice = createSlice({
    name: 'ref',
    initialState: initialValue,
    reducers: {
        setTotalMealBodyRef: (state, action) => {
            state.totalMealBodyRef = action.payload
        }
    }
})

export const { setTotalMealBodyRef } = refSlice.actions
export default refSlice.reducer