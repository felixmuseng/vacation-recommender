import Image from "next/image";
import { useState, useEffect } from "react";

function CardImage(props){
  const [photoUrl, setPhotoUrl] = useState('')

  useEffect(() => {
    async function fetchPhoto(){
      const response = await fetch('http://localhost:5000/api/photo',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: props.data })
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      console.log(url)
      setPhotoUrl(url);
    }
    fetchPhoto();
  }, [props]);

  return(
    <>
      {photoUrl && <Image width="400" height="400" alt="" src={photoUrl} />}
    </>
  )
}

export default function Card(props){
  return(
    <div>
      <div>{(props.data.name)}</div>
      <CardImage data={(props.data)}/>
    </div>
  )
}
