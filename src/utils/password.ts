import bcrypt from 'bcrypt'
import { env } from '../../env.ts'

export const hashpassword = (password: string) => {
    return bcrypt.hash(password, env.BCRYPT_ROUNDS)
}

export const comparePassword = (password: string, hash: string) => {
    return bcrypt.compare(password, hash)
}