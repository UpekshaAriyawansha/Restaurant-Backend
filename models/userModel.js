import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    phone: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    orderData: {type:Object, default:{}},
}, {minimize:false})

const userModel = mongoose.models.user || mongoose.model('user',userSchema);
export default userModel;