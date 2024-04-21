const Razorpay=require('razorpay')
const Order=require('../models/order')

exports.purchasepremium=async(req,res)=>{
    try{
        var rzp=new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        console.log(rzp.key_id,rzp.key_secret);
        const amount = 2500;
        rzp.orders.create({amount,currency: "INR"},async (err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err))
            }
            const order_=new Order({
                orderid: order.id,
                status: 'PENDING',
                userId: req.user
            })
            await order_.save();
            return res.status(201).json({order,key_id: rzp.key_id});
        })
    } catch(err){
        console.log(err);
        res.status(403).json({message: 'Something went wrong',error: err})
    }
}

exports.updateTransactionStatus = async (req,res) =>{
    try{
        const { payment_id, order_id} = req.body;
        console.log(order_id);
        const order=await Order.findOne({ orderid: order_id});
        order.paymentId=payment_id;
        order.status='SUCCESSFUL';
        await order.save();
        req.user.ispremiumuser=true;
        await req.user.save();
        return res.status(202).json({success:true, message:"Transaction Successful"});
    }
    catch(err){
        console.log(err);
        res.status(403).json({message: 'Something went wrong', error:err})
    }
}