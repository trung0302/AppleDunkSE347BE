import Order from '../models/order.js'
import Product from "../models/product.js"

export const getAllOrders = async (req, res) => {
    try {
        const limit = parseInt(req.query.pageSize) || 5;
        const skip = (parseInt(req.query.page) - 1) * limit || 0;
        let filter = {}
        if (req.query.makh) {
            filter.makh = req.query.makh
        }
        const orders = await Order.find(filter).skip(skip).limit(limit);
        const totalOrder = (await Order.find(filter)).length;
        res.send({ totalOrder, orders })
    } catch (e) {
        res.status(500).send(e)
    }
}

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ madh: req.params.id })
        if (!order) {
            return res.status(404).send("Not found")
        }
        res.send(order)
    } catch (error) {
        res.status(500).send(error)
    }
}

export const getOrderByTransId = async (req, res) => {
    try {
        const order = await Order.findOne({ transId: req.params.id })
        if (!order) {
            return res.status(404).send("Not found")
        }
        res.send(order)
    } catch (error) {
        res.status(500).send(error)
    }
}

export const addOrder = async (req, res) => {
    try {
        const order = new Order({
            ...req.body
        })
        if (await (await Order.find({})).length !== 0) {
            const lastOrder = await (await Order.find({})).splice(-1)
            const lastMADH = lastOrder[0].madh.substring(2) || "0"
            const newMADH = "DH" + Number(Number(lastMADH) + 1)
            order.madh = newMADH
        }
        // const products = order.products
        // let sum = 0;
        // for (var item of products) {
        //     const product = await Product.findById(item.productId)
        //     console.log(item)
        //     if (!product) {
        //         return res.status(404).send(`Not found product: ${item.tensanpham}`)
        //     }
        //     sum += product.gia * Number(item.soluong)
        // }
        // order.tongtrigia = sum
        await order.save()
        res.status(201).send({ order })
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const updateDonHang = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ["tinhtrang", "products", "orderUrl", "transId", "paymentMethod"]
    const isAllowUpdate = updates.every(update => allowUpdates.includes(update))

    if (!isAllowUpdate) {
        return res.status(400).send("error: Invalid updates!")
    }

    try {
        const order = await Order.findOne({ madh: req.params.id })
        if (!order) {
            return res.status(404).send('Not found')
        }
        updates.forEach(update => order[update] = req.body[update])
        // if (updates.includes("products")) {
        //     const products = order.products
        //     let sum = 0;
        //     for (var item of products) {
        //         const product = await Product.findById(item.productId)
        //         console.log(item)
        //         if (!product) {
        //             return res.status(404).send(`Not found product: ${item.tensanpham}`)
        //         }
        //         sum += product.gia * Number(item.soluong)
        //     }
        //     order.tongtrigia = sum
        // }
        await order.save()
        res.send(order)
    } catch (error) {
        res.status(500).send(error)
    }
}

export const deleteDonhang = async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ madh: req.query.madh })
        if (!order) {
            return res.status(404).send("Not found")
        }
        res.send(order)
    } catch (e) {
        res.status(500).send(e)
    }
}