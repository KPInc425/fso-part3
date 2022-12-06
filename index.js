const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const PhoneBookEntry = require('./models/phoneNumberEntry.js');

const requestLogger = (request, response, next) => {
    console.log(request);
    console.log('Method: ', request.method);
    console.log('Path: ', request.path);
    console.log('Body: ', request.body);
    console.log('---');
    next();
}

app.use(express.json());

app.use(requestLogger);
app.use(cors());
app.use(express.static('build'));


app.get('/api/persons', (request, response) => {
    PhoneBookEntry.find({}).then((person) => {
      response.json(person);
    })
})

app.get('/info', async (request, response) => {
    // console.log(PhoneBookEntry);

    const count = await PhoneBookEntry.countDocuments({}).then((request, response) => {
      console.log(request);

      return request;
    })

    response.send(`<p>Phonebook has info for ${ count } people</p>
                   <p> ${ new Date()} </p>`);
})

app.get('/api/persons/:id', (request, response) => {
    PhoneBookEntry.findById(request.params.id).then((person) => {
        response.json(person);
    })
})

app.delete('/api/persons/:id', (request, response) => {
    PhoneBookEntry.findByIdAndRemove(request.params.id)
      .then((result) => {
        response.status(204).end()
      })
      .catch((error) => next(error));
})

const generateID = () => {
  const ID = Math.floor(Math.random() * 1000000);
  return ID;
}

app.post('/api/persons', (request, response) => {
  const body = request.body;

  console.log(body);

  if (!body.name) {
    return response.status(400).json({
      error: 'Name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'Number missing'
    })
  }


  const newPerson = new PhoneBookEntry({
    id: generateID(),
    name: body.name,
    number: body.number,
  })



  newPerson.save().then((savedEntry) => {
    response.json(savedEntry);
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  const phoneNumber = {
    name: body.name,
    number: body.number,
  }

  PhoneBookEntry.findByIdAndUpdate(request.params.id, phoneNumber, { new: true })
    .then(updatedNumber => {
      response.json(updatedNumber);
    })
    .catch((error) => next(error));
}) 

const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndPoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }

    next(error);
}

app.use(errorHandler);

const PORT = 3005;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})