import UserRepository from '../repositories/user.repository.js';
import bcrypt from 'bcrypt';


const userRepo = new UserRepository();


//---------------get all users----------------//
export async function getUsers(req,res,next) {
    try {
        const users=await userRepo.list();
        res.json(users);
    } catch (error) {
        next(error);
    }
    
}
//---------------get user by id----------------//
export async function getUserById(req,res,next) {
    try {
        const userId=await userRepo.findById(req.params.uid);
        if(!userId){
            return res.status(404).json({error:"User not found"});
        }
        res.json(userId);
    } catch (error) {
        next(error);
    }
};

//---------------create user----------------//
export async function createUser(req,res,next) {
    try {
        const {first_name,last_name,email,age,password,cart,role}=req.body;
      
        const normEmail = email.toLowerCase().trim();
        const exists = await userRepo.findByEmail(normEmail);
        if(exists){
            return res.status(400).json({error:"Email already registered"});
        }

         const hashed = await bcrypt.hash(password, 10);

         const toCreate={
            first_name,
            last_name,
            email: normEmail,
            age,
            password: hashed,
            cart: cart || null,
            role: "user",
         }
         const created= await userRepo.createUser(toCreate);
         
            // no exponer password
            const { password: _omit, ...publicUser } =
            created?.toObject ? created.toObject() : created;

            return res.status(201).json(publicUser);
        
        
    } catch (error) {
        next(error);
        
    }
}

//---------------update user----------------//

export async function updateUser(req,res,next) {
    try {

        const {uid}=req.params;
        const update= {...req.body};
        if (update.email) {
            update.email = update.email.toLowerCase().trim();
            // si viene email, chequeo duplicado (excluyendo al propio user)
            const existing = await userRepo.findByEmail(update.email);
            if (existing && String(existing._id) !== String(uid)) {
                return res.status(400).json({ error: "Email already registered" });
        }
        }

        if (update.password) {
            update.password = await bcrypt.hash(update.password, 10);
        }

        const updated = await userRepo.updateUser(uid, update);
        if (!updated) return res.status(404).json({ error: "User not found" });

        const { password: _omit, ...publicUser } =
        updated?.toObject ? updated.toObject() : updated;

        return res.json(publicUser);
    } catch (error) {
        next(error)
    }
    
}

//---------------delete user----------------//
export async function deleteUser(req,res,next) {
    try {
        const deleted = await userRepo.deleteUser(req.params.uid);
        if (!deleted) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
}