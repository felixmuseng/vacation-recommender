import { useState,useEffect } from "react";
export default function CardLink(props){
  const [placeUrl, setPlaceUrl] = useState('')

  useEffect(() => {
    async function fetchLink(){
      const response = await fetch('https://test-flask-vercel-ten.vercel.app/api/link',
      // const response = await fetch('http://localhost:5000/api/link',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: props.data.place_id })
      });
      const url = await response.json()
      setPlaceUrl(url);
    }
    fetchLink();
  }, [props]);

  return(
    <a href={placeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">Click here to open in maps</a>
  )
}