import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const logout = createAsyncThunk("logout", async(token)=>{
    let response = await fetch("https://blog-zo8s.vercel.app/app/v1/logout",{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        credentials:'include'
    });
    return response.json();
})

const logoutSlice = createSlice({
    name: "logout",
    initialState:{
        isLoading: false,
        data: null,
        isError: false,
    },
    reducers: {
        resetLogoutState: state => {
            state.isLoading = false;
            state.data = null;
            state.isError = false;
        }
    },
    extraReducers: (builder) =>{
        builder.addCase(logout.pending, (state, action)=>{
            state.isLoading = true;
            state.data = null;
            state.isError = false;
        })
        builder.addCase(logout.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.data = action.payload;
            state.isError = false;
        })
        builder.addCase(logout.rejected, (state, action)=>{
            state.isLoading = false;
            console.log(action.error);
            state.isError = true;
        })
    }
})

export const { resetLogoutState } = logoutSlice.actions; // Export the new action

export default logoutSlice.reducer;