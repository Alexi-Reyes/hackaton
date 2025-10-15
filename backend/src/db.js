import mongoose from 'mongoose';

const connectDB = (() => {
    let instance;

    const connect = async () => {
        if (instance) return instance;

        try {
            instance = await mongoose.connect(process.env.MONGODB_URI, {});
            console.log(`Connected to MongoDB: ${instance.connection.host}`);
            return instance;
        } catch (err) {
            console.error(err.message);
            process.exit(1);
        }
    };

    return connect;
})();

export default connectDB;
