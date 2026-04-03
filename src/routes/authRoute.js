import express from 'express';
import { validate } from '../validations/authValidator.js';
import authController from '../controllers/auth.controller.js';
import verifyUser from '../middleware/authMiddleware.js';
import emailLimiter from '../middleware/emailLimitMiddleware.js';


const authRoute = express.Router();

authRoute.post('/register', validate, authController.register);
authRoute.post('/resendEmail', validate, emailLimiter, authController.resendEmail);
authRoute.get('/verifyRegister', authController.verifyRegister);
authRoute.get('/getMe', verifyUser, authController.getMe);
authRoute.post('/login', validate, authController.login);

export default authRoute
