import express from 'express';
import { emailValidator, loginValidator, registerValidator } from '../validations/authValidator.js';
import authController from '../controllers/auth.controller.js';
import verifyUser from '../middleware/authMiddleware.js';
import emailLimiter from '../middleware/emailLimitMiddleware.js';


const authRoute = express.Router();

authRoute.post('/register', registerValidator, authController.register);
authRoute.post('/resendEmail', emailValidator, emailLimiter, authController.resendEmail);
authRoute.get('/verifyRegister', authController.verifyRegister);
authRoute.get('/getMe', verifyUser, authController.getMe);
authRoute.post('/login', loginValidator, authController.login);

export default authRoute
