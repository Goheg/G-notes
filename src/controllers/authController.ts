import type { Response, Request} from "express"
import { db } from '../db/connection.ts'
import { users, type NewUser } from '../db/schema.ts'
import { generateToken } from '../utils/jwt.ts'
import { hashpassword, comparePassword } from '../utils/password.ts'
import { eq } from 'drizzle-orm'


export const register = async (req: Request, res: Response) => {
    try {
        const { email, username, password, firstName, lastName } = req.body
        const hashedPassword = await hashpassword(password)

        const [user] = await db.insert(users).values({
            email,
            username,
            password: hashedPassword,
            firstName,
            lastName
        
        }).returning({
            id: users.id,
            email: users.email,
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName,
            createdAt: users.createdAt
        })

        const token = await generateToken({
            id: user.id,
            email:user.email,
            username: user.username
        })
        return res.status(201).json({
            message: 'User registration successful',
            user,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            err: 'Registration failed'
        })
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    try {
        const [user] = await db.select().from(users).where(eq(users.email, email))

        if(!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            })
        }

        const isValidPassword = await comparePassword(password, user.password)

        if(!isValidPassword){
            return res.status(401).json({
                error: 'Invalid credentials'
            })
        }

        const token = await generateToken({
            id: user.id,
            email: user.email,
            username: user.username
        })

        

        res.json({
           message: 'Login Successful',
           user,
           token
        })
    } catch(e) {
        res.status(500).json({ error: 'Failed to login' })
    }
}