import { useState, useEffect } from "react";
import { getAllWalkers, getAllCities } from "./apiManager";
import { Link } from "react-router-dom";
import "./Walkers.css";

export default function Walkers() {
  const [walkers, setWalkers] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch cities on component mount
  useEffect(() => {
    getAllCities()
      .then(setCities)
      .catch(() => {
        console.log("Failed to fetch cities");
      });
  }, []);

  // Fetch walkers whenever selectedCityId changes
  useEffect(() => {
    setLoading(true);
    const cityFilter = selectedCityId ? parseInt(selectedCityId) : null;
    
    getAllWalkers(cityFilter)
      .then(setWalkers)
      .catch(() => {
        console.log("Failed to fetch walkers");
      })
      .finally(() => setLoading(false));
  }, [selectedCityId]);

  const handleCityChange = (e) => {
    setSelectedCityId(e.target.value);
  };

  return (
    <div className="walkers-container">
      <div className="page-header">
        <h1 className="page-title">Walkers</h1>
        
        <div className="filter-section">
          <label htmlFor="cityFilter" className="filter-label">
            Filter by city:
          </label>
          <select
            id="cityFilter"
            value={selectedCityId}
            onChange={handleCityChange}
            className="city-filter"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading walkers...</div>
      ) : walkers.length === 0 ? (
        <p className="no-walkers">
          {selectedCityId ? "No walkers found in the selected city" : "No walkers found"}
        </p>
      ) : (
        <div className="walkers-grid">
          {walkers.map(walker => (
            <div key={walker.id} className="walker-card">
              <div className="walker-header">
                <h3 className="walker-name">{walker.name}</h3>
                <Link 
                  to={`/walkers/${walker.id}/assign-dog`}
                  className="add-dog-btn"
                >
                  Add Dog
                </Link>
              </div>
              <div className="walker-cities">
                <span className="cities-label">Cities:</span>
                <div className="cities-list">
                  {walker.cities && walker.cities.map((city, index) => (
                    <span key={city.id} className="city-tag">
                      {city.name}
                      {index < walker.cities.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}