const mongoose =require("mongoose");

const shcm=mongoose.Schema({
    UserName:{
        type:String,
        required:true,
        unique:true
    },
    firstname:{
        type:String
    },
    lastName:{
        type:String
    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    dob:{
        type:Date
    },
    password:{
        type:String,
        required:true
    },
    profilepic:{
        type:String,
    }
})

const mod=mongoose.model("userDetails",shcm);
module.exports=mod;