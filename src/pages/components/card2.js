import Image from "next/image";
import Modal from './modal'
import React, { useEffect, useState } from "react"
import CardImage from './cardimage'

export default function Card2(props){
  const [cities, setCities] = useState([]);

  const handleCityClick = (city) => {
    props.onSubmit(city, "");
  }

  const geticon = (weather) => {
    return"https:"+weather
  }
  
  useEffect(() => {
    async function getClosestCities(){
      const response = await fetch('https://test-flask-vercel-ten.vercel.app/api/closest',
      // const response = await fetch('http://localhost:5000/api/closest',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: props.data })
      });
      const data = await response.json()
      setCities(data)
    }
    getClosestCities()
  }, [props])


  return(
    <div className="w-1/3">
      <h1 className="text-center">Cities Near {props.data}</h1>
      {cities.map((city) => (
        <div key={city.id} className="flex flex-col items-center bg-white border border-gray-200 rounded-xl shadow md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <CardImage data={(city.city)}/>
          <div className="mx-5 w-2/3 flex flex-col items-center xl:items-start">
            <h1>{(city.city)}</h1>
            <div className="w-full justify-evenly hidden xl:flex">
              <div>
                <h1>Currently</h1>
                <Image className="mx-auto" src={geticon(city.current_weather.icon)} alt="Weather" width="64" height="64"/>
              </div>
              <div>
                <h1>Tomorrow</h1>
                <Image className="mx-auto" src={geticon(city.tomorrow_weather.icon)} alt="Weather" width="64" height="64"/>
              </div>
            </div>
            <button onClick={() => handleCityClick(city.city)} className="cursor-pointer text-blue-500 ">Click to see spots in {city.city}</button>
            <Modal from={props.data} to={city.city}/>
          </div>
        </div>
      ))}
    </div>
  )
}