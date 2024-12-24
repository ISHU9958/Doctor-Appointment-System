const mongoose=require('mongoose');
const colors=require('colors');
const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log(`mongoDB connected ${mongoose.connection.host}`.bgGreen.white);
    }catch(error){
        console.log(`mongoDB server Issue ${error}`.bgRed.white);
    }
}
module.exports=connectDB;