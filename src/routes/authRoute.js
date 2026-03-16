import express from 'express'
import { validate } from '../validations/authValidator.js';
import authController from '../controllers/auth.controller.js';


const authRoute = express.Router();

authRoute.post('/register', validate, authController.registerController);

export default authRoute
