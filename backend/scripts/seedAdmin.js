const dotenv = require("dotenv")
dotenv.config()
const connectDB = require("../config/db")
const Admin = require("../models/Admin")

const seedAdmin = async () => {
  try {
    await connectDB()
    const existingAdmin = await Admin.findOne({ adminId: "ADM001" })

    if (existingAdmin) {
      console.log("Admin ADM001 already exists")
      process.exit(0)
    }

    await Admin.create({ adminId: "ADM001", name: "School Administrator", password: "admin123" })
    console.log("Admin created successfully")
    console.log("Admin ID: ADM001")
    process.exit(0)
  }
  catch (error) {
    console.error(`Admin seed failed: ${error.message}`)
    process.exit(1)
  }
}

seedAdmin()