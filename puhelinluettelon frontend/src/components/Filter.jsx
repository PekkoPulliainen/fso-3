const Filter = ({ setShowAll, showAll }) => (
  <div>
    <button onClick={() => setShowAll(!showAll)}>
      näytä vain tärkeät kontaktit: {showAll ? "ei" : "kyllä"}
    </button>
  </div>
);

export default Filter;
