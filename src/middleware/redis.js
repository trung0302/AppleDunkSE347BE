import { createClient } from "redis";
let redisClient;

// (async () => {
//     redisClient = createClient({
//         url: 'redis://redis:6379'
//     });
    
//     redisClient.on("error", (error) =>
//         console.error(`Redis Client Error : ${error}`)
//     );

//     await redisClient.connect();
// })();

// --------------------PRODUCT----------------------
// Cache product by id
export const cachedProductById = async (req, res, next) => {
    const product = req.params.id;
    let results;
    try {
        const cacheResults = await redisClient.get(product);
        if (cacheResults) {
            results = JSON.parse(cacheResults);
            res.send({
                fromCache: true,
                data: results,
            });
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(404);
    }
};

// ---------------------NEWS-------------------------
// Cached all news data
export const cachedAllNewsData = async (req, res, next) => {
    const news = "allNews";
    let results;
    try {
        const cacheResults = await redisClient.get(news);
        if (cacheResults) {
            results = JSON.parse(cacheResults);
            res.send({
                fromCache: true,
                data: results,
            });
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(404);
    }
};
// Cache news by id
export const cachedNewsById = async (req, res, next) => {
    const news = req.params.id;
    let results;
    try {
        const cacheResults = await redisClient.get(news);
        if (cacheResults) {
            results = JSON.parse(cacheResults);
            res.send({
                fromCache: true,
                data: results,
            });
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(404);
    }
};

// -------------------------STORE-------------------------
// Cache all stores
export const cachedAllStoresData = async (req, res, next) => {
    const stores = "allStores";
    let results;
    try {
        const cacheResults = await redisClient.get(stores);
        if (cacheResults) {
            results = JSON.parse(cacheResults);
            res.send({
                fromCache: true,
                data: results,
            });
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(404);
    }
};

// Cache Store By Id
export const cachedStoreById = async (req, res, next) => {
    const store = req.params.id;
    let results;
    try {
        const cacheResults = await redisClient.get(store);
        if (cacheResults) {
            results = JSON.parse(cacheResults);
            res.send({
                fromCache: true,
                data: results,
            });
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(404);
    }
};

// ------------------Promotion-------------------------
// Cache all promotions
export const cachedAllPromotionsData = async (req, res, next) => {
    const promotions = "allPromotions";
    let results;
    try {
        const cacheResults = await redisClient.get(promotions);
        if (cacheResults) {
            results = JSON.parse(cacheResults);
            res.send({
                fromCache: true,
                data: results,
            });
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(404);
    }
};

// Cache Promotion By Id
export const cachedPromotionById = async (req, res, next) => {
    const store = req.params.id;
    let results;
    try {
        const cacheResults = await redisClient.get(store);
        if (cacheResults) {
            results = JSON.parse(cacheResults);
            res.send({
                fromCache: true,
                data: results,
            });
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(404);
    }
};
