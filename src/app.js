import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import userRouter from './routes/user.route.js';
import sessionRouter from './routes/session.route.js';
import productRouter from './routes/product.route.js';
import morgan from 'morgan';
 

const app= express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


// endpoints
app.use("/api/sessions", sessionRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});


//manejo de errores
app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.use((err, req, res, next) => {
  console.error(err);
  const status= err.status || 500;
  res.status(status).json({error:err.message || "Internal Server Error"});
});

export default app;