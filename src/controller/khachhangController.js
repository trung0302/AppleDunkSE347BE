import KH from '../models/khachhang.js'
import jwt from 'jsonwebtoken'
import fs from 'fs';
import { OAuth2Client } from 'google-auth-library'
import nodemailer from 'nodemailer'
import passport from 'passport'
import fetch from 'node-fetch'
import { Strategy as FacebookStrategy} from 'passport-facebook'
import KhachHang from '../models/khachhang.js'
import {
  cloudinaryUploadImg
} from "../utils/cloudinary.js"
const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
      user:"tibutibu39@gmail.com",
      pass:"mbgnxdpiyxigwnix"
  }
}) 

export const getMe=async(req,res)=>{
  try{
      res.send({user: req.KhachHang})
  }catch(e){
      res.status(500).send(e)
  }
}

export const findById=async(req,res)=>{
  const { id } = req.params;
    try {
      const KhachHang = await KH.findById(id);
      if(!KhachHang)
       {
        return res.status(404).send("Not found");
       }
       else{
        res.send(KhachHang);
       }
      //res.json(deletedDG);
    } catch (e) {
        res.status(500).send(e)
    }
}

export const getAllKH= async(req,res)=>{
    try{
       const limit = parseInt(req.query.pageSize) || 4;
        const skip = (parseInt(req.query.page) - 1) * limit || 0;
        let filter = {}
         if (req.query.username) {
          filter.hoten = { "$regex": '.*'+req.query.username+'.*', "$options": 'i'};
        }
        const listKH= await KH.find(filter).skip(skip).limit(limit);
        console.log(listKH);
        const totalKH = (await KH.find(filter)).length;
        const size = Math.ceil(totalKH/limit);
        res.send({size,totalKH,listKH});
    }catch(e){
        res.status(500).send(e)
    }
    
}


export const addKH=async (req,res)=>{
    const kh=new KH(req.body)
    try{
        if(await (await KH.find({})).length!==0){
            
            const KHLast= await (await KH.find({})).splice(-1)
            //console.log(KHLast);
            const maKHLast= await KHLast[0].makh.substring(2) || "0" 
            //console.log(Number(maKHLast)+1);
            //console.log(maKHLast);
            const newmaKH="KH"+ Number(Number(maKHLast)+1)
            //console.log(newmaKH);
            kh.makh=newmaKH
            //console.log(kh);
        }
        //console.log(kh);
        const token=await kh.generateAuToken()
        await kh.save()
        res.status(201).send({kh,token})
    
    } catch(e){ 
        res.status(500).send(e)
    }
}

export  const deleteKhachHang0 = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedDG = await KH.findByIdAndDelete(id);
      if(!deletedDG)
       {
        return res.status(404).send("Not found");
       }
       else{
        res.send("delete success!");
       }
      //res.json(deletedDG);
    } catch (e) {
        res.status(500).send(e)
    }
  };

export  const login = async(req,res,next)=>{
    const {email,password}=req.body;
    try{
    const findKH = await KH.findOne({email}).select("+password");
    if(findKH && await findKH.isPasswordMatched(password))
  {
    const token=await findKH.generateAuToken();
    res.send({findKH,token});
  }else{
    throw new Error('Unable to login') ;
  }
}
  
  catch(e){
    res.status(400).send({message: e.message})
  }
}

const client = new OAuth2Client('992518564488-fsipb4qe4grfde0mnoh7skp7n1qn512s.apps.googleusercontent.com')

