const mongoose = require("mongoose");

const getConnection = async () => {
    try {
        mongoose.set("strictQuery", false);
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected ${connection.connection.host}`);
    } catch (error) {
        console.error(error);
    }
}

module.exports = getConnection;