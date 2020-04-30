const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
     name:{
         type:String,
         required:[true,'Please add a name']
    },
    email: {
    type: String,
    unique:true,
    required:[true,'Please add an email'],
    match: [
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      'Please add a valid email address'
    ]
},
    role:{
        type:String,
        enum:['user','publisher'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please add a password'],
        minlength:6,
        select:false
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
});

//Encrypt password using bcrypt

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

//A method which works in the actual user

userSchema.methods.getSignedWebToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
}

// A method to match user password with the encrypted passsword
userSchema.methods.checkPassword = async function(user_pass){
    return await bcrypt.compare(user_pass,this.password);
}

//Generate and hash a token
userSchema.methods.getResetPasswordToken = async function(){

    //Generate the token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hash the token and set it to resetPassword token field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //Set expire
    this.resetPasswordExpire = (Date.now() + 10*60*1000);

    return resetToken;
}
module.exports = mongoose.model('user',userSchema);