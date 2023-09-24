import mongoose from "mongoose";
import validator from "validator";

const newsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        provinceCode: {
            type: Number,
            required: true,
        },
        districtCode: {
            type: Number,
            required: true,
        }
    },
    { timestamps: true }
);
const stores = mongoose.model("stores", newsSchema);
export default stores;
