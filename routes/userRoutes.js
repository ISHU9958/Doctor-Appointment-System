const express=require('express');
const { loginController, registerController, authController ,applyDoctorController,getAllNotificationController,deleteAllNotificationController, getAllDoctorsController,bookAppointmentController,bookingAvailabilityController,useAppointmentsController,applyDoctorPageController} = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');
const userMiddleware = require('../middlewares/userMiddleware');

//route object
const router=express.Router();

// routers
// login || post
router.post('/login',loginController);

// register || post
router.post('/register',registerController);


// Auth || POST
router.post('/getUserData',authMiddleware,authController);




// Apply doctor || post
router.post('/apply-doctor',authMiddleware,userMiddleware,applyDoctorController);


//get Notification Doctor || POST
router.post('/get-all-notification',authMiddleware,getAllNotificationController);


//delete Notification Doctor || POST
router.post('/delete-all-notification',authMiddleware,deleteAllNotificationController);

// get all doc
router.post('/getAllDoctors',authMiddleware,getAllDoctorsController);

// book appointmnet
router.post('/book-appointment',authMiddleware,bookAppointmentController);


// book availability
router.post('/booking-availability',authMiddleware,bookingAvailabilityController);

// appointment list
router.post('/user-appointments',authMiddleware,userMiddleware,useAppointmentsController);


router.post('/applyDoctorPage',authMiddleware,userMiddleware,applyDoctorPageController);

module.exports=router;