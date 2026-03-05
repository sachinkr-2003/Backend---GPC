const mongoose = require('mongoose');

async function fixDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/property_check');
        console.log('Connected to DB');

        const db = mongoose.connection.db;
        const collection = db.collection('users');

        try {
            await collection.dropIndex('email_1');
            console.log('Dropped email_1 index');
        } catch (e) {
            console.log('Index email_1 not found, or could not drop:', e.message);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixDB();
