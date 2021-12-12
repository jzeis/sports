 
import express from 'express';
const router = express.Router();
import auth from "../middleware/auth.js";
import { getSpreads } from '../controllers/spreads.js';



router.get('/:week?', auth, getSpreads);

export default router;

