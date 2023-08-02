// TODO the controllers of bookings 
const paymentServices=require("../services/payments.service");
 const Controller=async(req,res)=>{
  try{
    await paymentServices.addPayment(req,res);
  }catch(err){
    console.log(err);
    res.status(500).json({error:"Internal Server Error"});
  }
 };
 module.exports={Controller,};