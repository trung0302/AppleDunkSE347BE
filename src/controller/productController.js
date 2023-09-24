import Products from "../models/product.js";
export const getAllProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.pageSize) || 100;
        const skip = (parseInt(req.query.page) - 1) * limit || 0;
        let filter = {}
        if (req.query.loaisanpham) {
            filter.loaisanpham = req.query.loaisanpham
        }
        if (req.query.phanloai) {
            filter.phanloai = req.query.phanloai;
        }
        if(req.query.tensanpham) {
            const searchQuery = req.query.tensanpham;
            filter.tensanpham = { $regex: searchQuery, $options: 'i' };
        }
        let listProducts;
        if(req.query.sortOrder) {
            if (req.query.sortOrder === "asc") {
                listProducts = await Products.find(filter).skip(skip).limit(limit).sort({gia: 1}).collation({locale: "en_US", numericOrdering: true})
            } else {
                listProducts = await Products.find(filter).skip(skip).limit(limit).sort({gia: -1}).collation({locale: "en_US", numericOrdering: true})
            }
        } else {
            listProducts = await Products.find(filter).skip(skip).limit(limit)
        }
        const totalProducts = (await Products.find(filter)).length
        const totalPages = Math.ceil(totalProducts/limit);

        res.send({ totalProducts, listProducts, totalPages })

    } catch (error) {
        res.status(500).send(error)
    }
}
export const getAllSubCategory = async (req, res) => {
    try {
        const listSubCategories = await Products.distinct("phanloai", {"loaisanpham": req.params.loaisanpham})
        res.send(listSubCategories)
    } catch (error) {
        res.status(500).send(error)
    }
}
export const getProductById = async (req, res) => {
    try {
        const products = await Products.findOne({ _id: req.params.id })
        if (!products) {
            return res.status(404).send("Not found")
        }
        res.send(products)
    } catch (error) {
        res.status(500).send(error)
    }
}
export const addProduct = async (req, res) => {
    const products = new Products(req.body)
    try {
        await products.save()
        res.status(201).send(products)
    } catch (error) {
        res.status(400).send(error)
    }
}
export const updateProduct = async (req, res) => {
    const updates = Object.keys(req.body)
    try {
        // console.log(req.params.id);
        const products = await Products.findOne({ _id: req.params.id })
        if (!products) {
            return res.status(404).send('Not found')
        }
        // console.log(updates);
        // console.log(req.body);
        //console.log(products[mausac]);
        // console.log(products[soluong])
        updates.forEach(update => {
            // console.log(req.body[update]);
            products[update] = req.body[update]
            // console.log(products[update]);

        })
        await products.save()
        res.send(products)
    } catch (error) {
        res.status(500).send(error)
    }

}
export const deleteProduct = async (req, res) => {
    try {
        const products = await Products.findByIdAndDelete({ _id: req.params.id })
        if (!products) {
            return res.status(404).send('Not found')
        }
        await res.send(products)
    } catch (error) {
        res.status(500).send(error)
    }
}