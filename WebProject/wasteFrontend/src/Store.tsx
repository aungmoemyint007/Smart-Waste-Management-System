import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/UserSlice";
import jwtReducer from './Slices/JwtSlice';

export default configureStore({
    reducer: {
        user: userReducer,
        jwt: jwtReducer
    }
})