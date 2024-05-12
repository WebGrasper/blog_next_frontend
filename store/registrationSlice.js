import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const register = createAsyncThunk("register", async ({ username, email, password }) => {
    let response = await fetch("https://blog-zo8s.vercel.app/app/v1/signup", {
        method: 'POST',
        // mode: 'no-cors', //Disable the cors(Cross-Origin resource sharing)
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    })
    return response.json();
})

const registerSlice = createSlice({
    name: "register",
    initialState: {
        isLoading: false,
        data: null,
        isError: false,
    },
    reducers: {
        resetRegisterState: state => {
            state.isLoading = false;
            state.data = null;
            state.isError = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(register.pending, (state, action) => {
            state.isLoading = true;
            state.data = null;
            state.isError = false;
        })
        builder.addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.isError = false;
        })
        builder.addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.data = action.error;
            state.isError = true;
        })
    }
})

export const { resetRegisterState } = registerSlice.actions; // Export the new action
export default registerSlice.reducer;