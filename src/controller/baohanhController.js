import baohanh from '../models/baohanh.js'
import khachhang from "../models/khachhang.js"
import prodocut from "../models/productsCart.js"

export const getAllBH= async(req,res)=>{
    try{
        const listBH= await baohanh.find({});
        res.send(listBH);
    }catch(e){
        res.status(500).send(e)
    }
}

export const getBHByID = async(req,res)=>{
    const _id=req.params.id
    try{
        const bh= await baohanh.findOne({_id})
        if(!bh){
            return res.status(404).send("Not found")
        }
        res.send(bh)
    }
    catch(e){
        res.status(500).send(e)
    }
}

export const getCTBHByID = async (req, res) => {
    const _id = req.params.id;
    const ctbhId = req.params.ctbhId;
  
    try {
      const ctbh = await baohanh.findOne(
        { _id: _id, "chitietbaohanh._id": ctbhId },
        { "chitietbaohanh.$": 1 }
      );
  
      if (!ctbh) {
        return res.status(404).send("Not found");
      }
  
      res.send(ctbh.chitietbaohanh[0]);
    } catch (e) {
      res.status(500).send(e);
    }
};

export const getBHBySDT = async(req,res)=> {
    try{
        const kh = await khachhang.findOne({sdt: req.params.sdt})
        
        if(kh !== null) {
            const listBH= await baohanh.find({makh: kh.makh});
            const newData = listBH.map(item => ({
                ...item._doc,
                hoten: kh.hoten, // Thêm trường dữ liệu mới
                }));
            
            res.send(newData);
        } else {
            res.status(404).send();
        }
    }
    catch(e){
        res.status(500).send(e)
    }
}

export const getBHByMakh = async (req,res)=>{
    try{
        const limit = parseInt(req.query.pageSize) || 10;
        const skip = (parseInt(req.query.page) - 1) * limit || 0;
        const kh = await khachhang.findOne({makh: req.params.makh})
        
        if(kh !== null) {
            const listBH= await baohanh.find({makh: kh.makh}).skip(skip).limit(limit);
            const totalBH = (await baohanh.find({makh: kh.makh})).length;
            const totalPages = Math.ceil(totalBH / limit);
            res.send({totalBH, listBH, totalPages});
        } else {
            res.status(404).send();
        }
    }
    catch(e){
        res.status(500).send(e)
    }
}

export const addBH = async(req,res)=>{
    const bh= new baohanh(req.body)
    try{
        if(await (await baohanh.find({})).length!==0){
            const bhLast= await (await baohanh.find({})).splice(-1)
            const mabhLast= bhLast[0].mabh.substring(2) || "0" 
            const newmabh="BH"+ Number(Number(mabhLast)+1)
            bh.mabh=newmabh
        }
        await bh.save()
        res.status(201).send(bh)
    }catch(e){
        res.status(400).send(e)
    }
}

export const addCTBH = async(req,res)=> {
    try{
        const bh=await baohanh.findOne({_id: req.params.id})
        if(!bh) return res.status(404).send()
        //lần bảo hành gần đây nhất là lần thứ mấy?
        const lastLanthu = bh.chitietbaohanh ? bh.chitietbaohanh.reduce((max, ctbh) => Math.max(max, ctbh.lanthu), 0) : 0
        const ctbh = {
            ngbaohanh: req.body.ngbaohanh,
            lanthu: lastLanthu + 1,
            mota: req.body.mota,
            tinhtrangbaohanh: req.body.tinhtrangbaohanh,
        }
        if(!bh.chitietbaohanh) {
            bh.chitietbaohanh = []
        }
        bh.chitietbaohanh.push(ctbh)
        await bh.save()
        res.send(bh)
    }
    catch(e){
        res.status(400).send()
    } 
}

export const updateBH = async(req,res)=> {
    const updates=Object.keys(req.body)
    const allowUpdates=["makh","masp","mahd","manv","thoigian","nghethan","chitietbaohanh"]
    const isValidOperation=updates.every((update)=>{
        return allowUpdates.includes(update)
    })
    if(!isValidOperation) return res.status(400).send("error: Invalid updates!")
    
    try{
        const bh=await baohanh.findOne({_id: req.params.id})
        if(!bh) return res.status(404).send()
        
        updates.forEach((update)=>{
            bh[update]=req.body[update]
        })
        await bh.save()
        res.send(bh)
    } catch(e){
        res.status(500).send(e)  
    }
}

export const updateCTBH = async(req,res)=>{
    const ctbhId = req.params.ctbhId;
    const updates=Object.keys(req.body)
    const allowUpdates=["ngbaohanh","lanthu","mota","tinhtrangbaohanh"]
    const isValidOperation=updates.every((updates)=>{
        return allowUpdates.includes(updates)
    })
    if(!isValidOperation) return res.status(400).send("error: Invalid updates!")
    
    try{
        const bh=await baohanh.findOne({_id: req.params.id})
        if(!bh) return res.status(404).send()
        
        const ctbh = bh.chitietbaohanh.id(ctbhId);
        if (!ctbh) return res.status(404).send();
        
        updates.forEach((update)=>{
            ctbh[update]=req.body[update]
        })
        await bh.save()
        res.send(bh)
    } catch(e){
        res.status(500).send(e)  
    }
}

export const deleteBH = async(req,res)=>{
    try{
        const bh= await baohanh.findByIdAndDelete({_id: req.params.id})
        if(!bh){
            return res.status(404).send()
        }
        res.send(bh)
    }catch(e){
        res.status(500).send(e)
    }
}

export const deleteCTBH = async(req,res)=>{
    const { id, ctbhId } = req.params;
    try {
        const bh = await baohanh.findOneAndUpdate(
            { _id: id },
            { $pull: { chitietbaohanh: { _id: ctbhId } } },
            { new: true }
        );
        if (!bh)  return res.status(404).send();
        res.send(bh);
  } catch (e) {
        res.status(500).send(e);
  }
}