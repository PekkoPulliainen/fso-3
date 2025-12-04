const Person = ({ person, deleteContact }) => (
  <div>
    <li>
      {person.name + " " + person.number}{" "}
      <button onClick={deleteContact}>delete</button>
    </li>
  </div>
);

export default Person;
