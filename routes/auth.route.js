import express from 'express'

import { logoutUser } from '../controllers/auth.controller.js';

const router = express.Router()

router.post("/user-logout", logoutUser);

export default router