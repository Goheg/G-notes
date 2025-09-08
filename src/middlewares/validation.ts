import type { Request, Response, NextFunction  } from 'express'
import  { type ZodSchema, ZodError } from 'zod'

export const validationBody = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationData = schema.parse(req.body)
            req.body = validationData
            next()
        } catch(e) {
            if (e instanceof ZodError){
                return res.status(400).json({
                    error: 'Validation failed',
                    detail: e.issues.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                })            
            } else {
                    next()
                }
        }
    }
}

export const validationParams = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.params)
            next()
        } catch(e) {
            if (e instanceof ZodError){
                return res.status(400).json({
                    error: 'Invalid params',
                    detail: e.issues.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                })            
            } else {
                    next()
                }
        }
    }
}

export const validationQuery = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.query)
            next()
        } catch(e) {
            if (e instanceof ZodError){
                return res.status(400).json({
                    error: 'Invalid Query',
                    detail: e.issues.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                })            
            } else {
                    next()
                }
        }
    }
}