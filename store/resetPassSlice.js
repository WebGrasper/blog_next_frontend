import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const resetPassword = createAsyncThunk("resetPassword", async ({otp, password, confirmPassword}) => {
    // console.log("console",JSON.stringify({otp, password, confirmPassword }));
    console.log(otp,password, confirmPassword)
    let response = await fetch("https://blog-zo8s.vercel.app/app/v1/reset/password", {
        method: 'PUT',
        // mode: 'no-cors', //Disable the cors(Cross-Origin resource sharing)
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp, password, confirmPassword }),
    })
    return response.json();
})

const resetPasswordSlice = createSlice({
    name: "resetPassword",
    initialState: {
        isLoading: false,
        data: null,
        isError: false,
    },
    reducers: {
        resetRPState: state => {
            state.isLoading = false;
            state.data = null;
            state.isError = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(resetPassword.pending, (state, action) => {
            state.isLoading = true;
            state.data = null;
            state.isError = false;
        })
        builder.addCase(resetPassword.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.isError = false;
        })
        builder.addCase(resetPassword.rejected, (state, action) => {
            state.isLoading = false;
            state.data = action.error;
            state.isError = true;
        })
    }
})

export const { resetRPState } = resetPasswordSlice.actions; // Export the new action
export default resetPasswordSlice.reducer;