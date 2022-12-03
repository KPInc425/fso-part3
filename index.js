const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');

// morgan.token('personName', function (req, res) {
//   console.log(req);
//   return req.body.name;
// })
morgan.token('body', function (req, res) {
  // console.log(req, res);
  if (req.body.name){
    return JSON.stringify(req.body);

  } else {
    return "";
  }
})

app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`)); //:method :url :status :res[content-length] - :response-time ms { name: :personName, number: :number'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                   <p> ${ new Date()} </p>`);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
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

  if (persons.find(persons => persons.name === body.name)) {
    return response.json({
      error: 'There is already a person with that name in the phonebook'
    })
  }

  const newPerson = {
    id: generateID(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(newPerson);

  response.json(newPerson);

})

const PORT = 3005;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})