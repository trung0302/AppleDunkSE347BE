import mongoose from 'mongoose'
import validator from 'validator'

const newsSchema = new mongoose.Schema({
    madh: {
        type: String,
        default: "DH0",
        trim: true,
    },
    makh: {
        type: String,
        required: true,
        trim: true,
    },
    tongtrigia: {
        type: Number,
        default: 0,
    },
    products: [{
        productId: String,
        soluong: Number
    }], 
    transId: {
        type: String
    },
    orderUrl: {
        type: String
    },
    tinhtrang: {
        type: String,
        default: "Chưa thanh toán"
    },
    paymentMethod: {
        type: String
    },
    address: {
        type: String
    }

}, { timestamps: true })
const Order = mongoose.model('orders', newsSchema)
export default Order

