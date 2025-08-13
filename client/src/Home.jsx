import { getAllDogs } from "./apiManager";
import { useEffect, useState } from "react";

export default function Home() {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    getAllDogs()
      .then(setDogs)
      .catch(() => {
        console.log("Failed to fetch dogs");
      });
  }, []);

  return (
    <div className="home-container">
      <h1 className="page-title">All Dogs:</h1>
      {dogs.length == 0 ? (
        <p className="no-dogs">No Dogs Found</p>
      ): (
        <div className="dogs-grid">
          {dogs.map(dog => (
            <div key={dog.id} className="dog-card">
              <h3 className="dog-name">{dog.name}</h3>
              <div className="dog-details">
              {dog.cityName && (
                <span className="dog-city"> City: {dog.cityName}</span>
              )}              
              {dog.walkerName ? (
                 <span className="dog-walker"> Walker: {dog.walkerName}</span>
              ) : (
                <span className="no-walker"> No walker assigned.</span>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
