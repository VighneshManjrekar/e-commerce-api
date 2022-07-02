const mongoose = require("mongoose")

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO)
    console.log(`DB connected -> ${conn.connection.host}`.bgCyan)
}

module.exports = connectDB