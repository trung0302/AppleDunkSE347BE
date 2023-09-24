import mongoose from 'mongoose'
import validator from 'validator'
const danhgiaSchema=new mongoose.Schema({
    makh: {
        type: String,
        required: true,
        trim: true,
    },
    masp: {
        type: String,
        required: true,
        trim: true,
    },
    tenkh: {
        type: String,
        required: true,
        trim: true,
    },
    binhluan: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        required: true,
        trim: true,
    }

        
},{timestamps: true})
const DanhGia=mongoose.model('DanhGia',danhgiaSchema)
export default DanhGia 