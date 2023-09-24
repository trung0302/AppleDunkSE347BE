import mongoose from 'mongoose'
import validator from 'validator'
const khuyenmaisSchema=new mongoose.Schema({
    makm: {
        type: String,
        default:"KM0",
    },
    // ten: {
    //     type: String,
    //     trim: true,
    // },
    // mota: {
    //     type: String,
    //     trim: true,
    // },
    // hinhanh: {
    //     type: String,
    //     trim: true,
    //     default: "",
    // },
    // loaisp: {
    //     type: String,
    //     required: true,
    //     default: "All",
    //     trim: true,
    // },
    apdung: {
        type: Number,
        default: 100000,
        required: true,
    },
    phantramkm: {
        type: Number,
        default: 0,
        required: true,
    },
    //số lượng -1 thì tức là áp dụng mãi mãi
    // SL: {
    //     type: Number,
    //     default: -1,
    //     required: true,
    // },
    batdau: {
        type: Date,
        required: true,
        default: Date.now,
        trim: true,
    },
    ketthuc: {
        type: Date,
        required: true,
        default: Date.now,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    dateSource: {
        type: String,
        trim: true,
    },
    detail: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        default: "other"
    }
},{timestamps: true})
const khuyenmais=mongoose.model('khuyenmais',khuyenmaisSchema)
export default khuyenmais 