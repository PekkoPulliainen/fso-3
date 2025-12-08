require("dotenv").config();
const express = require("express");
const Contact = require("./models/contact");

const app = express();

let morgan = require("morgan");

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

let contacts = [];

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist"));

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/contacts", (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts);
  });
});

app.get("/api/contacts/:id", (request, response, next) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/contacts", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(401).json({
      error: "name or number missing...",
    });
  }

  const newContact = new Contact({
    name: body.name,
    number: body.number,
  });

  if (contacts.some((contact) => contact.name === newContact.name)) {
    return response.status(402).json({
      error: "name must be unique...",
    });
  }

  newContact.save().then((savedContact) => {
    response.json(savedContact);
  });
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

app.delete("/api/contacts/:id", (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
