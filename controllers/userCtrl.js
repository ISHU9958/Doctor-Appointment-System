const userModel = require("../models/userModels");
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const doctorModel = require("../models/doctorModesl");
const appointmentModel = require("../models/appointmentModel");
const moment=require('moment');





const registerController=async (req,res)=>{
    try{
        const exisitingUser=await userModel.findOne({email:req.body.email});
        if(exisitingUser){
            res.status(200).send({message:`User Already Exist`,success:false});
        }

        const password=req.body.password;
        const salt =await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        req.body.password=hashPassword;
        
    
        let newUser = new userModel(req.body);
        await  newUser.save();

        res.status(201).send({message:`Register Successfully`,success:true});

    }catch(error){
        res.status(500).send({success:false,message:`Register Controller ${error.message}`});
    }
};

//login callback
const loginController= async(req,res)=>{
    try{
        const user=await userModel.findOne({email:req.body.email});
        if(!user){
            return res.status(200).send({message:`User not Exist`,success:false});
        }
        const isMatch=await bcrypt.compare(req.body.password,user.password);
        if(!isMatch){
            return res.status(200).send({message:`Invalid Email or Password`,success:false});
        }
        const token=jwt.sign({id:user._id,isAdmin:user.isAdmin,isDoctor:user.isDoctor},process.env.JWT_SECRET,{expiresIn:'1d'});
        res.status(200).send({message:`Login Successfully`,success:true,token});

    }catch(error){
        res.status(500).send({success:false,message:`Error in login CTRL ${error.message}`});
    }
};
const authController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        user.password=undefined;
        if (!user) {
            return res.status(200).send({ message: `User Not Found`, success: false });
        }

        return res.status(200).send({
            success: true,
            data:user,
        });
    } catch (error) {
        return res.status(500).send({ message: `Auth Error`, success: false, error });
    }
};

// apply doctr  ctrl
const applyDoctorController=async (req,res)=>{
    try {

        const [startDate, endDate] = req.body.timings; 
        const startTime = new Date(startDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        const endTime = new Date(endDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });


        const newDoctor=new doctorModel({...req.body,status:'pending',timings:[startTime,endTime]});
        await newDoctor.save();
        const adminUser=await userModel.findOne({isAdmin:true});

        const notification=adminUser.notification;
        notification.push({
            type:'apply-doctor-request',
            message:`${newDoctor.firstName} ${newDoctor.lastName} has  applied for a doctor account`,
            onClickPath:'/admin/doctors',
            data:{
                doctorId:newDoctor._id,
                name:newDoctor.firstName+" "+newDoctor.lastName,
            }
        });

        await userModel.findByIdAndUpdate(adminUser._id ,{notification});
        res.status(201).send({
            success:true,
            message:'Doctor Account Applied Successfully',
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:'Error while Applying for Doctor'
        })
    }
}

//notification ctrl
const getAllNotificationController=async(req,res)=>{
    try {
        const user=await userModel.findOne({
            _id:req.body.userId
        });

        const seennotification=user.seennotification;
        const notification=user.notification;
        seennotification.push(...notification);
        user.notification=[];
        user.seennotification=seennotification;
        const updatedUser=await user.save();
        updatedUser.password=undefined;

        res.status(200).send({
            success:true,
            message:'all notification marked as read',
            data:updatedUser,
        });
    } catch (error) {
        res.status(500).send({
            message:'Error in notification',
            success:false,
            error,
        })
    }
}

// notification delete ctrl
const deleteAllNotificationController=async(req,res)=>{
    try {
        const user=await userModel.findOne({_id:req.body.userId});
        user.seennotification=[];

        const updatedUser=await user.save();
        updatedUser.password=undefined;
        res.status(200).send({
            message:'Notification Deleted Successfully',
            success:true,
            data:updatedUser,

        })

        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'unable to delete all notification',
            error
        })
    }
}


// get ALl doc
const getAllDoctorsController=async(req,res)=>{
    try {
        const doctors=await doctorModel.find({status:'approved'});

        res.status(200).send({
            success:true,
            message:'Doctors List Fetched Successfully',
            data:doctors,
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'Error while Fetching Doctor',
            error
        })
    }
}


//book appointment
const bookAppointmentController=async(req,res)=>{
    try {
    
        req.body.date=moment(req.body.date,'DD-MM-YYYY').toISOString();

        req.body.time=moment(req.body.time,'HH:mm').toISOString();

        req.body.status="pending";
        const doctor=await doctorModel.findOne({_id:req.body.doctorId});
        req.body.doctorname=`${doctor.firstName} ${doctor.lastName}`;
        req.body.doctorphone=doctor.phone;
        
        const userfind=await userModel.findOne({_id:req.body.userId});
        req.body.username=userfind.name;
        req.body.userphone=userfind.phone;
        const newAppointment=new appointmentModel(req.body);
        await newAppointment.save();


        const user=await userModel.findOne({_id:req.body.doctorInfo.userId});
        user.notification.push({
            type:'New-appointment-request',
            message:`A new Appointment Request from ${req.body.userInfo.name}`,
            onClickPath:'/doctor-appointments'
        })
        await user.save();
        res.status(200).send({
            success:true,
            message:'Appintment Book successfully'
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'Error while Booking Appoinment',
            error
        })
    }
}

//booking availability
const bookingAvailabilityController=async(req,res)=>{
    try {
        const date=moment(req.body.date,'DD-MM-YY').toISOString();
        const fromTime=moment(req.body.time,'HH:mm').subtract(1,'hours').toISOString();
        const toTime=moment(req.body.time,'HH:mm').add(1,'hours').toISOString();
        const doctorId=req.body.doctorId;
        const appointments=await appointmentModel.find({doctorId,date,time:{
            $gte:fromTime,$lte:toTime
        }});

    

        if(appointments.length>0){
            return res.status(200).send({
                message:`Appointments not Available at this time`,
                success:true,
            })
        }else{
            return res.status(200).send({
                success:true,
                message:`Appointment Available`,
                

            })
        }


    } catch (error) {
        res.status(500).send({
            success:false,
            message:'Error while Booking availability',
            error
        })
    }
}


const useAppointmentsController=async(req,res)=>{
    try {
        const appointments=await appointmentModel.find({userId:req.body.userId});
        
        res.status(200).send({
            success:true,
            message:`users Appoinments Fetch SuccessFully`,
            data:appointments,
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'Error in user Appointments',
            error
        })
    }
}


const applyDoctorPageController=async(req,res)=>{
    try {
        
        res.status(200).send({
            success:true,
            message:`Ok to open Apply Page`,
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'Error in Apply Page',
            error
        })
    }
}



module.exports={loginController,registerController,authController,applyDoctorController,getAllNotificationController,deleteAllNotificationController,getAllDoctorsController,bookAppointmentController,bookingAvailabilityController,useAppointmentsController,applyDoctorPageController};