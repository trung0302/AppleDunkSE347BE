import mongoose from 'mongoose'
import validator from 'validator'

const newsSchema = new mongoose.Schema({
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
    },
    slug: {
        type: String,
        required: false
    }
}, { timestamps: true })
const News = mongoose.model('news', newsSchema)
export default News

