import express from 'express'
import { validate } from '../validations/authValidator.js';
import authController from '../controllers/auth.controller.js';


const authRoute = express.Router();

authRoute.post('/register', validate, authController.register);
authRoute.get('/verifyRegister', authController.verifyRegister);

export default authRoute
