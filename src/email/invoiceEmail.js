import nodemailer from 'nodemailer'
import dotenv from "dotenv";
dotenv.config();
import Product from "../models/product.js"
// const nodemailer = require("nodemailer");
// const Car=require('../models/car')
// email,hoadon,cthds
const invoiceEmail = async(mahd, ngayxuathd, khachhang, products, tongtrigia) => {
    try{
        // let valueInvoiceString=``
        // for(var item of cthds){
        //     const car=await Car.findOne({macar: item.macar})
        //     valueInvoiceString=valueInvoiceString+`
        //     <tr style="text-align:center;">
        //     <td style=" border: 1px solid #ddd;" >${item.macar}</td>
        //     <td style=" border: 1px solid #ddd;" >${car.ten}</td>
        //     <td style=" border: 1px solid #ddd;" >${car.gia.toLocaleString()} VNĐ</td>
        //     <td style=" border: 1px solid #ddd;" >${item.soluong}</td>
        //     </tr>
        //     `
        // }

        let valueInvoiceString=``
        let index = 1
        for(var item of products){
            // console.log("item ",item)
            const product =await Product.findById({_id: item.productId})
            // console.log(product.hinh)
            valueInvoiceString=valueInvoiceString+`
            <tr>
                <td>${index}</td>
                <td><img src="${product.hinh}"/></td>
                <td>${product.tensanpham}</td>
                <td>${item.soluong}</td>
                <td>${product.gia.toLocaleString()} VNĐ</td>
            </tr>
            `;
            index = index + 1
        }
    let transporter = nodemailer.createTransport({

        service: "gmail",
        auth: {
            user: process.env.SHOPEMAIL,
            pass: process.env.PASSMAIL
        },
    });
    transporter.sendMail({
        from: process.env.SHOPEMAIL, 
        to: `${khachhang.email}`, 
        subject: "AppleDunk: Hóa đơn", 
        text: "Hóa đơn", 
        html: `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;700&display=swap" rel="stylesheet">
            
                
                <style>
                    .im {
                        color: #000;
                    }
            
                    *{
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Nunito', sans-serif;
                    }
            
                    .a3s {
                        font-family: 'Nunito', sans-serif;
                    }
        
                    .content-email {
                        margin-bottom: 20px;
                        font-size: 18px;
                    }
        
                    .send-invoice {
                        font-size: 18px;
                        font-weight: 600;
                        color: rgba(34, 139, 34, 1);
                    }
        
                    .wrap {
                        background-color: rgba(48, 113, 174, 0.2);
                        width: 80%;
                        margin: auto;
                        padding: 50px 100px;
                    }
            
                    .invoice-wrap {
                        background-color: white;
                        border-radius: 3px;
                        padding: 40px;
                        border: 10px solid rgba(48, 113, 174, 0.5);
                    }
            
                    .invoice-header {
                        padding-bottom: 20px;
                        border-bottom: 1px solid rgba(48, 113, 174, 0.2);
                        width: 100%;
                    }
            
                    .invoice-header .last-td {
                        text-align: end;
                    }
            
                    .title {
                        height: fit-content;
                        font-size: 32px;
                    }
            
                    .logo {
                        height: 100px;
                        background-color: rgb(5, 91, 167);
                    }
            
                    .date-mahd {
                        padding: 20px 0;
                        border-bottom: 1px solid rgba(48, 113, 174, 0.2);
                        width: 100%;
                    }
            
                    .date-mahd .last-td {
                        text-align: end;
                    }
            
                    .infor {
                        padding: 20px 0;     
                    }
            
                    .infor-table {
                        width: 100%;
                    }
                    .infor-table td {
                        padding: 5px 0;
                    }
                    .infor-col1 {
                        width: 30%;
                    }
            
                    .infor-col2 {
                        width: 70%;
                    }

                    
                    .invoice-table {
                        width: 100%;
                    }
            
                    .invoice-table th,
                    .invoice-table td {
                        padding: 10px 0;
                    }
            
                    .invoice-table th {
                        background-color: rgba(48, 113, 174, 0.2);
                    }
            
                    .invoice-table td {
                        text-align: center;
                    }
            
                    .invoice-table tr {
                        outline: 1px solid rgba(48, 113, 174, 0.2);
                    }
            
                    .invoice-table img {
                        width: 60%;
                    }
                    .masp {
                        width: 5%;
                    }
            
                    .img-sp{
                        width: 25%;
                    }
            
                    .name-sp{
                        width: 30%;
                    }
            
                    .sl-sp{
                        width: 15%;
                    }
            
                    .dg-sp{
                        width: 25%;
                    }
            
                    .footer {
                        margin-top: 20px;
                        font-size: 18px;
                        font-weight: 600;
                        width: fit-content;
                        margin-left: auto;
                    }
            
                </style>
            </head>
            <body>
                <h2 class="title-email">AppleDunk xin gửi lời chào thân thương đến quý khách hàng.</h2>
                <p class="content-email">Cảm ơn bạn vì đã mua hàng tại AppleDunk. 
                    Hy vọng bạn sẽ có trải nghiệm tuyệt vời khi sử dụng sản phẩm của chúng tôi. 
                    Rất mong sẽ tiếp tục nhận được sự ủng hộ của bạn trong thời gian tới.
                </p>
                </br> <p class="send-invoice">
                    AppleDunk xin phép gửi hóa đơn đến bạn ạ.
                    <h4 style="color: #035e21;">Vui lòng liên hệ Hotline 0943415138 nếu quý khách có thắc mắc về hóa đơn.</h4>
                </p>
                
                <div class="wrap">
                        <div class="invoice-wrap">
                            <table class="invoice-header">
                                <tr>
                                    <td class="title">Hóa Đơn</td>
                                    <td><div class="empty"></div></td>
                                    <td class="last-td"> <img class="logo" src="https://lh3.googleusercontent.com/pw/AJFCJaVmJtcoQw47_lUYqDne14jIJlSXwaWDHpPdNTQ03qnfGRewBGP5BKt5zZl3u_sct6jxP8zMNoL5AZxpyr4fv4B_5F6mhbwvHzWhhZt8fiH0cw0_-KzRDk1tDOBxuRSuLh8FNx9joAOHipKR-2swfahXEEDXuE2RCEuQoJBpdbbupvqvW_Vv917pE5n--QmV1zurw4dGn7PYVtbqoCyF1SkS2zvlWNUoitIc6wUHLG8hWGG23KfCyz0VUY1HdzdzTksTWV0uMwfJch6CaqjHtY2jhsvwourKxCg7mlu5X6K11ZDw2Vht9CtVU17rnACN9WVvmCmlctqQdNf_fx2D-jTmrWQANF4Q8NzPvX6ygGWKtpHKZ_sMxTAsNdJ5An8jKs73l2lq_v2XX98nKBpbJTHKjpbQqmnTJxVOohNeva4TYPbq2ymm57y2UzFujGSWYdDZqhRtN0OtIDYcJqJ0PymyBTW8d99ldFnojWoDJ9zRoYc5O4LlFzkBoB9Q0R0gmtBEU0_h21InSOpFJcxti9_R5VMBePlS3L3IlEtZzIOGATSTv3keST1UhuAuU19kqmgMZBBZ1LHv815Y_DE0jegkUz4y46MdD-nyDzUksvUOUhY-f2xMhP1ulwxGFt05dR0U4beeU5ZLVhT5WIPd1ul2DLaFm6cGUTDpOIVl4nGpSYfLIvVw38nJnw-52m6-SAA7ps9BMaMKzR0aqekTLwsL6-Gw0FmdRC96lKfaNSQGkOJzr1YBzvAkpfXBSTdEyKOBm0c56XlRllnzz-lulBLIkQzYwcClyrxRehJ5bnxSLYdpcDZaifH_YnGzqrZ8e0RE9Gs-sTTnUJtGZudr49uBCko-elXpDBQnZreGaSNSaqsiq39FP2oRxpOD914KSOpP9MjM9Dm8XHAz00_IEtOB3XfJqMl98OLuNmKG_EMwIHcPTV-cOK5v5P710Q=w860-h225-s-no?authuser=0"></td>
                                </tr>
                            </table>
                            <table class="date-mahd">
                                <tr>
                                    <td>Ngày xuất hóa đơn: ${ngayxuathd}</td>
                                    <td><div class="empty"></div></td>
                                    <td class="last-td">Mã hóa đơn: ${mahd}</td>
                                </tr>
                            </table>
                            <div class="infor">
                                <h3>Thông tin hóa đơn</h3>
                                <table class="infor-table">
                                    <tr>
                                        <th class="infor-col1"></th>
                                        <th class="infor-col2"></th>
                                    </tr>
                                    <tr>
                                        <td>Mã Khách hàng</td>
                                        <td>${khachhang.makh}</td>
                                    </tr>
                                    <tr>
                                        <td>Tên khách hàng</td>
                                        <td>${khachhang.hoten}</td>
                                    </tr>
                                    <tr>
                                        <td>Địa chỉ nhận hàng</td>
                                        <td>${khachhang?.diachinhanhang[0].diachi}</td>
                                    </tr>
                                    
                                </table>
                            </div>
                
                            <table class="invoice-table">
                                <tr>
                                    <th class="masp">STT</th>
                                    <th class="img-sp">Hình ảnh</th>
                                    <th class="name-sp">Tên sản phẩm</th>
                                    <th class="sl-sp">Số lượng</th>
                                    <th class="dg-sp">Đơn giá</th>
                                </tr>
                                ${valueInvoiceString}
                            </table>
                
                            <div class="footer">Tổng tiền: ${tongtrigia.toLocaleString()} VNĐ</div>
                        </div>
                </div>
              
            </body>
        </html>`
        });
        return true
    }catch(e){
        throw new Error(e.message)
    }
    
}

export default invoiceEmail
