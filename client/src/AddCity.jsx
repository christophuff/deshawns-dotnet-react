import { Container } from "reactstrap";
import { getAllCities, createCity } from "./apiManager";
import { useState, useEffect } from "react";
import "./AddCity.css";

export default function AddCity() {
    const [cityName, setCityName] = useState("");
    const [cities, setCities] = useState([]);

    useEffect(() => {
        getAllCities()
        .then(setCities)
        .catch(() => {
            console.log("Failed to fetch cities")
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!cityName.trim()) {
            alert("Please enter a city name");
            return;
        }

        createCity({ name: cityName.trim() })
        .then((newCity) => {
            setCities([...cities, newCity])
            setCityName("");
        })
        .catch(() => {
            alert("Failed to add City");
        })
    };

    return (
        <div className="city-container">
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    className="city-input"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)} 
                    placeholder="Enter city name"
                />
                <button type="submit" className="add-city-btn">Add City</button>
            </form>
            <div className="city-cards">
                <h2 className="current-cities">Current Cities:</h2>
                {cities.length === 0 ? (
                    <p>No cities found</p>
                ) : (
                    cities.map(city => (
                    <div key={city.id} className="city-card">
                        <h3 className="city-name">{city.name}</h3>
                    </div>
                    ))
                )}    
            </div>         
        </div>
    )
}
