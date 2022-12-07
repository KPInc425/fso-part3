/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const mongoose = require('mongoose');

console.log(process.argv);
console.log(process.argv.length);

// check for proper argument amount
if (process.argv.length < 3) {
  console.log('Please provide a password as an argument: node mongo.js <password>');
  console.log('...if you are trying to add an entry follow: node mongo.js <password> <name> <number>');
  process.exit(1);
} else if (process.argv.length > 3 && process.argv.length < 5) {
  console.log('Are you trying to see all entries: node mongo.js <password>')
  console.log('Are you trying to add an entry: node mongo.js <password> <name> <number>')
  process.exit(1);
} else if (process.argv.length > 5) {
  console.log('Too many arguments...');
  console.log('Proper format: node mongo.js <password> <name> <number>');
  console.log('if <name> has spaces it must be in "<name>"');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://iLGAdmin:${ password }@kp-fso.5krxr6k.mongodb.net/PhoneBookApp?retryWrites=true&w=majority`;

const phoneEntrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

const phoneNumber = mongoose.model('Person', phoneEntrySchema);

if (process.argv.length === 3) {
  mongoose
    .connect(url)
    .then((result) => {
      console.log('connected');
      phoneNumber.find({}).then((result) => {
        result.forEach(entry => {
          console.log(entry);
        })
        mongoose.connection.close();
      })
    })
} else {
  mongoose
    .connect(url)
    .then((result) => {
      console.log('connected');

      const entry = new phoneNumber({
        name: process.argv[3],
        number: process.argv[4]
      });

      return entry.save();

    })
    .then(() => {
      console.log('Phonebook Entry Saved!');
      return mongoose.connection.close();
    })
    .catch((error) => console.log(error));
}