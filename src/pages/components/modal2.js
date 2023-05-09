import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import CardLink from "./cardlink";
import { addSpots } from "../api/supabase";

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

function Modal2(props) {
  const [showModal, setShowModal] = useState(false);
  const [spots, setSpots] = useState([]);

  const modalRef = useRef();

  const closeModal = (event) => {
    if (event.target === modalRef.current) {
      setShowModal(false);
    }
  };

  const openModal = () =>{
    setShowModal(true);
    addSpots(props.data.name)
  }

  useEffect(() => {
    async function getSpots(){
      // const response = await fetch('https://test-flask-vercel-ten.vercel.app/api/recspots',
      const response = await fetch('http://localhost:5000/api/recspots',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: props.data.types })
      });
      const data = await response.json()
      setSpots(data);
    }
    getSpots();
  }, [props]);

  return (
    <>
      <button className="hidden xl:flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={() => openModal()}>
        Spots Similar like this
      </button>
      {showModal ? (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
          ref={modalRef}
        >
          <div className="bg-white rounded-lg p-4 ">

            <h2 className="text-lg font-semibold mb-4">Similar Spots</h2>
            {spots.map((spot)=>
              <div key={spot.id}>
                <CardImage data={spot.results[0]}/>
                <h1>{(spot.results[0].name)}</h1>
                <CardLink data={spot.results[0]}/>
              </div>
            )}

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

export default Modal2;