import { db } from '../../src/db/connection.ts'
import {users, notes} from '../../src/db/schema.ts'
import { sql } from 'drizzle-orm'
import { execSync } from 'child_process'


export default async function setup() {
    console.log('Setting up test database...')

try {
    await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE` )
    await db.execute(sql`DROP TABLE IF EXISTS ${notes} CASCADE` )

    console.log('Pushing schema using drizzle-kit')
    execSync(
        `npx drizzle-kit push --url="${process.env.DATABASE_URL}" --schema="./src/db/schema.ts" --dialect="postgresql"`,
        {
            stdio: 'inherit',
            cwd: process.cwd(),
        }
    )

    console.log('Test database setup complete')
}   catch(error) {
    console.error('Failed to setup test database:', error)
    throw error
}

return async () => {
    console.log('Tearing down database...')
    try {
        await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE` )
        await db.execute(sql`DROP TABLE IF EXISTS ${notes} CASCADE` )

        console.log('Test database teardown complete')
        process.exit(0)
    } catch (error) {
        console.error('Failed to teardown test database:', error)
    }
}



}
