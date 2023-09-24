import cart from "../models/cart.js";
import product from "../models/product.js";
import productsCart from "../models/productsCart.js";

// Get Cart By Makh: truyền makh
export const getCartByMaKH = async (req, res) => {
    const makh = req.query.makh;
    try {
        const order = await cart.findOne({ makh: makh });
        if (!order) {
            return res.status(404).send("Not found cart!");
        }
        const productCart = await productsCart.find({ makh: makh });

        console.log("Success!");
        res.send({ productCart, order });
    } catch (e) {
        res.status(500).send(e.message);
    }
};

// Add Product vào Order: truyền makh, masp, mausac, soluong, rom
export const addSpToCart = async (req, res) => {
    const item = req.body;
    try {
        const kh = await cart.findOne({ makh: item.makh });
        const sp = await product.findOne({ _id: item.masp });
        if (!sp) {
            return res.status(404).send("Not found product");
        }

        if (!kh) {
            const productCart = new productsCart();
            const order = new cart();

            order.makh = item.makh;
            productCart.makh = item.makh;
            productCart.masp = item.masp;
            productCart.tensp = sp.tensanpham;
            productCart.mausac = item.mausac;
            productCart.soluong = item.soluong;
            productCart.gia = sp.gia;
            productCart.dungluong = item.rom;
            productCart.hinh = sp.hinh;

            await productCart.save();

            const products = await productsCart.find({ makh: item.makh });
            order.tongtrigia = products.reduce((acc, currentValue) => {
                return acc + currentValue.gia * currentValue.soluong;
            }, 0);

            await order.save();

            res.status(201).send({ order, productCart });
        } else {
            const spOld = await productsCart.findOne({
                makh: item.makh,
                masp: item.masp,
                mausac: item.mausac,
                dungluong: item.rom,
            });
            // console.log(spOld);
            if (spOld) {
                spOld.soluong += 1;
                await spOld.save();

                const order = await cart.findOne({ makh: item.makh });
                // console.log(order);
                order.tongtrigia = Number(order.tongtrigia) + Number(sp.gia);

                await order.save();
                res.status(201).send({ order, spOld });
            } else {
                const productCart = new productsCart();

                productCart.makh = item.makh;
                productCart.masp = item.masp;
                productCart.tensp = sp.tensanpham;
                productCart.mausac = item.mausac;
                productCart.soluong = item.soluong;
                productCart.gia = sp.gia;
                productCart.dungluong = item.rom;
                productCart.hinh = sp.hinh;

                await productCart.save();

                const products = await productsCart.find({ makh: item.makh });
                kh.tongtrigia = products.reduce((acc, currentValue) => {
                    return acc + currentValue.gia * currentValue.soluong;
                }, 0);

                await kh.save();
                res.status(201).send({ kh, productCart });
            }
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
};

// Delete sp from products: truyền makh, masp, mausac, rom
export const deleteSp = async (req, res) => {
    const item = req.query;
    try {
        const productCart = await productsCart.findOne({
            masp: item.masp,
            makh: item.makh,
            mausac: item.mausac,
            dungluong: item.rom,
        });
        if (!productCart) {
            return res.status(404).send("Not found product in cart!");
        }
        await productsCart.deleteOne({
            masp: item.masp,
            makh: item.makh,
            mausac: item.mausac,
            dungluong: item.rom,
        });

        const order = await cart.findOne({ makh: item.makh });
        const products = await productsCart.find({ makh: item.makh });

        order.tongtrigia = products.reduce((acc, currentValue) => {
            return acc + currentValue.gia * currentValue.soluong;
        }, 0);

        order.save();

        res.send(productCart);
    } catch (e) {
        res.status(500).send(e.message);
    }
};

// Delete all sp from products
export const deleteAllSp = async (req, res) => {
    const item = req.query;
    try {
        console.log(item.makh);
        await productsCart.deleteMany({
            makh: item.makh,
        });
        const order = await cart.findOne({ makh: item.makh });
        const products = await productsCart.find({makh: item.makh});
        order.tongtrigia = products.reduce((acc, currentValue) => {
            return acc + currentValue.gia * currentValue.soluong;
        }, 0);

        order.save();

        res.send({ order, products });
    } catch (e) {
        res.status(500).send(e.message);
    }
};

// Update so luong sp trong cart
// Cần truyền vào makh, masp, mausac, soluong, rom
export const updateCart = async (req, res) => {
    const query = req.query;
    const item = req.body;
    try {
        const order = await cart.findOne({ makh: query.makh });

        if (!order) {
            return res.status(404).send("Not found cart!");
        }

        const sp = await productsCart.findOne({
            makh: query.makh,
            masp: query.masp,
            mausac: query.mausac,
            dungluong: query.rom,
        });

        if (!sp) {
            return res.status(404).send("Not found product in cart!");
        }

        sp.soluong = item.soluong;
        await sp.save();

        const products = await productsCart.find({ makh: query.makh });
        order.tongtrigia = products.reduce((acc, currentValue) => {
            return acc + currentValue.gia * currentValue.soluong;
        }, 0);

        await order.save();
        res.send({ order, sp });
    } catch (e) {
        res.status(500).send(e.message);
    }
};

// Delete order: truyen makh
export const deleteGH = async (req, res) => {
    try {
        const order = await cart.findOneAndDelete({ makh: req.params.id });
        if (!order) {
            return res.status(404).send("Not found order!");
        }

        res.send(order);
    } catch (e) {
        res.status(500).send(e);
    }
};
