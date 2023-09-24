import mongoose from 'mongoose'
import validator from 'validator'
const baohanhsSchema=new mongoose.Schema({
    mabh: {
        type: String,
        default: "BH0",
    },
    makh: {
        type: String,
        required: true,
    },
    masp: {
        type:String,
        required: true,
    },
    mahd: {
        type:String,
        required: true,
    },
    manv: {
        type:String,
        required: true,
    },
    thoigian: {
        type:String,
        required: true,
    },
    nghethan: {
        type:String,
        required: true,
    },
    chitietbaohanh: [{
        ngbaohanh: {
            type: String,
            require: true,
        },
        lanthu: {
            type: Number,
            require: true,
        },
        mota: {
            type:String,
            require: true,
        },
        tinhtrangbaohanh: {
            type: String,
            require: true,
        },
    }],


},{timestamps: true})
const baohanhs=mongoose.model('baohanhs',baohanhsSchema)
export default baohanhs