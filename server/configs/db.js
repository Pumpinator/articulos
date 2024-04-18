const mongoose = require("mongoose");
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/articulos";

const getConnection = async () => {
    try {
        mongoose.set("strictQuery", false);
        const connection = await mongoose.connect(DATABASE_URL);
        console.log(`Database connected ${connection.connection.host}`);
    } catch (error) {
        console.error(error);
    }
}

module.exports = getConnection;