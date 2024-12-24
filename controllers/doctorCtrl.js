const doctorModel=require('../models/doctorModesl');
const appointmentModel=require('../models/appointmentModel');
const userModel = require('../models/userModels');
const updateProfileModel = require('../models/updateProfileModel');
const getDoctorInfoController=async(req,res)=>{
    try {

        const doctor=await doctorModel.findOne({userId:req.body.userId});
        res.status(200).send({
            success:true,
            message:"doctor data fetch success",
            data:doctor,
        });
        
    } catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:'Error in Fetching Doctor Details'
        })
    }
}

const updateProfileController=async(req,res)=>{
    try {
        // const doctor=await doctorModel.findOneAndUpdate({userId:req.body.userId},req.body);
        
        const newProfile=new updateProfileModel(req.body);
        await newProfile.save();
        const admin=await userModel.findOne({isAdmin:true});

        admin.notification.push({
            type:'doctor-account-update-request',
            message:`${req.body.firstName} ${req.body.lastName} requested to update profile`,
            onClickPath:`/notification/${req.body.userId}`,
        })

        await admin.save();

        res.status(201).send({
            success:true,
            message:'Doctor Profile requested..',
        });
        
    } catch (error) {

        res.status(500).send({
            success:false,
            error,
            message:'Doctor Profile Update issue',
        })
    }
}

const getDoctorByIdController=async(req,res)=>{
    try {
        const doctor=await doctorModel.findOne({_id:req.body.doctorId});
 
        res.status(200).send({
            success:true,
            message:'Single Doc Info Fetched',
            data:doctor,
        })
        
    } catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:'Error in single doctor info',
        })
    }
}


const doctorAppointmentController=async(req,res)=>{
    try {
        const doctor=await doctorModel.findOne({userId:req.body.userId});
        let appointments=[];
        if(doctor){

            appointments=await appointmentModel.find({doctorId:doctor._id});
        }
        
        res.status(200).send({
            success:true,
            message:`Doctor Appointments fetch Successfully`,
            data:appointments,
        });

    } catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:'Error in doctor appointments',
        })
    }
}

const updateStatusController=async(req,res)=>{
    try {
        const {appointmentsId,status}=req.body;
        const appointments=await appointmentModel.findByIdAndUpdate(appointmentsId,{status});
        const user=await userModel.findOne({_id:appointments.userId});
        
        user.notification.push({
            type:'Status-Updated',
            message:`your appointment has been updated ${status}`,
            onClickPath:`/${user.isDoctor ? 'doctor-appointments':'appointments'}`
        })
        await user.save();

        res.status(200).send({
            success:true,
            message:`Appointments status Updated`,
        });

    } catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:'Error in Update Status',
        })
    }
}


module.exports={getDoctorInfoController,updateProfileController,getDoctorByIdController,doctorAppointmentController,updateStatusController};