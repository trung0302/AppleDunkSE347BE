import News from "../models/news.js";

import { createClient } from "redis";
let redisClient;

// (async () => {
//     redisClient = createClient({
//         url: "redis://redis:6379",
//     });

//     redisClient.on("error", (error) =>
//         console.error(`Redis Client Error : ${error}`)
//     );

//     await redisClient.connect();
// })();

// slug converter
function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    // eslint-disable-next-line
    str = str.replace(
        /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
        " "
    );
    str = str.trim();
    return str;
}

export default function convertToSlug(title) {
    var slug = removeVietnameseTones(title)
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 -]/g, "")
        .replace(/\s+/g, "-");
    return slug;
}

export const getAllNews = async (req, res) => {
    try {
        const limit = parseInt(req.query.pageSize) || 10;
        const skip = (parseInt(req.query.page) - 1) * limit || 0;
        let filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        const listNews = await News.find(filter).skip(skip).limit(limit);
        const totalNews = (await News.find(filter)).length;
        const totalPages = Math.ceil(totalNews / limit);
        
        res.send({ totalNews, listNews, totalPages });
    } catch (error) {
        res.status(500).send(error);
    }
};

// Cached All News data
export const getAllNewsCached = async (req, res) => {
    try {
        const limit = parseInt(req.query.pageSize) || 10;
        const skip = (parseInt(req.query.page) - 1) * limit || 0;
        let filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        const listNews = await News.find(filter).skip(skip).limit(limit);
        const totalNews = (await News.find(filter)).length;
        const totalPages = Math.ceil(totalNews / limit);

        await redisClient.set(
            "allNews",
            JSON.stringify({ totalNews, listNews, totalPages }),
            {
                EX: 180,
                NX: true,
            }
        );
        res.send({
            fromCache: false,
            data: { totalNews, listNews, totalPages },
        });
        // res.send({ totalNews, listNews, totalPages });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getNewsById = async (req, res) => {
    try {
        const news = await News.findOne({ slug: req.params.id });
        if (!news) {
            return res.status(404).send("Not found");
        }
        res.send(news);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Cached news by id
export const getNewsByIdCached = async (req, res) => {
    try {
        const maNews = req.params.id;
        const news = await News.findOne({ slug: req.params.id });
        if (!news) {
            return res.status(404).send("Not found");
        }

        await redisClient.set(maNews, JSON.stringify(news), {
            EX: 180,
            NX: true,
        });
        res.send({
            fromCache: false,
            data: news,
        });
        // res.send(news);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const addNews = async (req, res) => {
    const news = new News(req.body);
    try {
        news.slug = convertToSlug(news.title);
        await news.save();
        res.status(201).send(news);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const updateNews = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = [
        "title",
        "image",
        "description",
        "dateSource",
        "detail",
        "category",
    ];
    const isAllowUpdate = updates.every((update) =>
        allowUpdates.includes(update)
    );

    if (!isAllowUpdate) {
        return res.status(400).send("error: Invalid updates!");
    }

    try {
        const news = await News.findOne({ slug: req.params.id });
        if (!news) {
            return res.status(404).send("Not found");
        }
        updates.forEach((update) => (news[update] = req.body[update]));
        await news.save();
        res.send(news);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const deleteNews = async (req, res) => {
    try {
        const news = await News.findOneAndDelete({ slug: req.params.id });
        if (!news) {
            return res.status(404).send("Not found");
        }
        await res.send(news);
    } catch (error) {
        res.status(500).send(error);
    }
};
