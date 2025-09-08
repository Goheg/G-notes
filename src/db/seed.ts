import { users, notes } from './schema.ts'
import { db } from './connection.ts'

async function seed() {
    console.log('Starting database seed...')
}

try {
    console.log('Clearing existing data...')
    await db.delete(users)
    await db.delete(notes)
 
    console.log('Creating demo users...')
    const [demoUser] = await db.insert(users).values({
        email: 'demo@app.com',
        username: 'demo',
        password: 'password123',
        firstName: 'Demo',
        lastName: 'User'
    }).returning()



    await db.insert(notes).values({
        userId: demoUser.id,
        title: 'My Today',
        details:'My today was fun'
    })

    
    console.log('✅ Database seeded successfully!')
    console.log('\n📊 Seed Summary:')
    console.log('\n🔑 Login Credentials:')
    console.log(`Email: ${demoUser.email}`)
    console.log(`Password:${demoUser.password}`)
} catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export default seed