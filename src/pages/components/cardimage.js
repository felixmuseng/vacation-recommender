import Image from "next/image";
import React, {useState, useEffect} from 'react';

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

export default CardImage