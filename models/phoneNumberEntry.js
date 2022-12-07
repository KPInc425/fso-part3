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
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: (v) => {
                return /^\d{2,3}-\d+/.test(v); 
            },
            message: props => `${props.value} is not a valid phone number!`
        }, 
        required: true,
    }
})

phoneEntrySchema.set('toJSON', {
    transform: ( document, returnedObject ) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Person', phoneEntrySchema);