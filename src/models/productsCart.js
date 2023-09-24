import mongoose from "mongoose";
import validator from "validator";

const cartSchema = new mongoose.Schema(
    {
        masp: {
            type: String,
            required: true,
        },
        makh: {
            type: String,
            required: true,
        },
        tensp: {
            type: String,
            required: false,
        },
        hinh: {
            type: String,
            required: false,
        },
        dungluong: {
            type: String,
            required: false,
        },
        mausac: {
            type: String,
            required: false,
        },
        soluong: {
            type: Number,
            required: false,
        },
        gia: {
            type: Number,
            required: false,
        },
    },
    { timestamps: true }
);
const productsCart = mongoose.model("productsCart", cartSchema);
export default productsCart;
