import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepository from "../repositories/user.repository.js";
import { CurrentUserDTO } from "../dtos/user.dto.js";


const userRepo = new UserRepository();

// Helper para firmar el token
function signToken(user) {
    const payload={uid:user._id,role:user.role, email:user.email};
    return jwt.sign(payload,process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES_IN || "1d"})
};
// Controlador de registro 
export async function register(req,res,next){
    try {
        const {first_name,last_name,email,age,password,cart,role}=req.body;

        if(!first_name || !last_name || !email || typeof age !== "number" || !password){
            return res.status(400).json({error:"Invalid data"});

        }

        const normEmail = email.toLowerCase().trim();
        const exist = await userRepo.findByEmail(normEmail);
        if (exist) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await userRepo.createUser({
        first_name,
        last_name,
        email: normEmail,
        age,
        password: hashed,
        cart: cart || null,
        role: role || 'user', // no permitir escalar rol desde registro
        });

      


        const token=signToken(user);
        res.cookie("authToken",token,{
            httpOnly:true,
            sameSite:"lax",
            secure:  process.env.NODE_ENV === "production",
        })
        const { password: _omit, ...publicUser } = user.toObject ? user.toObject() : user;
        return res.status(201).json({ token, user: publicUser });
    } catch (error) {
        next(error);
        
    }
};
// Controlador de login
export async function login(req,res,next){
    try {
         const { email, password } = req.body;
         const normEmail = (email || "").toLowerCase().trim();
         const user = await userRepo.findByEmail(normEmail);
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const ok = bcrypt.compareSync(password || "", user.password);
        if (!ok) return res.status(401).json({ error: "Invalid credentials" });

        const token = signToken(user);
        res.cookie("authToken",token,{
                httpOnly:true,
                sameSite:"lax",
                secure:  process.env.NODE_ENV === "production",
            })
        const { password: _omit, ...publicUser } = user.toObject ? user.toObject() : user;
        return res.json({ token, user: publicUser });
    } catch (error) {
        next(error);
    }
}

// GET /api/sessions/current
export async function currentSession(req, res, next) {
  try {
    // passport-jwt "current" ya te pone el payload en req.user (uid, role, email)
    const { uid } = req.user || {};
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const user = await userRepo.findById(uid);
    if (!user) return res.status(404).json({ error: "User not found" });

    const dto = new CurrentUserDTO(user);
    return res.json({ user: dto });
  } catch (error) {
    next(error);
  }
}