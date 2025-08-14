import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAvailableDogsForWalker, assignWalkerToDog } from './apiManager';
import './AssignDog.css';


export default function AssignDog() {
    const { walkerId } = useParams();
    const [availableDogs, setAvailableDogs] = useState([]);
    const [walkerName, setWalkerName] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getAvailableDogsForWalker(walkerId)
            .then((dogs) => {
                setAvailableDogs(dogs);
                setWalkerName(`Walker ${walkerId}`);
            })
            .catch(() => {
                console.log("Failed to fetch available dogs");
            })
            .finally(() => setLoading(false));
    }, [walkerId]);

    const handleAssignDog = (dogId) => {
        assignWalkerToDog(dogId, parseInt(walkerId))
            .then((updatedDog) => {
                navigate(`/dogs/${updatedDog.id}`);
            })
            .catch(() => {
                alert("Failed to assign walker to dog");
            });
    };

    if (loading) return <div className="loading">Loading available dogs...</div>

    return (
        <div className="assign-dog-container">
            <Link to="/walkers" className="back-link">← Back to Walkers</Link>
            <div className="assign-dog-content">
                <h1 className="page-title">Assign dog to {walkerName}</h1>

                {availableDogs.length == 0 ? (
                    <div className="no-dogs">
                        <p>No dogs available for this walker.</p>
                        <p>Dogs must be in the walker's cities and not already assigned to this walker</p>
                    </div>
                ) : (
                    <div className="dogs-grid">
                        {availableDogs.map(dog => (
                            <div
                                key={dog.id}
                                className="assignable-dog-card"
                                onClick={() => handleAssignDog(dog.id)}
                            >
                                <h3 className="dog-name">{dog.name}</h3>
                                <div className="dog-info">
                                    <span className="dog-city">{dog.cityName}</span>
                                    {dog.walkerName ? (
                                        <span className="current-walker">Currently: {dog.walkerName}</span>
                                    ) : (
                                        <span className="no-walker">No current walker</span>
                                    )}
                                </div>
                                <div className="assign-hint">Click to assign</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
