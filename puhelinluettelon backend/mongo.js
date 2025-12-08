const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://alisa:${password}@cluster0.ghjo3ge.mongodb.net/contactApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url, { family: 4 });

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv[3] && process.argv[4]) {
  const newContact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  });
  newContact.save().then((result) => {
    console.log(
      `added ${newContact.name} number ${newContact.number} to phonebook`
    );
    mongoose.connection.close();
  });
} else {
  Contact.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((contact) => {
      console.log(contact.name, contact.number);
    });
    mongoose.connection.close();
  });
}

/* const testContact = new Contact({
  name: "Jonne Jäpätin",
  number: 358403698282,
});

testContact.save().then((result) => {
  console.log("Contact saved!");
  mongoose.connection.close();
}); */
