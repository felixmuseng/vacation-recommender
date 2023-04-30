import Image from "next/image";
import React, { useEffect, useState } from "react"

function CardImage(props){
  const [photoUrl, setPhotoUrl] = useState('')

  useEffect(() => {
    async function fetchPhoto(){
      const response = await fetch('https://test-flask-vercel-ten.vercel.app/api/cityphoto',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: props.data })
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPhotoUrl(url);
    }
    fetchPhoto();
  }, [props]);

  return(
    <div className="relative w-full h-48 md:w-48">
      <Image className="object-cover w-full h-full rounded-xl" width="48" height="96" alt="" src={photoUrl} />
    </div>
  )
}

export default function Card2(props){
  const [cities, setCities] = useState([])

  
  useEffect(() => {
    async function getClosestCities(){
      const response = await fetch('https://test-flask-vercel-ten.vercel.app/api/closest',
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
    <div className="w-1/2">
      <h1 className="text-center">Cities Near {props.data}</h1>
      {cities.map((city) => (
        <div key={city.id} className="flex flex-col items-center bg-white border border-gray-200 rounded-xl shadow md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <CardImage data={(city)}/>
          <h1 className="mx-5">{(city)}</h1>
        </div>
      ))}
    </div>
  )
}