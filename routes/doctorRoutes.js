const express=require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const doctorMiddleware = require('../middlewares/doctorMiddleware');
const doctorUserMiddleware = require('../middlewares/doctorUserMiddleware');

const { getDoctorInfoController, updateProfileController,getDoctorByIdController,doctorAppointmentController,updateStatusController} = require('../controllers/doctorCtrl');

const router=express.Router();


router.post('/getDoctorInfo',authMiddleware,doctorMiddleware,getDoctorInfoController);

router.post('/updateProfile',authMiddleware,doctorMiddleware,updateProfileController);

router.post('/getDoctorById',authMiddleware,doctorUserMiddleware,getDoctorByIdController);


router.post('/doctor-appointments',authMiddleware,doctorMiddleware,doctorAppointmentController);

router.post('/update-status',authMiddleware,doctorMiddleware,updateStatusController);


module.exports=router;