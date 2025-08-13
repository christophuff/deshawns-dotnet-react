import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import "./AddDog.css";
import { getAllCities, createDog } from './apiManager';

export default function AddDog() {
    const [ dogName, setDogName ] = useState("");
    const [ selectedCityId, setSelectedCityId ] = useState("");
    const [ cities, setCities ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getAllCities()
            .then(setCities)
            .catch(() => {
                console.log("Failed to fetch cities");
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!dogName.trim() || !selectedCityId) {
            alert("Please fill in all fields");
            return;
        }

        setLoading(true);

        const newDogData = {
            name: dogName.trim(),
            cityId: parseInt(selectedCityId)
        };

        createDog(newDogData)
            .then((createdDog) => {
                navigate(`/dogs/${createdDog.id}`);
            })
            .catch(() => {
                alert("Failed to add dog")
                setLoading(false);
            });
    };

    return (
        <div className="add-dog-container">
            <Link to="/" className="back-link">← Back to Dogs</Link>
            <div className="add-dog-card">
                <h1 className="form-title">Add New Dog</h1>
                <form onSubmit={handleSubmit} className="add-dog-form">
                    <div className="form-group">
                        <label htmlFor="dogName" className="form-label">Dog Name:</label>
                        <input 
                            type="text"
                            id="dogName"
                            value={dogName}
                            onChange={(e) => setDogName(e.target.value)}
                            className="form-input"
                            placeholder="Enter dog's name"
                            required  
                        />    
                    </div>
                    <div className="form-group">
                        <label htmlFor="citySelect" className="form-label">City:</label>
                        <select  
                            id="citySelect"
                            value={selectedCityId}
                            onChange={(e) => setSelectedCityId(e.target.value)}
                            className="form-select"
                            required
                        >
                            <option value="">Select a city</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-actions">
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Submit"}
                        </button>
                        <Link to="/" className="cancel-btn">Cancel</Link>        
                    </div>    
                </form>    
            </div>        
        </div>
    )
}
