import { createHmac } from 'crypto';
import { request } from 'https';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import qs from 'qs';
import { resolve } from 'path';
import dotenv from "dotenv";
dotenv.config();

export const thanhtoanMoMo= async(req,res)=>{
    try{
        //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
        //parameters
        var accessKey = 'F8BBA842ECF85';
        var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        var orderInfo = 'pay with MoMo';
        var partnerCode = 'MOMO';
        var redirectUrl = process.env.THANHTOANBACKURLMOMO;
        var ipnUrl = process.env.THANHTOANBACKURLMOMO;
        var requestType = "payWithMethod";
        var amount = req.body.amount || 50000;
        var orderId = partnerCode + new Date().getTime();
        var requestId = orderId;
        var extraData ='';
        var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
        var orderGroupId ='';
        var autoCapture =true;
        var lang = 'vi';

        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
        //puts raw signature
        console.log("--------------------RAW SIGNATURE----------------")
        console.log(rawSignature)
        //signature
        var signature =createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
        console.log("--------------------SIGNATURE----------------")
        console.log(signature)

        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode : partnerCode,
            partnerName : "Test",
            storeId : "MomoTestStore",
            requestId : requestId,
            amount : amount,
            orderId : orderId,
            orderInfo : orderInfo,
            redirectUrl : redirectUrl,
            ipnUrl : ipnUrl,
            lang : lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData : extraData,
            orderGroupId: orderGroupId,
            signature : signature
        });
        //Create the HTTPS objects
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        }
        //Send the request and get the response
      var p= new Promise(function(resovle, reject){
        const req = request(options, res => {
            console.log(`Status: ${res.statusCode}`);
            console.log(`Headers: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (body) => {
                console.log('Body: ');
                console.log(body);
                console.log('resultCode: ');
                console.log(JSON.parse(body).resultCode);
                resovle(body)
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        })

        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
            reject(e.message);
        });
        // write data to request body
        console.log("Sending....")
        req.write(requestBody);
        req.end();
      })
      p.then(function(data){
        res.send({orderUrl: JSON.parse(data).payUrl, transId: JSON.parse(data).orderId })
     }).catch(function(error){
        res.send(error)
     })
        
    }catch(e){
        res.status(500).send(e)
    }
}
export const checkMomo= async(req,res)=>{
    try{
        //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
        //parameters
        var accessKey = 'F8BBA842ECF85';
        var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        var orderInfo = 'pay with MoMo';
        var partnerCode = 'MOMO';
        var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
        var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
        var requestType = "payWithMethod";
        var amount = '50000';
        var orderId = req.body.orderId;
        var requestId = orderId;
        var extraData ='';
        var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
        var orderGroupId ='';
        var autoCapture =true;
        var lang = 'vi';

        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        var rawSignature = "accessKey=" + accessKey +  "&orderId=" + orderId  + "&partnerCode=" + partnerCode  + "&requestId=" + requestId;
        //puts raw signature
        console.log("--------------------RAW SIGNATURE----------------")
        console.log(rawSignature)
        //signature
        var signature = createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
        console.log("--------------------SIGNATURE----------------")
        console.log(signature)

        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode : partnerCode,
            orderId: orderId,
            requestId : requestId,
            lang : lang,
            signature : signature
        });
        //Create the HTTPS objects
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/query',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        }
        //Send the request and get the response
        const p= new Promise(function(resolve, reject){
            const req = request(options, res => {
                console.log(`Status: ${res.statusCode}`);
                console.log(`Headers: ${JSON.stringify(res.headers)}`);
                res.setEncoding('utf8');
                res.on('data', (body) => {
                    // console.log('Body: ');
                    // console.log(body);
                    // console.log('resultCode: ');
                    // console.log(JSON.parse(body).resultCode);
                    resolve(JSON.parse(body));
                });
                res.on('end', () => {
                    console.log('No more data in response.');
                });
            })
    
            req.on('error', (e) => {
                console.log(`problem with request: ${e.message}`);
                reject(e.message);
            });
            // write data to request body
            console.log("Sending....")
            req.write(requestBody);
            req.end();
        })
        p.then(function(data){
            res.send(data)
        }).catch(function(error){
            res.send(error)
        })
        
    }catch(e){
        res.status(500).send(e)

    }
}
export const thanhtoanZalo=async(req, res)=>{
    try{
        // Node v10.15.3
        // const axios = require('axios').default; // npm install axios
        // const CryptoJS = require('crypto-js'); // npm install crypto-js
        // const moment = require('moment'); // npm install moment

        // APP INFO
        const config = {
            app_id: "2554",
            key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
            key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
            endpoint: "https://sb-openapi.zalopay.vn/v2/create"
        };

        const embed_data = {
            redirecturl: process.env.THANHTOANBACKURLZALO
        };

        const items = [{}];
        const transID = Math.floor(Math.random() * 1000000);
        const order = {
            app_id: config.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
            app_user: "user123",
            app_time: Date.now(), // miliseconds
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: req.body.amount,
            description: `AppleDunk - Payment for the order #${transID}`,
            // bank_code: "zalopayapp",
        };

        // appid|app_trans_id|appuser|amount|apptime|embeddata|item
        const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        // axios.post(config.endpoint, null, { params: order })
        //     .then(res => {
        //         console.log(res.data);
        //     })
        //     .catch(err => console.log(err));
        const response = await axios.post(config.endpoint, null, { params: order })
        console.log(response.data);
        res.send({orderUrl: response.data.order_url,transId: order.app_trans_id});
    }catch(e){
        res.status(500).send(e)
    }
}
export const checkZalo=async(req,res)=>{
    try{
        // const axios = require('axios').default; // npm install axios
        // const CryptoJS = require('crypto-js'); // npm install crypto-js
        // const qs = require('qs')
        
        const config = {
            app_id: "2554",
            key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
            key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
            endpoint: "https://sb-openapi.zalopay.vn/v2/query"
        };
        
        let postData = {
            app_id: config.app_id,
            app_trans_id: req.body.orderId, // Input your app_trans_id
        }
        
        let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
        postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
        
        
        let postConfig = {
            method: 'post',
            url: config.endpoint,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(postData)
        };
        
        // axios(postConfig)
        //     .then(function (response) {
        //         console.log(JSON.stringify(response.data));
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
        const response= await axios(postConfig);
        res.send(response.data);
    }catch(e){
        res.status(500).send(e)
    }
}