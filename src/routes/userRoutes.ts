import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth.ts'
import { changePassword, getUserProfile, updateProfile } from '../controllers/userController.ts'
import { validationBody } from '../middlewares/validation.ts'
import z from 'zod'

const router = Router()
router.use(authenticateToken)

const updateProfileSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username too long')
    .optional(),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    ),
})
//Get Profile
router.get('/', getUserProfile)


// Edit Profile
router.put("/", validationBody(updateProfileSchema), updateProfile)

router.post('/change-password', validationBody(changePasswordSchema), changePassword)


export default router

