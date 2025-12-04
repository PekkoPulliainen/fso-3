const express = require("express");
const app = express();
let morgan = require("morgan");

let contacts = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: "1031",
    name: "Juupa Läppä",
    number: "67",
  },
];

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist"));

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/contacts", (request, response) => {
  response.json(contacts);
});

app.get("/api/contacts/:id", (request, response) => {
  const id = request.params.id;
  const contact = contacts.find((contact) => contact.id === id);

  if (contact) {
    response.json(contact);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  const contactCount = contacts.length;
  const currentTime = new Date().toLocaleString("en-GB", {
    timeZone: "Europe/Helsinki",
  });
  response.send(
    `Phonebook has info for ${contactCount} people<br>${currentTime} (Eastern European Time (EET)`
  );
});

const generateId = () => {
  return String(Math.floor(Math.random() * 9999) + 1);
};

app.post("/api/contacts", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(401).json({
      error: "name or number missing...",
    });
  }

  const newContact = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  if (contacts.some((contact) => contact.name === newContact.name)) {
    return response.status(402).json({
      error: "name must be unique...",
    });
  }

  contacts = contacts.concat(newContact);

  response.json(newContact);
});

app.delete("/api/contacts/:id", (request, response) => {
  const id = request.params.id;
  contacts = contacts.filter((contact) => contact.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
