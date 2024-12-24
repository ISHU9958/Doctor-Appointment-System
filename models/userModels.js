const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is require']
    },
    email:{
        type:String,
        required:[true,'email is require']
    },
    phone:{
        type:Number,
        required:[true,'Number is require']
    },
    age:{
        type:Number,
        required:[true,'Age is require']
    },
    address:{
        type:String,
        required:[true,'Address is require']
    },
    password:{
        type:String,
        required:[true,'password is require']
    },
    website:{
        type:String,
        required:[false,'website is require']
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isDoctor:{
        type:Boolean,
        default:false
    },
    notification:{
        type:Array,
        default:[],
    },
    seennotification:{
        type:Array,
        default:[],
    },
});

const userModel=mongoose.model('users',userSchema);
module.exports=userModel;