import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import {  createInsertSchema, createSelectSchema  } from 'drizzle-zod'

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255}).notNull().unique(),
    username: varchar('username', {length: 255}).notNull().unique(),
    password: varchar('password', {length: 255}).notNull(),
    firstName: varchar('first_name', {length: 255}),
    lastName: varchar('last_name', {length: 255}),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const notes = pgTable('notes', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
    title: varchar('name', { length: 100 }),
    details: text('description').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),

})

export const userRelations = relations(users, ({many}) => ({
    notes: many(notes),
}))


export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Note = typeof notes.$inferSelect
export type NewNote = typeof notes.$inferInsert

export const insertNoteSchema = createInsertSchema(notes)
export const selectNoteSchema = createSelectSchema(notes)
export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)
