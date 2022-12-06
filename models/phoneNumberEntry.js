const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connnecting to MongoDB: ', error.message);
    })

const phoneEntrySchema = new mongoose.Schema({
    name: String,
    number: String,
})

phoneEntrySchema.set('toJSON', {
    transform: ( document, returnedObject ) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Person', phoneEntrySchema);