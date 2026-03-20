import express from 'express'
import { validate } from '../validations/authValidator.js';
import authController from '../controllers/auth.controller.js';
import verifyUser from '../middleware/authMiddleware.js';


const authRoute = express.Router();

authRoute.post('/register', validate, authController.register);
authRoute.get('/verifyRegister', authController.verifyRegister);
authRoute.get('/getMe', verifyUser, authController.getMe);
authRoute.post('/login', validate, authController.login);

export default authRoute
