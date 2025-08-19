import { getAllDogs, deleteDog } from "./apiManager";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    getAllDogs()
      .then(setDogs)
      .catch(() => {
        console.log("Failed to fetch dogs");
      });
  }, []);

  const handleDeleteDog = (dogId, dogName) => {
    if (window.confirm(`Are you sure you want to delete ${dogName}?`)) {
      deleteDog(dogId)
        .then(() => {
          // remove dog from state to update UI
          setDogs(dogs.filter(dog => dog.id !== dogId));
        })
        .catch(() => {
          alert("Failed to delete dog");
        });

    }
  }

  return (
    <div className="home-container">
      <div className="page-header">
        <h1 className="page-title">All Dogs:</h1>
        <Link to="/dogs/add" className="add-dog-btn">Add Dog</Link>
      </div>
        {dogs.length == 0 ? (
          <p className="no-dogs">No Dogs Found</p>
        ): (
          <div className="dogs-grid">
            {dogs.map(dog => (
              <div key={dog.id} className="dog-card-container"> {/* Container div */}
                <Link to={`/dogs/${dog.id}`} className="dog-name-link">
                  <div className="dog-card">
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
                </Link>
                <button
                  className="remove-dog-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDog(dog.id, dog.name);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>        
        )}
    </div>
  );
}
