import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchWishlist = createAsyncThunk(
    "wishlist/fetchWishlist",
    async ({ getToken }, thunkAPI) => {
        try {
            const token = await getToken();
            const { data } = await axios.get("/api/wishlist", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data ? data.wishlist : [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        list: [],
    },
    reducers: {
        addToWishlist: (state, action) => {
            const exists = state.list.some(
                (item) => item.productId === action.payload.productId
            )
            if (!exists) {
                state.list.unshift(action.payload)
            }
        },
        removeFromWishlist: (state, action) => {
            state.list = state.list.filter(
                (item) => item.productId !== action.payload
            )
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchWishlist.fulfilled, (state, action) => {
            state.list = action.payload
        })
    }
})

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions

export default wishlistSlice.reducer
