import { Router } from 'express';
import { registerUser, loginUser, googleLoginUser, logoutUser } from '../controllers/auth.controller';
// TODO: import authentication middleware later

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLoginUser); // Dummy Google login
router.post('/logout', logoutUser); // Needs auth middleware if it's to do anything server-side

export default router;
