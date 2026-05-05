import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// https://blog-zo8s.vercel.app
export const login = createAsyncThunk("login", async ({ email, password }) => {
    let response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v1/signin`, {
        method: 'POST',
        // mode: 'no-cors', //Disable the cors(Cross-Origin resource sharing)
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
        // If response is not ok (status code other than 2xx), throw an error
        let error_data = await response.json();
        throw new Error(error_data.message);
    }
    
    return response.json();
})

const loginSlice = createSlice({
    name: "login",
    initialState: {
        isLoading: false,
        data: null,
        isError: false,
    },
    reducers: {
        resetLoginState: state => {
            state.isLoading = false;
            state.data = null;
            state.isError = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state, action) => {
            state.isLoading = true;
            state.data = null;
            state.isError = false;
        })
        builder.addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.isError = false;
        })
        builder.addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.data = action.error;
            state.isError = true;
        })
    }
})

export const { resetLoginState } = loginSlice.actions; // Export the new action

export default loginSlice.reducer;