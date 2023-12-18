import HoaDon from "../models/hoadon.js";
import Order from "../models/order.js";
import invoiceEmail from "../email/invoiceEmail.js";
import KhachHang from "../models/khachhang.js";
import NhanVien from "../models/nhanvien.js"

export const getAllHoaDon= async(req,res)=>{
    try{
        const limit = parseInt(req.query.pageSize) || (await HoaDon.find()).length;
        const skip = (parseInt(req.query.page) - 1) * limit || 0;
        let filter = {};
        if(req.query.makh) {
            filter = {makh: req.query.makh}
        }
        const listHoaDon= await HoaDon.find(filter).skip(skip).limit(limit); 
        const totalHoaDon = (await HoaDon.find(filter)).length;
        console.log(process.env.SHOPEMAIL, " ", process.env.PASSMAIL)
        // let sendmail = await invoiceEmail();
        // console.log(sendmail)
        res.send({totalHoaDon, listHoaDon});
    } catch(e){
        res.status(500).send(e)
    }
} 

export const getHoaDonById = async(req, res)=>{
    try {
        const hoadon = await HoaDon.findOne({_id:req.params.id})
        if (!HoaDon)
            res.status(404).send("Not found!")
        res.send(hoadon)
    } catch (e) {
        res.status(500).send(e)
    }
}

export const deleteHoaDon = async(req, res) => {
    try {
        const hoadon = await HoaDon.findByIdAndDelete({_id:req.params.id})
        if(!HoaDon)
            res.status(404).send("Not found!")
        else {
            res.send("Da xoa thanh cong");
        }
    } catch (e) {
        res.status(500).send(e)
    }
}

export const hello = async(req, res) => {
    const {hello, worls} = req.body
    try {
        res.send([hello, worls])
    } catch (e) {
        res.status(500).send(e)
    }
}

export const addHoaDon = async(req, res) => {
    const {madh, manv} = req.body
    const donhang = await Order.findOne({madh:madh}) 
    const products = donhang.products
    const khachhang = await KhachHang.findOne({makh:donhang.makh})
    // const diachigiaohang = khachhang?.diachinhanhang[0]?.diachi

    // Lấy ngày giờ: lúc thêm hóa đơn
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    let newMAHD = ""
    const lastMAHD = ((await HoaDon.find({})).slice(-1))[0].mahd;
    // console.log(lastMAHD, " ", parseInt(lastMAHD.slice(2)))
    if(lastMAHD.length > 0) {
        const numberHD = parseInt(lastMAHD.slice(2)) + 1;
        // console.log(numberHD," ", typeof numberHD)
        if(numberHD < 10)
            newMAHD = "HD0" + numberHD.toString();
        else
            newMAHD = "HD" + numberHD.toString();
    }
    // console.log(newMAHD)
    const hoadonData = {
        mahd: newMAHD || "HD01",
        makh: donhang.makh,
        manv: manv,
        ngayxuathd: formattedDate,
        trigia: donhang.tongtrigia,
        diachigiaohang: donhang.address,
    }
    try {
        const hoadon = new HoaDon(hoadonData)
        await hoadon.save()
        // console.log(hoadonData.mahd)
        // console.log(ngayxuathd)
        // console.log(khachhang)
        // console.log(nhanvien)
        // console.log(products)

        let sendmail = await invoiceEmail(hoadonData.mahd, hoadonData.ngayxuathd, khachhang, products, donhang.tongtrigia, donhang.address);
        res.send(hoadon)
    } catch(e){
        res.status(500).send("Lỗi" + e.message)
    }
}

export const updateHoaDon = async(req, res) => {
    const updates=Object.keys(req.body)
    const allowUpdates=["makh","manv","tinhtrang","ngayxuathd","trigia","diachigiaohang","phuongthucthanhtoan"]
    const isValidOperation=updates.every((update)=>{
        return allowUpdates.includes(update)
    }) 
    if(!isValidOperation) {
        return res.status(400).send("error: Invalid updates!")
    }

    // Lấy ngày giờ: lúc thêm hóa đơn
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    req.body.ngayxuathd = formattedDate
    try {
        // console.log(req.body)
        const hoadon = await HoaDon.findByIdAndUpdate({_id: req.params.id},req.body,{ new: true })
        if(!hoadon){
            return res.status(404).send('Not found!')
        }
        else {
            res.json(hoadon)
            // console.log(hoadon)
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

import Products from "../models/product.js";
export const getProductsByName = async (req, res) => {
    try {
        const limit = parseInt(req.query.pageSize) || 100;
        const skip = (parseInt(req.query.page) - 1) * limit || 0;
        let filter = {}
        if (req.query.ten) {
            filter.tensanpham = { $regex: ten, $options: 'i' }
        }
        // if (req.query.phanloai) {
        //     filter.phanloai = req.query.phanloai;
        // }
        const listProducts = await Products.find(filter).skip(skip).limit(limit);
        const totalProducts = (await Products.find(filter)).length;
        const totalPages = Math.ceil(totalProducts/limit);

        res.send({ totalProducts, listProducts, totalPages })

    } catch (error) {
        res.status(500).send(error)
    }
}