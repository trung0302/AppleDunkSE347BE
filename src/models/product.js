import mongoose from 'mongoose'
const productSchema = new mongoose.Schema(
    {
        tensanpham: {
            type: String,
            required: false,
        },
        imageList: [{
            type: String,
            soluong: Number
        }], required: false,
        loaisanpham: {
            type: String,
            required: false,
        },
        phanloai: {
            type: String,
            required: false,
        },

        masp: {
            type: String,
            required: false,
        },

        hinh: {
            type: String,
            required: false,
        },
        gia: {
            type: String,
            required: false,
        },
        soluong: {
            type: String,
            required: false,
            
        },
        rom: {
            type: String,
            required: false,
        },
        mausac: {
            type: String,
            required: false,
        },
        ram: {
            type: String,
            required: false,
        },
        chip: {
            type: String,
            required: false,
        },
        baomat: {
            type: String,
            required: false,
        },
        chongnuoc: {
            type: String,
            required: false,
        },
        sac: {
            type: String,
            required: false,
        },
        dophangiai: {
            type: String,
            required: false,
        },
        kichthuoc: {
            type: String,
            required: false,
        },
        camera: {
            type: String,
            required: false,
        },
        khoiluong: {
            type: String,
            required: false,
        },
        hedieuhanh: {
            type: String,
            required: false,
        },
        nguongoc: {
            type: String,
            required: false,
        },
        chatlieu: {
            type: String,
            required: false,
        },
        kichthuocmanhinh: {
            type: String,
            required: false,
        },
        loaiphukien: {
            type: String,
            required: false,
        },
        congnghe: {
            type: String,
            required: false,
        },
        congsuat: {
            type: String,
            required: false,
        },
        baohanh: {
            type: String,
            required: false,
        },
        mota: {
            type: String,
            required: false
        }
    }, { timestamps: true })
const Products = mongoose.model('products', productSchema)
export default Products