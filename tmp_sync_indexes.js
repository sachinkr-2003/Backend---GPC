require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function syncDBIndexes() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/property_check');
        console.log('Connected to DB');

        // Remove all secondary indexes from Users
        await User.collection.dropIndexes();
        console.log('Dropped all secondary indexes');

        // Resync indexes based on current schema
        await User.syncIndexes();
        console.log('Successfully recreated indexes according to schema');

        const newIndexes = await User.collection.getIndexes();
        for (let [name, val] of Object.entries(newIndexes)) {
            console.log(name, JSON.stringify(val));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

syncDBIndexes();
