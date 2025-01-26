
const {Router} = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay')
const router = Router();

router.post("/",async (req,res)=>{
    try {
    const razorpay = new Razorpay({
      key_id: process.env.MERCHANTID,
      key_secret: process.env.MERCHANTSECRET,
    });
    const options = req.body;
    console.log("imp",options);
    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).send("Error");
    }
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
})

  router.post("/verification", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body.paymentResponse;
    console.log("very imp",req.body.paymentResponse);
    console.log("id check kerra hui",razorpay_order_id);
    const sha = crypto.createHmac("sha256",process.env.MERCHANTSECRET);
    //order_id + "|" + razorpay_payment_id
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit!" });
    }
    res.json({
    msg: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    });
});

module.exports = router;