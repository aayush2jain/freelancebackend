const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
    },
    contact: {
        type: String,
    },
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    profilepic: {
        type: String,
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
    password: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
});

UserSchema.methods.isPasswordCorrect = async function(password){
    if(password==this.password){
        // console.log("password",password,"this_password",this.password)
        return true
    }
    else{
        return false
    }
}

UserSchema.methods.generateacessToken = async function(){
    return  jwt.sign(
        {
            _id:this._id,
            email:this.email,
            name:this.fullName
        },
        process.env.ACCESSTOKEN_SECRET,
        {
            expiresIn: '30d',
        }
    )
}

UserSchema.methods.generateRefreshToken =async function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESHTOKEN_SECRET,
        {
            expiresIn: '30d',
        }
    )
}

module.exports = mongoose.model('User', UserSchema);