export const googleLogin=async (req,res)=>{
  const {token}=req.body;
  try{
  const ticket = await client.verifyIdToken({
    idToken:token,
    audience:'992518564488-fsipb4qe4grfde0mnoh7skp7n1qn512s.apps.googleusercontent.com',
  })
  const {email, name} = ticket.getPayload();
  // console.log(email);
  // console.log(name);
  const kh=new KH();
  kh.hoten=name;
  kh.email=email;
  const findKH = await KH.findOne({email});
  if(findKH)
  {
    const token=await findKH.generateAuToken();
    let khachhang=new KH();
    khachhang = findKH;
    res.send({khachhang,token});
  }else{
    
  

  try{
    if(await (await KH.find({})).length!==0){
        
        const KHLast= await (await KH.find({})).splice(-1)
        //console.log(KHLast);
        const maKHLast= await KHLast[0].makh.substring(2) || "0" 
        //console.log(Number(maKHLast)+1);
        //console.log(maKHLast);
        const newmaKH="KH"+ Number(Number(maKHLast)+1)
        //console.log(newmaKH);
        kh.makh=newmaKH
        //console.log(kh);
    }
    //console.log(kh);
    const token=await kh.generateAuToken()
    let khachhang=new KH();
    await kh.save()
    khachhang = kh;
    
    res.status(201).send({khachhang,token})

} catch(e){ 
    res.status(500).send(e)
}

}
//  res.json(kh);
}
  //if canot find email -> add user 
  //else login user with email only
  catch(e){
    res.status(400).send({message: e.message})
  }
}

export const faceBookLogin=async (req,res)=>{
  const {accessToken}=req.body;
  let url=`https://graph.facebook.com/v2.7/me?access_token=${accessToken}&fields=id%2Cname%2Cpicture%2Cemail%2Cgender&locale=en_EN&method=get&pretty=0&sdk=joey&suppress_http_code=1`
  /*fetch(url,{
    method:'GET'
  })*/
  try {
    
    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();
    // console.log(data);
    const email = data.email;
    const name = data.name;
    const kh=new KH();
  kh.hoten=name;
  kh.email=email;
  // console.log(data.picture.data.url);
    const findKH = await KH.findOne({email});
  if(findKH)
  {
    // console.log("voday");
    const token=await findKH.generateAuToken();
    let khachhang=new KH();
    khachhang = findKH;
    res.send({khachhang,token});
  }else{
    
  

  try{
    if(await (await KH.find({})).length!==0){
        
        const KHLast= await (await KH.find({})).splice(-1)
        //console.log(KHLast);
        const maKHLast= await KHLast[0].makh.substring(2) || "0" 
        //console.log(Number(maKHLast)+1);
        //console.log(maKHLast);
        const newmaKH="KH"+ Number(Number(maKHLast)+1)
        //console.log(newmaKH);
        kh.makh=newmaKH
        //console.log(kh);
    }
    //console.log(kh);
    const token=await kh.generateAuToken()
    let khachhang=new KH();
    await kh.save()
    khachhang = kh;
    
    res.status(201).send({khachhang,token})

} catch(e){ 
    res.status(500).send(e)
}

}
    //res.status(200).send(ress);
  }catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
  
  }
  
  //.then(ress => ress.json())
  //.then(ress =>{
    //console.log(ress);
   



export const forgotPassword=async(req,res)=>{
  try{
      const email=req.body.email
      const user= await KH.findOne({email: email})
      if(!user){
          return res.status(404).send("Email not exists")
      }
      const token=jwt.sign({_id: user._id.toString(), name:user.name}, "ewewe23124113",{expiresIn: '20m'})
      user.verifyToken=token
      await user.save()
      /*const sendEmail=emails.resetPasswordEmail(email,token)
      if(!sendEmail){
          return res.send({
              message: `Không thể gửi mail đến ${email}`,
              err
          }).status(400)
      }*/
      const mailOptions = {
        from:"tibutibu39@gmail.com",
        to:email,
        subject:"Sending Email For password Reset",
        text:`This Link Valid For 20 MINUTES http://localhost:3000/resetpass/${user.id}/${user.verifyToken}`
      }
      transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log("error",error);
            res.status(401).json({status:401,message:"email not send"})
        }else{
            console.log("Email sent",info.response);
            res.status(201).json({status:201,message:"Email sent Succsfully"})
        }
       })

      return res.send({
          message: `Đã gửi thành công cho ${email}`
      })
  }catch(e){
      res.status(500).send(e)
  }
}

