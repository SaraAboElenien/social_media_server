import mongoose from "mongoose";

export const connection = () => {
    mongoose.set('strictQuery', true);
    const mongoURI = process.env.MONGODB_URI || process.env.DB_URL_ONLINE;
    
    if (!mongoURI) {
        console.error('MongoDB connection string not found. Please set MONGODB_URI or DB_URL_ONLINE environment variable.');
        return;
    }
    
    mongoose.connect(mongoURI)
        .then(() => {
            console.log(`Connected to MongoDB successfully`);
        })
        .catch((err) => {
            console.log('Failed to Connect to MongoDB:', err);
        });
}
  