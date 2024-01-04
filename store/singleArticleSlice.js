import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//Actions
export const fetchSingleArticle = createAsyncThunk(
  "fetchSingleArticle",
  async ({ title }) => {
      const response = await fetch(
        `https://blog-zo8s.vercel.app/app/v2/getSingleArticle/${title}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data;
    }
);

//Slice
const singleArticleSlice = createSlice({
  name: "singleArticle",
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleArticle.pending, (state, action) => {
        state.isLoading = true;
        state.data = null;
        state.isError = false;
      })
      .addCase(fetchSingleArticle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.isError = false;
      })
      .addCase(fetchSingleArticle.rejected, (state, action) => {
        state.isLoading = false;
        // console.error("Error", action.error.message);
        state.isError = true;
      });
  },
});

export default singleArticleSlice.reducer;
