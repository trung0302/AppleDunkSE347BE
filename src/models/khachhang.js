import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
const khachHangSchema= new mongoose.Schema({
    hoten:{
        type: String,
        required: true
    },
    image:{
        type: Array,
    },
    email:{
        type: String,
        unique: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    makh:{
        type: String,
        default: "KH0"
    },
    gioitinh:{
        type: String,
    },
    ngaysinh:{
        type: String,
    },
    sdt:{
        type: String,
    },
    diachi:{
        type: String,
    },
    diachinhanhang:[{
        ten:String,
        email:String,
        sdt:String,
        diachi:String,
    }],
    cccd:{
        type: String,
    },
    password: {
        type: String,
        //required: true,
        select: false,
        trim: true,
        minLength: 8,
        validate(value){
            if(value.toLowerCase().includes('password'))
            {
                throw new Error('Password can not contain "password"')
            }
        }

    },
    verifyToken:{
        type: String,
        trim: true
    }
    ,
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
},{
    timestamps: true
})

khachHangSchema.set('toJSON', {
    transform: function(doc, ret, opt) {
        delete ret['tokens']
        delete ret['password']
        delete ret['verifyToken']
        return ret
    }
})


khachHangSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    //this.makh=newKH;
    next();
  });

  khachHangSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  khachHangSchema.methods.generateAuToken= async function(){
    const user = this
    const token=jwt.sign({_id: user._id.toString(),makh:user.makh.toString()}, "ewewe23124113",{expiresIn: '30d'})
    user.tokens=user.tokens.concat({token})
await user.save()
    return token
}
const KhachHang=mongoose.model('KhachHang',khachHangSchema)
export default KhachHang 
