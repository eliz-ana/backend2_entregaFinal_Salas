import dotenv from 'dotenv';
dotenv.config();

import "./config/passportConfig.js"
import app from './app.js';
import { connectDB } from './config/dbconfig.js';




const PORT=process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
}).catch((e) => {
  console.error("❌ Error de conexión:", e);
  process.exit(1);
});