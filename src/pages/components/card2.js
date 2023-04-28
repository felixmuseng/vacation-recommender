import { useEffect, useState } from "react"

export default function Card2(props){
  const [cities, setCities] = useState('')
  useEffect(() => {
    async function getClosestCities(){
      const response = await fetch('http://localhost:5000/api/closest',
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
    <div>
      <div>{JSON.stringify(cities)}</div>
      {/* <CardImage data={(props.data)}/> */}
    </div>
  )
}