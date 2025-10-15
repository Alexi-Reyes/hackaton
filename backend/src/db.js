import mongoose from 'mongoose';

class Database {
    constructor() {
        this.instance = null;
    }

    async connect() {
        if (this.instance) {
            return this.instance;
        }

        try {
            this.instance = await mongoose.connect(process.env.MONGODB_URI, {});
            console.log(`Connected to MongoDB: ${this.instance.connection.host}`);
            return this.instance;
        } catch (err) {
            console.error(err.message);
            process.exit(1);
        }
    }
}

export default new Database();
