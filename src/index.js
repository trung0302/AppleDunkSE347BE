import express from "express";
import dotenv from "dotenv";
import os from "node:os";
dotenv.config();

import "./database/mongoose.js";
import cors from "cors";
import sampleRouter from "../src/routers/sampleRouter.js";
import passport from "passport";
import session from "express-session";
import danhgiaRouter from "../src/routers/danhgiaRouter.js";
import khachhangRouter from "../src/routers/khachhangRouter.js";
import nhanvienRouter from "./routers/nhanvienRouter.js";
import khuyenmaiRouter from "../src/routers/khuyenmaiRouter.js";
import baohanhRouter from "../src/routers/baohanhRouter.js";
import newsRouter from "./routers/newsRouter.js";
import cartRouter from "../src/routers/cartRouter.js";
import hoadonRouter from "../src/routers/hoadonRouter.js";
import productRouter from "../src/routers/productRouter.js";
import thanhtoanRouter from "../src/routers/thanhtoanRouter.js";
import orderRouter from "../src/routers/orderRouter.js";
import storeRouter from "../src/routers/storeRouter.js";
import excelRouter from "../src/routers/excelRouter.js";
import recommendRouter from "../src/routers/recommendRouter.js";
import revenueRouter from "../src/routers/revenueRouter.js";


const app = express();
// const port = process.env.PORT || 3000;
const port = process.env.MONGO_PORT || 3000;
app.use(cors());

app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));
app.use(sampleRouter);
app.use(khuyenmaiRouter);
app.use(baohanhRouter);
app.use(newsRouter);
app.use(cartRouter);
app.use(danhgiaRouter);
app.use(khachhangRouter);
app.use(nhanvienRouter);
app.use(hoadonRouter);
app.use(productRouter);
app.use(thanhtoanRouter);
app.use(orderRouter);
app.use(storeRouter);
app.use(excelRouter);
app.use(recommendRouter);
app.use(revenueRouter);


app.use("/api/hostname", async (req, res) => {
    console.log(`I'm sending a response ${os.hostname()}`);
    res.json({ message: `Your request is processed by Server ${os.hostname()}` , hostname: os.hostname() });
});
app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: "123",
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
app.listen(port, () => {
    console.log("Server is up on PORT " + port);
});
