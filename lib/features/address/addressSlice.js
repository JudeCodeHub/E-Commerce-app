import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchAddress = createAsyncThunk(
    "address/fetchAddress",
    async ({ getToken }, thunkAPI) => {
        try {
            const token = await getToken();
            const { data } = await axios.get("/api/address", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data ? data.addresses: [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        list: [],
    },
    reducers: {
        addAddress: (state, action) => {
            state.list.push(action.payload)
        },
        updateAddress: (state, action) => {
            state.list = state.list.map((address) =>
                address.id === action.payload.id ? action.payload : address
            )
        },
        removeAddress: (state, action) => {
            state.list = state.list.filter((address) => address.id !== action.payload)
        },
        setDefaultAddress: (state, action) => {
            state.list = state.list.map((address) => ({
                ...address,
                isDefault: address.id === action.payload,
            }))
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAddress.fulfilled, (state, action) => {
            state.list = action.payload
        })
    }
})

export const { addAddress, updateAddress, removeAddress, setDefaultAddress } =
    addressSlice.actions

export default addressSlice.reducer