export const resetPassword=async(req,res)=>{
  try{
      const token=req.header('Authorization').replace('Bearer ','')
      const decode=jwt.verify(token,"ewewe23124113")
      if(!decode){
          throw new Error("Token is expired or wrong")
      }
      const user= await KH.findOne({_id: decode._id, verifyToken: token})
      if(!user){
          return res.status(400).send("User not exist")
      }
      user.password=req.body.password
      await user.save()
      res.status(200).send(user)
  } catch(e){
      res.status(500).send(e.message)
  }
}


export const ChangePassword=async(req,res)=>{
  try{
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;
  const user = await KH.findById(id).select("+password");
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }


  if (user.password) 
  {
    const isMatched = await user.isPasswordMatched(oldPassword);
    console.log(isMatched);
    if (!isMatched) {
      console.log(isMatched);
      return res.status(400).json({ message: 'Old password is incorrect' });
    }
  }


  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }
  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password changed successfully' });
} catch(e){
  res.status(500).send(e.message)
  }
}






passport.use(new FacebookStrategy({
  clientID: "918062536004658",
  clientSecret: "ce35503e8aa87307cffe85fedc518f57",
  callbackURL: "http://localhost:3000/",
  profileFields: ['id', 'displayName', 'email']
},
async function(accessToken, refreshToken, profile, done) 
{
  console.log(profile.name);
  done(null, profile);
}
));

// sửa thông tin khách hàng
export const updateKH = async(req, res)=>{
  const updates=Object.keys(req.body)
  const allowUpdates=["hoten","email","gioitinh","ngaysinh","sdt","diachi","cccd"]
  const isValidOperation=updates.every((update)=>{
      return allowUpdates.includes(update)
  }) 
  if(!isValidOperation) {
      return res.status(400).send("error: Invalid updates!")
  }

  try {
    // console.log(req.body)
      const khs = await KhachHang.findByIdAndUpdate({_id: req.params.id},req.body,{ new: true })
      if(!khs){
          return res.status(404).send('Not found!')
      }
      else {
        res.json(khs)
        console.log(khs)
      }
  } catch (error) {
      res.status(500).send(error)
  }

}


//func for docker
/*
export const uploadImages = async (req, res) => {
  console.log(req.files);
  const {id} = req.params;
  try{
    
  const uploader = (path) => cloudinaryUploadImg(path, "images/users");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log("meo");
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const findKH = await KH.findByIdAndUpdate(id,
      {
      image:urls.map((file)=>{return file;})
      },
      {
        new: true,
      }
    ,);
    res.json(findKH);
    } catch(error){
      
      throw new Error(error);
    }
}; */


//func for local
 
export const uploadImages = async (req, res) => {
  console.log(req.files);
  const {id} = req.params;
  try{
    
  const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log("meo");
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const findKH = await KH.findByIdAndUpdate(id,
      {
      image:urls.map((file)=>{return file;})
      },
      {
        new: true,
      }
    ,);
    res.json(findKH);
    } catch(error){
      
      throw new Error(error);
    }
};


 

export  const AddNewAdress = async (req, res) => {
  const { id } = req.params;
  const newAddress = req.body;
  KH.findOneAndUpdate(
    { _id: id },
    { $push: { diachinhanhang: newAddress } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(updatedUser);
      }
    }
  );
};


export  const DeleteAdress = async (req, res) => {
  const { id } = req.params;
  KH.findOneAndUpdate(
    { _id: req.KhachHang._id },
    { $pull: { diachinhanhang: { _id: id } } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(updatedUser);
      }
    }
  );
};

export  const UpdateAdress = async (req, res) => {
  const { id } = req.params;
  const updatedAddress = req.body;

  KH.findOneAndUpdate(
    { _id: req.KhachHang._id, "diachinhanhang._id": id },
    { $set: { "diachinhanhang.$": updatedAddress } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        res.status(500).send(err);
      } else if (!updatedUser) {
        res.status(404).send('User not found');
      } else {
        res.send(updatedUser);
      }
    }
  );
};