import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetch('http://localhost:3001/api/candidates')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setCandidates(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = () => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(order);
    setCandidates(prevCandidates =>
      [...prevCandidates].sort((a, b) =>
        order === "asc" ? a.experience - b.experience : b.experience - a.experience
      )
    );
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.skills.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <h1>Candidate List</h1>
      <input
        type="text"
        placeholder="Search by name or skills"
        value={searchTerm}
        onChange={handleSearch}
      />
      <button onClick={handleSort}>
        Sort by Experience ({sortOrder === "asc" ? "Ascending" : "Descending"})
      </button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Skills</th>
            <th>Years of Experience</th>
          </tr>
        </thead>
        <tbody>
          {filteredCandidates.map(candidate => (
            <tr key={candidate.id}>
              <td>{candidate.name}</td>
              <td>
                <div className="skill-tag-container">
                  {candidate.skills.split(', ').map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </td>
              <td>{candidate.experience}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
