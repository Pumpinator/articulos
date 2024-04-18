const mongoose = require("mongoose");

const getConnection = async () => {
    try {
        mongoose.set("strictQuery", false);
        const connection = await mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/articulos");
        console.log(`Database connected ${connection.connection.host}`);
    } catch (error) {
        console.error(error);
    }
}

module.exports = getConnection;