const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const phoneNumberEntry = require('./models/phoneNumberEntry.js');

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
    phoneNumberEntry.find({}).then((person) => {
      response.json(person);
    })
})

app.get('/info', async (request, response) => {
    // console.log(phoneNumberEntry);

    const count = await phoneNumberEntry.countDocuments({}).then((request, response) => {
      console.log(request);

      return request;
    })

    response.send(`<p>Phonebook has info for ${ count } people</p>
                   <p> ${ new Date()} </p>`);
})

app.get('/api/persons/:id', (request, response) => {
    phoneNumberEntry.findById(request.params.id).then((person) => {
        response.json(person);
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    phoneNumberEntry.findByIdAndRemove(request.params.id)
      .then((result) => {
        response.status(204).end()
      })
      .catch((error) => next(error));
})

const generateID = () => {
  const ID = Math.floor(Math.random() * 1000000);
  return ID;
}

app.post('/api/persons', (request, response, next) => {
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


  const newPerson = new phoneNumberEntry({
    id: generateID(),
    name: body.name,
    number: body.number,
  })

  console.log(newPerson);

  phoneNumberEntry
    .exists({ name: newPerson.name})
    .then(bool => {
      if (bool) {
          response.status(403).send({ error: `A person named ${newPerson.name} is already in the PhoneBook`})
      } else {
          newPerson.save()
          .then((savedEntry) => {
            response.json(savedEntry);
          })
          .catch((error) => next(error))
        }
    })

})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  phoneNumberEntry.findByIdAndUpdate(
    request.params.id, 
    { name, number }, 
    { new: true, runValidators: true, context: 'query' })
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
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
}

app.use(errorHandler);

const PORT = 3005;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})