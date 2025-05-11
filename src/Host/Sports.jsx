import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Sports.css';

const Sports = () => {
    const [sports, setSports] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        posterUrl: '',
        dateTime: '',
        runtime: '',
        languages: '',
        genre: '',
        location: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchSports();
    }, []);

    const fetchSports = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/sports');
            setSports(response.data);
        } catch (error) {
            console.error('Error fetching sports:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:8080/api/sports/${editId}`, formData);
            } else {
                await axios.post('http://localhost:8080/api/sports', formData);
            }
            fetchSports();
            resetForm();
            setShowForm(false);
        } catch (error) {
            if (error.response?.status === 400) {
                setErrors(error.response.data);
            } else {
                console.error('Error saving sports:', error);
            }
        }
    };

    const handleEdit = (sport) => {
        setFormData({
            title: sport.title,
            posterUrl: sport.posterUrl,
            dateTime: sport.dateTime,
            runtime: sport.runtime,
            languages: sport.languages,
            genre: sport.genre,
            location: sport.location
        });
        setIsEditing(true);
        setEditId(sport.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this sports event?')) {
            try {
                await axios.delete(`http://localhost:8080/api/sports/${id}`);
                fetchSports();
            } catch (error) {
                console.error('Error deleting sports:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            posterUrl: '',
            dateTime: '',
            runtime: '',
            languages: '',
            genre: '',
            location: ''
        });
        setIsEditing(false);
        setEditId(null);
        setErrors({});
    };

    const toggleForm = () => {
        resetForm();
        setShowForm(!showForm);
    };

    return (
        <div className="sports-container">
            <h1>Sports Management</h1>
            <button onClick={toggleForm} className="toggle-form-btn">
                {showForm ? 'Cancel' : 'Add New Sports Event'}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} className="sports-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                        />
                        {errors.title && <span className="error">{errors.title}</span>}
                    </div>
                    <div className="form-group">
                        <label>Poster URL</label>
                        <input
                            type="text"
                            name="posterUrl"
                            value={formData.posterUrl}
                            onChange={handleInputChange}
                        />
                        {errors.posterUrl && <span className="error">{errors.posterUrl}</span>}
                    </div>
                    <div className="form-group">
                        <label>Date and Time</label>
                        <input
                            type="text"
                            name="dateTime"
                            value={formData.dateTime}
                            onChange={handleInputChange}
                            placeholder="e.g., 2025-05-15 18:00"
                        />
                        {errors.dateTime && <span className="error">{errors.dateTime}</span>}
                    </div>
                    <div className="form-group">
                        <label>Runtime (minutes)</label>
                        <input
                            type="number"
                            name="runtime"
                            value={formData.runtime}
                            onChange={handleInputChange}
                        />
                        {errors.runtime && <span className="error">{errors.runtime}</span>}
                    </div>
                    <div className="form-group">
                        <label>Languages</label>
                        <input
                            type="text"
                            name="languages"
                            value={formData.languages}
                            onChange={handleInputChange}
                            placeholder="e.g., English, Spanish"
                        />
                        {errors.languages && <span className="error">{errors.languages}</span>}
                    </div>
                    <div className="form-group">
                        <label>Genre</label>
                        <input
                            type="text"
                            name="genre"
                            value={formData.genre}
                            onChange={handleInputChange}
                            placeholder="e.g., Football, Basketball"
                        />
                        {errors.genre && <span className="error">{errors.genre}</span>}
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                        />
                        {errors.location && <span className="error">{errors.location}</span>}
                    </div>
                    <button type="submit" className="submit-btn">
                        {isEditing ? 'Update' : 'Create'}
                    </button>
                </form>
            )}

            <div className="sports-list">
                <h2>Sports Events List</h2>
                {sports.length === 0 ? (
                    <p>No sports events available.</p>
                ) : (
                    sports.map((sport) => (
                        <div key={sport.id} className="sports-item">
                            <div className="sports-details">
                                {sport.posterUrl && (
                                    <img src={sport.posterUrl} alt={sport.title} className="sports-poster" />
                                )}
                                <h3>{sport.title}</h3>
                                <p>Date and Time: {sport.dateTime}</p>
                                <p>Runtime: {sport.runtime} minutes</p>
                                <p>Languages: {sport.languages}</p>
                                <p>Genre: {sport.genre}</p>
                                <p>Location: {sport.location}</p>
                            </div>
                            <div className="sports-actions">
                                <button onClick={() => handleEdit(sport)} className="edit-btn">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(sport.id)} className="delete-btn">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Sports;