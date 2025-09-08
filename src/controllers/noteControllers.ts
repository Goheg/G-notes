import type { Request, Response } from 'express'
import type { AuthenticatedRequest } from '../middlewares/auth.ts'
import { db} from '../db/connection.ts'
import { notes } from '../db/schema.ts'
import { eq, and, desc, inArray } from 'drizzle-orm'

// GOOD
export const createNote = async (req: AuthenticatedRequest, res: Response) => {
    const {title, details} = req.body
    const userId = req.user!.id

    const result = await db.transaction(async (tx) => {
        const [newNote] = await tx
        .insert(notes)
        .values({
            userId,
            title,
            details
        })
        .returning()

        return newNote
    })

    res.status(201).json({
        message: 'Notes created successfully',
        result
    })
}

// GOOD
export const getAllUserNotes = async (req: AuthenticatedRequest, res: Response) => {
     const userId = req.user!.id
     const userNotes = await db.query.notes.findMany({
        where: eq(notes.userId, userId)
     })

     res.json({
        userNotes
     })
}


// Edit note GOOD
export const updateNote = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user!.id
        const { id } = req.params
        const { ...updates} = req.body

        const result = await db.transaction(async (tx) => {
            const [updateNote] = await tx.update(notes)
            .set({...updates, updatedAt: new Date()})
            .where(and(eq(notes.id, id), eq(notes.userId, userId)))
            .returning()

            if(!updateNote){
                throw new Error('Note not found')
            }
            return updateNote
        })

        res.status(200).json({
            message: 'Notes updated successfully',
            result
        })
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Note not found') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    
}

// Get single user note GOOD
export const getNote = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user!.id
        const { id } = req.params
        console.log(id)
        const userNote = await db.query.notes.findFirst({
            // where: and(eq(notes.id, userId), eq(notes.id, id))
            where: and(eq(notes.userId, userId), eq(notes.id, id))
        })

        // console.log(userNote)

        if (!userNote) {
            throw new Error('Note not found')
        }

        res.status(200).json({
            userNote
        }) 
    } catch (error) {
        res.status(500).json({ error })
    }
    
}
// GOOD
export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const [deletedHabit] = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning()

    if (!deletedHabit) {
      return res.status(404).json({ error: 'Note not found' })
    }

    res.json({
      message: 'Note deleted successfully',
    })
  } catch (error) {
    console.error('Delete note error:', error)
    res.status(500).json({ error: 'Failed to delete note' })
  }
}