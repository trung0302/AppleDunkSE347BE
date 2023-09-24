import NhanVien from '../models/nhanvien.js';
import jwt from 'jsonwebtoken'

export const getAllNV= async(req,res)=>{
    try{
      
        const listNV= await NhanVien.find({});
        res.send(listNV);
    }catch(e){
        res.status(500).send(e)
    }
    
}

export const addNV=async (req,res)=>{
    const nhanvien=new NhanVien(req.body)
    try{
        if(await (await NhanVien.find({})).length!==0){
            
            const KHLast= await (await NhanVien.find({})).splice(-1)
            const maKHLast= await KHLast[0].manv.substring(2) || "0" 
            const newmaKH="NV"+ Number(Number(maKHLast)+1)
            nhanvien.manv=newmaKH
        }
        await nhanvien.save()
        res.status(201).send({nhanvien})
    
    } catch(e){ 
        res.status(500).send(e)
    }
}


export  const login = async(req,res,next)=>{
    const {email,password}=req.body;
    try{
    const nhanvien = await NhanVien.findOne({email}).select("+password");
    if(nhanvien && await nhanvien.isPasswordMatched(password))
  {
    const token=await nhanvien.generateAuToken();
    res.send({nhanvien,token});
  }else{
    throw new Error('Unable to login') ;
  }
}
  
  catch(e){
    res.status(400).send({message: e.message})
  }
}

// sửa thông tin nhân viên
export const updateNhanVien = async(req, res)=>{
  const updates=Object.keys(req.body)
  const allowUpdates=["hoten","email","gioitinh","ngaysinh","sdt","diachi","cccd", "role"]
  const isValidOperation=updates.every((update)=>{
      return allowUpdates.includes(update)
  }) 
  if(!isValidOperation) {
      return res.status(400).send("error: Invalid updates!")
  }

  try {
    // console.log(req.body)
      const updateNV = await NhanVien.findByIdAndUpdate({_id: req.params.id},req.body)
      if(!updateNV){
          return res.status(404).send('Not found!')
      }
      else {
        res.json(updateNV)
        console.log(updateNV)
      }
  } catch (error) {
      res.status(500).send(error)
  }

}

// Xóa nhân viên
export  const deleteNhanVien = async (req, res) => {
  try {
    const deletedNV = await NhanVien.findByIdAndDelete({_id:req.params.id});
    if(!deletedNV)
     {
      return res.status(404).send("Not found");
     }
     else{
      res.send("delete success!");
     }
  } catch (e) {
      res.status(500).send(e)
  }
};

export const findById=async(req,res)=>{
  const { id } = req.params;
    try {
      const NV = await NhanVien.findById(id);
      if(!NV)
       {
        return res.status(404).send("Not found");
       }
       else{
        res.send(NV);
       }
      //res.json(deletedDG);
    } catch (e) {
        res.status(500).send(e)
    }
}