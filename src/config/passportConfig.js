import dotenv from 'dotenv';
import passport  from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/user.model.js";

dotenv.config();

const cookieExtractor = (req) =>
  req?.cookies?.authToken ? req.cookies.authToken : null;


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor,ExtractJwt.fromAuthHeaderAsBearerToken()]),
    secretOrKey: process.env.JWT_SECRET
    
};

passport.use("current", new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        const user = await User.findById(payload.uid).lean();
        if (!user){
            return done(null, false);
        } 
        console.log("JWT payload:", payload);
        return done(null, { uid: String(user._id), role: user.role, email: user.email });
    } catch (error) {
         return done(error,false);
    }
}));

export default passport;