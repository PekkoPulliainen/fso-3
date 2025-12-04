import { useState, useEffect } from "react";
import Person from "./components/Person";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import contactService from "./services/contacts";
import Notification from "./components/Notification";

const App = (props) => {
  const [persons, setPersons] = useState(props.numbers);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [newMessage, setMessage] = useState(null);

  useEffect(() => {
    contactService.getAll().then((initialContacts) => {
      setPersons(initialContacts);
    });
  }, []);

  const addName = (event) => {
    event.preventDefault();
    if (newName == "" || newNumber == "") {
      console.log(`Invalid name/number`);
      return;
    }
    if (persons.some((person) => person.name == newName)) {
      console.log(`${newName} is already added to phonebook`);
      alert(`${newName} is already added to phonebook`);
      return;
    }
    if (persons.some((person) => person.number == newNumber)) {
      console.log(`${newNumber} is already added to phonebook`);
      alert(`${newNumber} is already added to phonebook`);
      return;
    }
    const contactObject = {
      name: newName,
      number: newNumber,
      important: Math.random() > 0.5,
    };

    contactService.create(contactObject).then((returnedContact) => {
      setMessage(`Added ${newName}`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      setPersons(persons.concat(returnedContact));
      setNewName("");
      setNewNumber("");
    });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const deletedContact = (person) => {
    if (confirm(`Delete ${person.name} ?`)) {
      setMessage(`Deleted ${person.name}`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      const id = person.id;
      console.log(`deleting contact ${id}`);
      contactService.deleteContact(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      });
    }
  };

  const contactsToShow = showAll
    ? persons
    : persons.filter((person) => person.important);

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={newMessage} />
      <Filter setShowAll={setShowAll} showAll={showAll} />
      <h3>Add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      {contactsToShow.map((person) => (
        <Person
          key={person.id}
          person={person}
          deleteContact={() => deletedContact(person)}
        />
      ))}
    </div>
  );
};

export default App;
