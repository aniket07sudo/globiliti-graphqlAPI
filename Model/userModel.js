const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:['true','Please Tell Your Name']
    },
    lastName:{
        type:String
    },
    username:{
        type:String,
        require:true,
        unique:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,'Please Provide a Password'],
        minlength:8,
        select: false
    }
})

userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password,12);
    next();
})
userSchema.methods.correctPassword = async function(candidatePass,userPass) {
    return await bcrypt.compare(candidatePass,userPass)
}



const User = mongoose.model('User',userSchema);

module.exports = User;