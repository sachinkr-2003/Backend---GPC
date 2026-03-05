require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function fixDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/property_check');
        console.log('Connected to DB');

        const indexes = await User.collection.getIndexes();
        console.log('Current indexes:', indexes);

        try {
            await User.collection.dropIndex('email_1');
            console.log('Dropped email_1 index');
        } catch (e) {
            console.log('Index email_1 not found or error:', e.message);
        }

        console.log('Indexes after:', await User.collection.getIndexes());

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixDB();
