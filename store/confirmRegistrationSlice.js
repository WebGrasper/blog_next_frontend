import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// https://blog-zo8s.vercel.app
export const confirmRegistration = createAsyncThunk("confirmRegistration", async (otp) => {
    let response = await fetch("https://blog-zo8s.vercel.app/app/v1/confirmRegistration", {
        method: 'POST',
        // mode: 'no-cors', //Disable the cors(Cross-Origin resource sharing)
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
    })
    return response.json();
})

const confirmRegistrationSlice = createSlice({
    name: "confirmRegistration",
    initialState: {
        isLoading: false,
        data: null,
        isError: false,
    },
    reducers: {
        resetConfirmRegisterState: state => {
            state.isLoading = false;
            state.data = null;
            state.isError = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(confirmRegistration.pending, (state, action) => {
            state.isLoading = true;
            state.data = null;
            state.isError = false;
        })
        builder.addCase(confirmRegistration.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.isError = false;
        })
        builder.addCase(confirmRegistration.rejected, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.isError = true;
        })
    }
})

export const { resetConfirmRegisterState } = confirmRegistrationSlice.actions; // Export the new action
export default confirmRegistrationSlice.reducer;