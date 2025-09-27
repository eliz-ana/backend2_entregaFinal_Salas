import UserModel from '../models/user.model.js';

class UserDAO {
    async getAll(){
        return await UserModel.find({},'-password');
    }
    async getById(id){
        return await UserModel.findById(id,'-password');
    }
    async getByEmail(email){
        return await UserModel.findOne({email});
    }
    async create(userData){
        return await UserModel.create(userData);
    }
    async update(id, userData){
        return await UserModel.findByIdAndUpdate(id,userData,{new:true, runValidators:true,select:'-password'});
    }
    async delete(id){
        return await UserModel.findByIdAndDelete(id);
    }
}

export default UserDAO;