import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDogById } from "./apiManager";
import "./DogDetails.css";

export default function DogDetails() {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDogById(id)
      .then(setDog)
      .catch(() => {
        console.log("Failed to fetch dog details");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!dog) return <div className="error">Dog not found</div>;

  return (
    <div className="dog-details-container">
      <Link to="/" className="back-link">← Back to Dogs</Link>
      
      <div className="dog-details-card">
        <h1 className="dog-title">{dog.name}</h1>
        
        <div className="dog-info">
          <div className="info-item">
            <span className="label">City:</span>
            <span className="value">{dog.cityName || "No city assigned"}</span>
          </div>
          
          <div className="info-item">
            <span className="label">Walker:</span>
            <span className="value">
              {dog.walkerName ? (
                <span className="has-walker">🚶 {dog.walkerName}</span>
              ) : (
                <span className="no-walker">No walker assigned</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}