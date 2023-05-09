import Image from "next/image";
import { useState, useEffect } from "react";
import Modal2 from "./modal2";
import CardLink from "./cardlink"

function CardImage(props){
  const [photoUrl, setPhotoUrl] = useState('')

  useEffect(() => {
    async function fetchPhoto(){
      const response = await fetch('https://test-flask-vercel-ten.vercel.app/api/photo',
      // const response = await fetch('http://localhost:5000/api/photo',
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



export default function Card(props){
  if (!props.data) return null
  return(
    <div className="flex flex-col items-center bg-white border border-gray-200 rounded-xl shadow md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      <CardImage data={(props.data)}/>
      <div className="mx-5 flex flex-col items-center xl:items-start">
        <h1>{(props.data.name)}</h1>
        <CardLink data={(props.data)}/>
        <Modal2 data = {(props.data)}/>
      </div>
    </div>
  )
}
