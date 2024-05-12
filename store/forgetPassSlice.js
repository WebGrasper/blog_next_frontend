import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const forgetPassword = createAsyncThunk("forgetPassword", async (email) => {
    let response = await fetch("https://blog-zo8s.vercel.app/app/v1/forgetPassword", {
        method: 'POST',
        // mode: 'no-cors', //Disable the cors(Cross-Origin resource sharing)
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    })
    return response.json();
})

const forgetPasswordSlice = createSlice({
    name: "forgetPassword",
    initialState: {
        isLoading: false,
        data: null,
        isError: false,
    },
    reducers: {
        resetFPState: state => {
            state.isLoading = false;
            state.data = null;
            state.isError = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(forgetPassword.pending, (state, action) => {
            state.isLoading = true;
            state.data = null;
            state.isError = false;
        })
        builder.addCase(forgetPassword.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.isError = false;
        })
        builder.addCase(forgetPassword.rejected, (state, action) => {
            state.isLoading = false;
            state.data = action.error;
            state.isError = true;
        })
    }
})

export const { resetFPState } = forgetPasswordSlice.actions; // Export the new action
export default forgetPasswordSlice.reducer;