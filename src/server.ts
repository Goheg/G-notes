import express from 'express'
import notesRoutes from './routes/notesRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import authRoutes from './routes/authRoutes.ts'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import isTestEnv  from '../env.ts'
import { errorHandler, notFound } from './middlewares/errorHandlers.ts'

const app = express()
// app.use(cors())
app.use(helmet())
app.use(morgan('dev', {
  skip: () => isTestEnv
  }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});



app.use('/api/notes', notesRoutes)
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)


app.use(notFound)
app.use(errorHandler)

export { app }

export default app
