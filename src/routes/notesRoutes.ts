import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth.ts'
import { createNote, deleteNote, getAllUserNotes, getNote, updateNote } from '../controllers/noteControllers.ts'
import { validationBody, validationParams } from '../middlewares/validation.ts'
import z from 'zod'

const router = Router()

router.use(authenticateToken)

const createNoteSchema = z.object({
    title: z.string(),
    details: z.string()
})

const uuidSchema = z.object({
  id: z.string(),
})

// Get all user notes
router.get('/', getAllUserNotes)

// Get single user note
router.get('/:id', validationParams(uuidSchema), getNote)

// Create note
router.post('/', validationBody(createNoteSchema), createNote)


// Edit note 
router.patch('/:id',validationParams(uuidSchema), validationBody(createNoteSchema), updateNote)
// Delete note
router.delete('/:id',validationParams(uuidSchema), deleteNote)




export default router

