import KH from '../models/khachhang.js'
import jwt from 'jsonwebtoken'
import NhanVien from '../models/nhanvien.js'

export const auth=async(req,res,next)=>{
    try{
        //console.log("co vao day");
        const token=req.header('Authorization').replace('Bearer ','')
        //console.log("co vao day");
        const decode=jwt.verify(token,"ewewe23124113")
        console.log("co vao day");
        const user =await KH.findOne({_id: decode._id,'tokens.token': token})
        if(!user)
        {
            return res.status(404).send("KH not exits")
        }
        req.token=token
        req.KhachHang=user

        next()
    }catch(e){
        res.status(401).send('Error: Please authenticate!')
    }
}


export const authAD=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decode=jwt.verify(token,"ewewe23124113")
        console.log("okkkkkk");
        if(decode.role!=="ADMIN"){
            console.log(decode.role);
            return res.status(400).send("User not permission to access")
        }
        else {
            console.log("okkkkkk");
        }
        const user=await NhanVien.findOne({_id: decode._id,'tokens.token': token})
        if(!user)
        {
            return res.status(404).send("User not exits")
        }
        req.token=token
        req.KhachHang=user
        next()
    }catch(e){
        res.status(401).send('Error: Please authenticate!')
    }
}



export const authADNV=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decode=jwt.verify(token,"ewewe23124113")
        console.log("okkkkkk");
        if(decode.role!=="ADMIN"&&decode.role!=="NHANVIEN"){
            console.log(decode.role);
            return res.status(400).send("User not permission to access")
        }
        else {
            console.log("okkkkkk");
        }
        const user=await NhanVien.findOne({_id: decode._id,'tokens.token': token})
        if(!user)
        {
            return res.status(404).send("User not exits")
        }
        req.token=token
        req.KhachHang=user
        next()
    }catch(e){
        res.status(401).send('Error: Please authenticate!')
    }
}