import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// https://blog-zo8s.vercel.app
export const addComment = createAsyncThunk("addComment", async ({articleID, token, commentBody}) => {
    let response = await fetch(`https://blog-zo8s.vercel.app/app/v2/addComment?` + new URLSearchParams({
        articleID: articleID,
        token: token
    }),{
        method: 'POST',
        // mode: 'no-cors', //Disable the cors(Cross-Origin resource sharing)
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentBody }),
    });
    return response.json();
})

const addCommentSlice = createSlice({
    name: "addComment",
    initialState: {
        isLoading: false,
        data: null,
        isError: false,
    },
    reducers: {
        resetACState: state => {
            state.isLoading = false;
            state.data = null;
            state.isError = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addComment.pending, (state, action) => {
            state.isLoading = true;
            state.data = null;
            state.isError = false;
        })
        builder.addCase(addComment.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.isError = false;
        })
        builder.addCase(addComment.rejected, (state, action) => {
            state.isLoading = false;
            state.data = action.error;
            state.isError = true;
        })
    }
})

export const { resetACState } = addCommentSlice.actions; // Export the new action
export default addCommentSlice.reducer;