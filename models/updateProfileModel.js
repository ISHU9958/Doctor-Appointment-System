const mongoose=require('mongoose');
const updateProfileSchema=new mongoose.Schema({
    userId:{
        type:String,
    },
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    phone:{
        type:String,
    },
    website:{
        type:String,
    },
    address:{
        type:String,
    },
    specialization:{
        type:String,
    },
    feePerConsultation:{
        type:Number,
    },
    experience:{
        type:Number,
    }
    ,timings:{
        type:Object,
    }


},{timestamps:true});

const updateProfileModel=mongoose.model('updatedProfiles',updateProfileSchema);

module.exports=updateProfileModel;