const mongoose=require('mongoose');
const appointMentSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    doctorId:{
        type:String,
        required:true,
    },
    doctorname:{
        type:String,
        required:true,
    },
    doctorphone:{
        type:Number,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    userphone:{
        type:Number,
        required:true,
    },
    doctorInfo:{
        type:String,
        required:true,
    },
    userInfo:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
        default:'pending',
    },
    time:{
        type:String,
        required:true,
    },

},{timestamps:true});

const appointmentModel=mongoose.model('appointments',appointMentSchema);

module.exports=appointmentModel;