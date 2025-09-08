import { Router } from 'express'
import { register, login } from '../controllers/authController.ts'
import { validationBody } from '../middlewares/validation.ts'
import { insertUserSchema } from '../db/schema.ts'
import z from 'zod'


const router = Router()

const loginSchema = z.object({
    email: z.string(),
    password: z.string()
})


router.post('/register', validationBody(insertUserSchema), register)

router.post('/signin', validationBody(loginSchema), login)

export default router