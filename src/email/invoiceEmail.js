import nodemailer from 'nodemailer'
import dotenv from "dotenv";
dotenv.config();
import Product from "../models/product.js"

// email,hoadon,cthds
const invoiceEmail = async(mahd, ngayxuathd, khachhang, products, tongtrigia, address) => {
    try{
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
    let src = "./logo.png"
    let logoImg = `<img class="logo" src="https://firebasestorage.googleapis.com/v0/b/se347-ce5f6.appspot.com/o/logo.png?alt=media&token=72f0a958-9bb2-4e13-8f44-e2dd65f7f510">`
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
                                    <td class="last-td">${logoImg}</td>
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
                                        <td>${ address || "Không có"}</td>
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
