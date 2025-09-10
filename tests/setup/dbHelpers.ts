import  { db } from '../../src/db/connection.ts'
import { users, notes } from '../../src/db/schema.ts'
import { hashpassword} from '../../src/utils/password.ts'
import { generateToken } from '../../src/utils/jwt.ts'

export async function createTestUser(userData: Partial<{
    email: string
    username: string
    password: string
    firstName: string
    lastName: string
}> = {}) {
    const defaultData = {
        email: `test-${Date.now()}@example.com`,
        username: `testuser=${Date.now}-${Math.random()}`,
        password: 'TestPassword1234!',
        firstName: 'Test',
        lastName: 'User',
        ...userData
    }

    const hashedPassword = await hashpassword(defaultData.password)
    const [user] = await db
    .insert(users)
    .values({
        ...defaultData,
        password: hashedPassword
    }).returning()

    const token = await generateToken({
        id: user.id,
        email: user.email,
        username: user.username
    })

    return { user, token, rawPassword: defaultData.password}

}    

export async function createTestNote(userId: string, noteData: Partial<{
    title: string
    details: string
}> = {}) {
    const defaultData = {
        title: `Test note ${Date.now()}`,
        details: 'This is a test note',
        ...noteData
    }

    const [note] = await db
    .insert(notes)
    .values({
        ...defaultData,
        userId
    }).returning()

    return note
}

export async function cleanupDatabase(){
    await db.delete(users)
    await db.delete(notes)

}