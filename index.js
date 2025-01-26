const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// const authrouter = require('./route/auth.js');
const userRouter = require('./routes/user.route.js');
const productRouter = require('./routes/product.route.js');
const bodyParser = require('body-parser');
const orderRouter = require('./routes/order.route.js');
const appointmentRouter = require('./routes/appointment.route.js');
const adminRouter = require('./routes/admin.route.js');
// const orderRouter = require('./route/order.route.js');
require('dotenv').config();
app.use(
	cors({
		origin: ["https://misthan-five.vercel.app","http://localhost:3000"],
		credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());

const port = process.env.PORT || 4000;
const dbUrl = process.env.DATABASE_URL;

const connectDb=async()=>{
 try{
        await mongoose.connect(`${dbUrl}`)
         app.listen(port,()=>{
          console.log(`server is running on `,port);
        })
        console.log(`Database URL: ${dbUrl}`);
    }
    catch(error)
    {
      console.log('error in db connection',error)
    }
}
connectDb();
app.get('/',(req,res)=>{
      res.status(200).json({message:"server is running"});
});
app.use('/appointment',appointmentRouter);
app.use('/user',userRouter);
app.use('/product',productRouter);
app.use('/payment',orderRouter);
app.use('/admin',adminRouter);