import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getWalkerById, getAllCities, updateWalker } from "./apiManager";
import "./EditWalker.css";

export default function EditWalker() {
  const { id } = useParams();
  const [walkerName, setWalkerName] = useState("");
  const [allCities, setAllCities] = useState([]);
  const [selectedCityIds, setSelectedCityIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all cities and walker details
    Promise.all([
      getAllCities(),
      getWalkerById(id)
    ])
    .then(([citiesData, walkerData]) => {
      setAllCities(citiesData);
      setWalkerName(walkerData.name);
      setSelectedCityIds(walkerData.cities.map(city => city.id));
    })
    .catch(() => {
      console.log("Failed to fetch data");
    })
    .finally(() => setLoading(false));
  }, [id]);

  const handleCityChange = (cityId) => {
    setSelectedCityIds(prev => 
      prev.includes(cityId)
        ? prev.filter(id => id !== cityId)
        : [...prev, cityId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!walkerName.trim()) {
      alert("Please enter a walker name");
      return;
    }

    setSubmitting(true);

    const selectedCities = allCities.filter(city => 
      selectedCityIds.includes(city.id)
    );

    const updatedWalker = {
      id: parseInt(id),
      name: walkerName.trim(),
      cities: selectedCities
    };

    updateWalker(id, updatedWalker)
      .then(() => {
        navigate("/walkers");
      })
      .catch(() => {
        alert("Failed to update walker");
        setSubmitting(false);
      });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="edit-walker-container">
      <Link to="/walkers" className="back-link">← Back to Walkers</Link>
      
      <div className="edit-walker-card">
        <h1 className="form-title">Edit Walker</h1>
        
        <form onSubmit={handleSubmit} className="edit-walker-form">
          <div className="form-group">
            <label htmlFor="walkerName" className="form-label">Walker Name:</label>
            <input
              type="text"
              id="walkerName"
              value={walkerName}
              onChange={(e) => setWalkerName(e.target.value)}
              className="form-input"
              placeholder="Enter walker's name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cities:</label>
            <div className="cities-checkboxes">
              {allCities.map(city => (
                <label key={city.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedCityIds.includes(city.id)}
                    onChange={() => handleCityChange(city.id)}
                    className="city-checkbox"
                  />
                  {city.name}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update"}
            </button>
            <Link to="/walkers" className="cancel-btn">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
