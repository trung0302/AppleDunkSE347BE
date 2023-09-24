import stores from "../models/store.js";
import { createClient } from "redis";
let redisClient;

(async () => {
    redisClient = createClient({
        url: "redis://redis:6379",
    });

    redisClient.on("error", (error) =>
        console.error(`Redis Client Error : ${error}`)
    );

    await redisClient.connect();
})();

export const getAllStores = async (req, res) => {
    try {
        const limit = parseInt(req.query.pageSize) || 10;
        const skip = (parseInt(req.query.page) - 1) * limit || 0;
        let filter = {};
        const listStores = await stores.find(filter).skip(skip).limit(limit);
        const totalStores = (await stores.find(filter)).length;
        const totalPages = Math.ceil(totalStores / limit);
        // const listStore = await stores.find({});
        // const totalStore = (await stores.find({})).length;

        res.send({ listStores, totalStores });
    } catch (e) {
        res.status(500).send(e);
    }
};

// Caching
export const getAllStoresCached = async (req, res) => {
    try {
        const limit = parseInt(req.query.pageSize) || 10;
        const skip = (parseInt(req.query.page) - 1) * limit || 0;
        let filter = {};
        const listStores = await stores.find(filter).skip(skip).limit(limit);
        const totalStores = (await stores.find(filter)).length;
        const totalPages = Math.ceil(totalStores / limit);
        // const listStore = await stores.find({});
        // const totalStore = (await stores.find({})).length;
        await redisClient.set(
            "allStores",
            JSON.stringify({ listStores, totalStores }),
            {
                EX: 180,
                NX: true,
            }
        );

        res.send({
            fromCache: false,
            data: { listStores, totalStores },
        });
        // res.send({ listStores, totalStores });
    } catch (e) {
        res.status(500).send(e);
    }
};

export const getStoresById = async (req, res) => {
    try {
        const store = await stores.findOne({ _id: req.params.id });
        if (!store) {
            return res.status(404).send("Not found");
        }
        res.send(store);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Caching store by id
export const getStoresByIdCached = async (req, res) => {
    try {
        const maStore = req.params.id;
        const store = await stores.findOne({ _id: req.params.id });
        if (!store) {
            return res.status(404).send("Not found");
        }
        await redisClient.set(maStore, JSON.stringify(store), {
            EX: 180,
            NX: true,
        });
        console.log("Success!");
        res.send({
            fromCache: false,
            data: store,
        });

        // res.send(store);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getStoreByProvince = async (req, res) => {
    const code = req.query.code;
    try {
        const store = await stores.find({ provinceCode: req.query.code });
        if (!store) {
            return res.status(404).send("Not found");
        }
        res.send(store);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getStoreByDistrict = async (req, res) => {
    const code = req.query.code;
    try {
        const store = await stores.find({ districtCode: code });
        if (!store) {
            return res.status(404).send("Not found!");
        }
        res.send(store);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const addStore = async (req, res) => {
    const store = new stores(req.body);
    try {
        await store.save();
        res.status(201).send(store);
    } catch (error) {
        res.status(400).send(error);
    }
};
// address, name
export const updateStore = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ["name", "provinceCode", "districtCode"];
    const isValidOperation = updates.every((update) => {
        return allowUpdates.includes(update);
    });
    if (!isValidOperation) {
        return res.status(400).send("error: Invalid updates!");
    }
    try {
        const store = await stores.findOne({ _id: req.params.id });
        if (!store) {
            return res.status(404).send("Not found");
        }
        updates.forEach((update) => {
            store[update] = req.body[update];
        });
        await store.save();
        res.send(store);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const deleteStore = async (req, res) => {
    try {
        const store = await stores.findByIdAndDelete({
            _id: req.params.id,
        });
        if (!store) {
            return res.status(404).send("Not found");
        }
        await res.send(store);
    } catch (error) {
        res.status(500).send(error);
    }
};
