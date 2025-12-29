import { createSlice } from '@reduxjs/toolkit';

const PointSlice = createSlice({
    name: 'points',
    initialState: 0,
    reducers: {
        setJwt: (state, action) => {
            localStorage.setItem("token", action.payload);
            state = action.payload;
            return state;
        },
        removeJwt: (state) => {
            localStorage.removeItem("token");
            state = 0;
            return state;
        }
    },
})

export const { setJwt, removeJwt } = PointSlice.actions;
export default PointSlice.reducer;