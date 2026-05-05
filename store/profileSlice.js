import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//Action
export const profile = createAsyncThunk("profile", async(token) =>{
    let response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v1/getMyDetails?` + new URLSearchParams({
        token: token
    }),{
        method: 'GET',
        // mode: 'no-cors', //Disable the cors(Cross-Origin resource sharing)
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
})

const profileSlice = createSlice({
    name: "profile",
    initialState:{
        isLoading: false,
        data: null,
        isError: false,
    },
    reducers: {
        resetProfileState: state => {
            state.isLoading = false;
            state.data = null;
            state.isError = false;
        }
    },
    extraReducers: (builder) =>{
        builder.addCase(profile.pending, (state, action)=>{
            state.isLoading = true;
            state.data = null;
            state.isError = false;
        })
        builder.addCase(profile.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.data = action.payload;
            state.isError = false;
        })
        builder.addCase(profile.rejected, (state, action)=>{
            state.isLoading = false;
            state.data = action.error;
            state.isError = true;
        })
    }
})

export const { resetProfileState } = profileSlice.actions; // Export the new action
export default profileSlice.reducer;