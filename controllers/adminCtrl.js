const doctorModel=require('../models/doctorModesl');
const userModel=require('../models/userModels');
const appointmentModel=require('../models/appointmentModel');
const updateProfileModel=require('../models/updateProfileModel');


const getAllUsersController=async (req,res)=>{
    try {

        const users=await userModel.find({isAdmin:false});
        res.status(200).send({
            success:true,
            message:'users data list',
            data:users,
        })
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'error while fetching users',
            error,
        })
    }
}

const getAllDoctorsController=async (req,res)=>{
    try {
        const doctors=await doctorModel.find({});
       
        res.status(200).send({
            success:true,
            message:'doctors data list',
            data:doctors,
        })
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'error while fetching doctors',
            error,
        })
    }
}

const changeAccountStatusController=async(req,res)=>{
    try {

        const {doctorId,status}=req.body;
        const doctor=await doctorModel.findByIdAndUpdate(doctorId,{status});
        const user=await userModel.findOne({_id:doctor.userId});
        const notification =user.notification;
        notification.push({
            type:'doctor-account-request-updated',
            message:`Your Doctor Account Request Has ${status}`,
            onClickPath:'/doctor-appointments',
        });
        user.isDoctor= status==='approved'?true:false;
        await user.save();

        res.status(201).send({
            success:true,
            message:'Account Status Updated',
            data:doctor,
        })
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'error in account status',
            error,
        })
    }
}

const handleRejectController=async(req,res)=>{
    try {

        const doctor=await doctorModel.findOne({_id:req.body._id});
        const user=await userModel.findOne({_id:doctor.userId});
        user.isDoctor=false;
        user.notification.push({
            type:'doctor-rejected',
            message:`Now Your are not a doctor in our hospital`,
            onClickPath:'/appointments',
        })
        await doctorModel.deleteOne(doctor);
        await user.save();
        await appointmentModel.deleteMany({doctorId:req.body._id});

        res.status(201).send({
            success:true,
            message:'Successfully Rejected ',
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'error in doctor account rejection',
            error,
        })
    }
}

const blockUserController=async(req,res)=>{
    try {
        await userModel.deleteOne({_id:req.body._id});
        const doctor=await doctorModel.findOne({userId:req.body._id});
        if(req.body.isDoctor===true){
            await appointmentModel.deleteMany({doctorId:doctor._id});
        }
        else{
            await appointmentModel.deleteMany({userId:req.body._id});
        }
        await doctorModel.deleteOne(doctor);

        await updateProfileModel.deleteMany({userId:req.body._id});
        res.status(201).send({
            success:true,
            message:'Successfully Rejected ',
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'error in User account rejection',
            error,
        })
    }
}

const getUpdateDoctorDetailsController=async(req,res)=>{
    try {
        
        const updateProfile= await updateProfileModel.findOne({userId:req.body.doctorId});

        res.status(201).send({
            success:true,
            message:'Successfully updated ',
            data:updateProfile,
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'error in getting update doctor account details',
            error,
        })
    }
}

const doctorUpdateDetailsRejectController=async(req,res)=>{
    try {
        
        await updateProfileModel.deleteOne({userId:req.body.doctorId});

        const user=await userModel.findOne({_id:req.body.doctorId});

        user.notification.push({
            type:'doctor-detail-update-request',
            message:`Your Account Details are not matching with original documents...`,
            onClickPath:`/doctor/profile/${req.body.doctorId}`,
        })

        await user.save();
        res.status(201).send({
            success:true,
            message:'Successfully Rejected ',
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'error in Rejecting update doctor account details',
            error,
        })
    }
}


const doctorUpdateDetailsAllowController=async(req,res)=>{
    try {
        const userId=req.body.doctorId; // doctor
    
        const updateProfile=await updateProfileModel.findOne({userId:userId});
        const doctor=await doctorModel.findOne({userId:userId});

        const user=await userModel.findOne({_id:userId});
        user.name=`${updateProfile.firstName} ${updateProfile.lastName}`;
        user.phone=updateProfile.phone;
        user.website=updateProfile.website;
        user.address=updateProfile.address;

        user.notification.push({
            type:'doctor-detail-update-request',
            message:`Your Account Details Updated..`,
            onClickPath:`/doctor/profile/${userId}`,
        })

        await user.save();

        await doctor.updateOne({
            firstName: updateProfile.firstName,
            lastName: updateProfile.lastName,
            phone: updateProfile.phone,
            website: updateProfile.website,
            address: updateProfile.address,
            specialization: updateProfile.specialization,
            feePerConsultation: updateProfile.feePerConsultation,
            experience: updateProfile.experience,
            timings: updateProfile.timings, // Ensure the array structure is valid
            email: doctor.email, // Retain existing email
            status: updateProfile.status, // Update status
        });

        

        await updateProfileModel.deleteOne(updateProfile);
        res.status(201).send({
            success:true,
            message:'Successfully Allow ',
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'error in Allow update doctor account details',
            error,
        })
    }
}



const getDoctorInfoController=async(req,res)=>{
    try {
        const doctor=await doctorModel.findOne({_id:req.body.doctorId});
        
        res.status(200).send({
            success:true,
            message:`Doctor Info fetch Successfully`,
            data:doctor,
        });

    } catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:'Error in doctor Info',
        })
    }
}

const getUserInfoController=async(req,res)=>{
    try {
        const user=await userModel.findOne({_id:req.body._id});
        
        res.status(200).send({
            success:true,
            message:`User Info fetch Successfully`,
            data:user,
        });

    } catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:'Error in user Info',
        })
    }
}

module.exports={getAllDoctorsController,getAllUsersController,changeAccountStatusController,handleRejectController,blockUserController,getUpdateDoctorDetailsController,doctorUpdateDetailsRejectController,doctorUpdateDetailsAllowController,getDoctorInfoController,getUserInfoController};