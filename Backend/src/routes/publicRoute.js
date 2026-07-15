import express from 'express'
import { publicRouteController } from '../controllers/public.controller.js';

const publicRoute = express.Router();

publicRoute.get('*name', publicRouteController);

export default publicRoute