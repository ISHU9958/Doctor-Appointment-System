const express=require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleWare=require('../middlewares/adminMiddleware');
const { getAllUsersController, getAllDoctorsController,changeAccountStatusController,handleRejectController,blockUserController,getUpdateDoctorDetailsController,doctorUpdateDetailsRejectController,doctorUpdateDetailsAllowController, getDoctorInfoController,getUserInfoController} = require('../controllers/adminCtrl');

const router=express.Router();

router.get('/getAllUsers',authMiddleware,adminMiddleWare,getAllUsersController);

router.get('/getAllDoctors',authMiddleware,getAllDoctorsController);


router.post('/changeAccountStatus',authMiddleware,adminMiddleWare,changeAccountStatusController);

router.post('/handle-reject',authMiddleware,adminMiddleWare,handleRejectController);

router.post('/block-user',authMiddleware,adminMiddleWare,blockUserController);


router.post('/get-update-doctor-details',authMiddleware,adminMiddleWare,getUpdateDoctorDetailsController);

router.post('/doctor-update-details-reject',authMiddleware,adminMiddleWare,doctorUpdateDetailsRejectController);

router.post('/doctor-update-details-allow',authMiddleware,adminMiddleWare,doctorUpdateDetailsAllowController);

router.post('/doctor-info',authMiddleware,adminMiddleWare,getDoctorInfoController);

router.post('/user-info',authMiddleware,adminMiddleWare,getUserInfoController);

module.exports=router;