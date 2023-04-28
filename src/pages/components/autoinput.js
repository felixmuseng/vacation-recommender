import React, { useState, useRef } from 'react';

export default function SearchBox({ onSubmit }){
  const [cities, setCities] = useState([]);
  const [input, setInput] = useState('');

  const handleChange = async (e) => {
    const query = e.target.value
    setInput(query);
    const res = await fetch(`http://localhost:5000/api/cities?q=${query}`);
    const data = await res.json();
    setCities(data);
  };

  const handleSelect = (city) => {
    setInput(city);
    setCities([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={input} onChange={handleChange} />
      <ul>
        {cities.map((city) => (
          <li key={city} onClick={() => handleSelect(city)}>
            {city}
          </li>
        ))}
      </ul>
      <button type="submit">Submit</button>
    </form>
  );
}
