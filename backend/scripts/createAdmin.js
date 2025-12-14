const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../src/models/User')
require('dotenv').config()

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to database')

    const email = (process.argv[2] || 'admin@sweetshop.com').toLowerCase().trim()
    const password = process.argv[3] || 'admin123'
    const name = process.argv[4] || 'Admin User'

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log('Admin user already exists with email:', email)
        await mongoose.connection.close()
        return
      } else {
        existingUser.role = 'admin'
        await existingUser.save()
        console.log('Updated existing user to admin:', email)
        await mongoose.connection.close()
        return
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    })

    console.log('Admin user created successfully!')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('Name:', name)
    await mongoose.connection.close()
  } catch (error) {
    console.error('Error creating admin:', error)
    process.exit(1)
  }
}

createAdmin()

