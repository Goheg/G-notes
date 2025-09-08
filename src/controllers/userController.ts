import type { Request, Response } from 'express'
import type { AuthenticatedRequest } from '../middlewares/auth.ts'
import { db} from '../db/connection.ts'
import { users } from '../db/schema.ts'
import { eq, and, desc, inArray } from 'drizzle-orm'
import bcrypt from 'bcrypt'


// GOOD
export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user!.id
        
        const userProfile = await db.select().from(users).where(eq(users.id, userId));

        // console.log(userNote)

        if (!userProfile) {
            throw new Error('User not found')
        }

        const {password, ...profile} = userProfile[0]

        res.status(200).json({
            profile
        }) 
    } catch (error) {
        res.status(500).json({ error })
    }
    
}


export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id
    const { email, username, firstName, lastName } = req.body

    const [updatedUser] = await db
      .update(users)
      .set({
        email,
        username,
        firstName,
        lastName,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        updatedAt: users.updatedAt,
      })

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
}

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id
    const { currentPassword, newPassword } = req.body

    // Get current user with password
    const [user] = await db.select().from(users).where(eq(users.id, userId))

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)

    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))

    res.json({
      message: 'Password changed successfully',
    })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'Failed to change password' })
  }
}