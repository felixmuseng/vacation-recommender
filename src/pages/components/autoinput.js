import React, { useState } from 'react';

export default function SearchBox({ onSubmit }){
  const [cities, setCities] = useState([]);
  const [input, setInput] = useState('');
  const [params, setParams] = useState('');

  const handleCityChange = async (e) => {
    const query = e.target.value
    setInput(query);
    const res = await fetch(`https://test-flask-vercel-ten.vercel.app/api/cities?q=${query}`);
    // const res = await fetch(`http://localhost:5000/api/cities?q=${query}`);
    const data = await res.json();
    setCities(data);
  };

  const handleSelect = (city) => {
    setInput(city);
    setCities([]);
  };

  const handleParamsChange = (e) => {
    setParams(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(input, params);
    setInput("");
    setParams("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col relative">
        <span>
          <input type="text" value={input} onChange={handleCityChange} placeholder="Where are you going?" className="h-12 rounded border-gray-300 px-4 outline-none w-1/3"/>
          <input type="text" value={params} onChange={handleParamsChange} placeholder="Optional parameters(library,park)" className="h-12 rounded border-gray-300 px-4 outline-none w-1/3"/>
          <button type="submit" className="px-3 mx-5 h-12 bg-sky-500 rounded text-white">Submit</button>
        </span>
        
        <ul className="absolute top-14 left-0 right-0 bg-white rounded-b-md shadow-lg z-10">
          {cities.slice(0, 5).map((city) => (
            <li key={city} className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleSelect(city)}>
              {city}
            </li>
          ))}
        </ul>
      </div>
      

    </form>
  );
}
