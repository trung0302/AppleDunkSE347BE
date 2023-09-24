import khuyenmai from "../models/khuyenmai.js";
import moment from "moment/moment.js";
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

export const getAllKM = async (req, res) => {
    try {
        const listKM = await khuyenmai.find({});
        res.send(listKM);
    } catch (e) {
        res.status(500).send(e);
    }
};

// Cache all promotion data
export const getAllKMcached = async (req, res) => {
    try {
        const listKM = await khuyenmai.find({});
        await redisClient.set("allPromotions", JSON.stringify(listKM), {
            EX: 180,
            NX: true,
        });
        res.send({
            fromCache: false,
            data: listKM,
        });

        // res.send(listKM);
    } catch (e) {
        res.status(500).send(e);
    }
};

export const getKMByID = async (req, res) => {
    const _id = req.params.id;
    try {
        const km = await khuyenmai.findOne({ _id });
        if (!km) {
            return res.status(404).send("Not found");
        }
        res.send(km);
    } catch (e) {
        res.status(500).send(e);
    }
};

// Cached
export const getKMByIdCached = async (req, res) => {
    const _id = req.params.id;
    try {
        const km = await khuyenmai.findOne({ _id });
        if (!km) {
            return res.status(404).send("Not found");
        }
        await redisClient.set(_id, JSON.stringify(km), {
            EX: 180,
            NX: true,
        });
        res.send({
            fromCache: false,
            data: km,
        });
    } catch (e) {
        res.status(500).send(e);
    }
};

export const getKMByMaKM = async (req, res) => {
    const id = req.params.makm;
    try {
        const km = await khuyenmai.findOne({ makm: id });
        if (!km) {
            return res.status(404).send("Not found");
        }
        res.send(km);
    } catch (e) {
        res.status(500).send(e);
    }
};

export const getKMByApdung = async (req, res) => {
    try {
        const today = moment().startOf('day');
        const listKM = await khuyenmai.find({
            apdung: { $lte: req.params.apdung },
            batdau: {$lte: today},
            ketthuc: {$gte: today}
        });
        res.send(listKM);
    } catch (e) {
        res.status(500).send(e);
    }
};

export const getKMByApdungAndPhanTram = async (req, res) => {
    try {
        const limit = parseInt(req.query.pageSize) || 10;
        const skip = (parseInt(req.query.page) - 1) * limit || 0;
        const today = moment().startOf('day');
        const listKM = await khuyenmai.find({
            apdung: { $lte: req.params.apdung },
            phantramkm: { $gte: req.params.phantramkm },
            batdau: {$lte: today},
            ketthuc: {$gte: today}
        }).skip(skip).limit(limit);
        const totalKM = (await khuyenmai.find({
                        apdung: { $lte: req.params.apdung },
                        phantramkm: { $gte: req.params.phantramkm },
                        batdau: {$lte: today},
                        ketthuc: {$gte: today}
                    })).length;
        const totalPages = Math.ceil(totalKM / limit);
        res.send({totalKM, listKM, totalPages});
    } catch (e) {
        res.status(500).send(e);
    }
};

export const addKM = async (req, res) => {
    const km = new khuyenmai(req.body);
    try {
        if ((await (await khuyenmai.find({})).length) !== 0) {
            const kmLast = await (await khuyenmai.find({})).splice(-1);
            const makmLast = kmLast[0].makm.substring(2) || "0";
            const newmakm = "KM" + Number(Number(makmLast) + 1);
            km.makm = newmakm;
        }
        // Chuyển đổi giá trị req.body.batdau thành kiểu Date
        km.batdau = moment(req.body.batdau, 'DD/MM/YYYY').toDate();
        // Chuyển đổi giá trị req.body.ketthuc thành kiểu Date
        km.ketthuc = moment(req.body.ketthuc, 'DD/MM/YYYY').toDate();
        await km.save();
        res.status(201).send(km);
    } catch (e) {
        res.status(400).send(e);
    }
};

export const updateKM = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = [
        "title",
        "image",
        "description",
        "dateSource",
        "detail",
        "category",
        "apdung",
        "phantramkm",
        "batdau",
        "ketthuc",
    ];
    updates.batdau = moment(req.body.batdau, 'DD/MM/YYYY').toDate();
    updates.ketthuc = moment(req.body.ketthuc, 'DD/MM/YYYY').toDate();
    const isValidOperation = updates.every((update) => {
        return allowUpdates.includes(update);
    });
    if (!isValidOperation) {
        return res.status(400).send("error: Invalid updates!");
    }
    try {
        const km = await khuyenmai.findOne({ _id: req.params.id });
        if (!km) {
            return res.status(404).send();
        }
        updates.forEach((update) => {
            km[update] = req.body[update];
        });
        await km.save();
        res.send(km);
    } catch (e) {
        res.status(500).send(e);
    }
};

export const deleteKM = async (req, res) => {
    try {
        const km = await khuyenmai.findByIdAndDelete({ _id: req.params.id });
        if (!km) {
            return res.status(404).send();
        }
        res.send(km);
    } catch (e) {
        res.status(500).send(e);
    }
};
