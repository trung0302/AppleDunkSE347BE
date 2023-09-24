import Products from "../models/product.js";
import HoaDon from "../models/hoadon.js";
// import Order from "../models/order.js";
export const GetPercentProductType = async (req,res ) => {
    try {
        const listTypeProdct = ["Iphone","Mac","Ipad","Watch","Sound"]
        const typeAndQuantity = [];
        const totalQuantity = (await Products.find()).length;
        let x = 0;
        for(let type of listTypeProdct) {
            let filter = {};
            filter.loaisanpham = {$regex: type, $options: 'i'}
            const listProducts = await Products.find(filter);
            const totalProduct = listProducts.length;
            x = x + totalProduct;
            typeAndQuantity.push({name : type , quantity : totalProduct});
        }
        
        typeAndQuantity.push({name: "Accessory", quantity: totalQuantity - x})
        res.send({typeAndQuantity, totalQuantity});

    }
    catch(error) {
        console.log(error);
    }
};
export const GetTotalRevenueByMonth = async(req,res) => {
    try {
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

        let totalRevenue = 0
        const listTotalBill = await HoaDon.find();
        for(let bill of listTotalBill) {
            totalRevenue += bill.trigia;
            console.log(bill.createdAt.getMonth())
        }
        console.log(totalRevenue);

        const monthAndRevenue = [];

        for(let month of months) {

            let revenue = 0;
            const listBills = await HoaDon.find();
            for(let bill of listBills ){
                if(bill.createdAt.getMonth() == months.indexOf(month)){
                    revenue += bill.trigia;
                }
            }
            monthAndRevenue.push({month: month, revenue: revenue});
        }
        res.send({totalRevenue, monthAndRevenue});
    }
    catch(error) {
        console.log(error);
    }
};