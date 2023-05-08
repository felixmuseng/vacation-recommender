import React, { useState, useRef, useEffect } from "react";
import CardImage from "./cardimage";

function Modal(props) {
  const [showModal, setShowModal] = useState(false);
  const [from] = useState(props.from);
  const [to] = useState(props.to);
  const [cities, setCities] = useState([]);
  const modalRef = useRef();

  const closeModal = (event) => {
    if (event.target === modalRef.current) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    async function getClosestCities(){
      // const response = await fetch('https://test-flask-vercel-ten.vercel.app/api/rec',
      const response = await fetch('http://localhost:5000/api/rec',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from, to })
      });
      const data = await response.json()
      setCities(data)
    }
    getClosestCities()
  }, [from, to])

  return (
    <>
      <button className="hidden xl:flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={() => setShowModal(true)}>
        Cities You can visit along the way
      </button>
      {showModal ? (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
          ref={modalRef}
        >
          <div className="bg-white rounded-lg p-4 ">

            <h2 className="text-lg font-semibold mb-4">Recommendations along the way</h2>
            {cities.map((city)=>(
              <div key={city.id}>
                <CardImage data={city}/>
                <h1>{city}</h1>
              </div>
            ))}


            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              Close Modal
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Modal;