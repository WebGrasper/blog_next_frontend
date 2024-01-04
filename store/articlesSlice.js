import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//Actions
export const fetchArticles = createAsyncThunk("fetchArticles", async()=>{
    let response = await fetch("https://blog-zo8s.vercel.app/app/v2/getArticles",{
        method:'GET',
        headers:{
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
})

//Slice
const articlesSlice = createSlice({
    name:"articles",
    initialState:{
        isLoading: false,
        data:null,
        isError:false,
    },
    extraReducers: (builder) =>{
        builder.addCase(fetchArticles.pending, (state, action)=>{
            state.isLoading = true;
            state.data = null;
            state.isError = false;
        })
        .addCase(fetchArticles.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.data = action.payload;
            state.isError = false;
        })
        .addCase(fetchArticles.rejected, (state, action)=>{
            state.isLoading = false;
            console.log("Error", action.payload);
            state.isError = true;
        })
    }
})

export default articlesSlice.reducer;
