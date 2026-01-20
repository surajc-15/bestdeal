import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash('123456', 10)

    const users = [
        {
            name: 'Vijay',
            email: 'ramukadam15@gmail.com',
            password,
            role: Role.BUYER,
            location: 'Bangalore, Karnataka',
            phone: '9876543210',
        },
        {
            name: 'Dev',
            email: 'maheshappa.me23@rvce.edu.in',
            password,
            role: Role.BUYER,
            location: 'Delhi',
            phone: '9876543211',
        },
    ]

    for (const u of users) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {
                name: u.name,
                password: u.password,
                role: u.role,
                location: u.location,
                phone: u.phone,
            },
            create: {
                name: u.name,
                email: u.email,
                password: u.password,
                role: u.role,
                location: u.location,
                phone: u.phone,
            },
        })
        console.log(`Upserted user: ${user.name} (${user.email})`)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
