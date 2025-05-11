import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Concert.css';

const Concert = () => {
    const [concerts, setConcerts] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        posterUrl: '',
        dateTime: '',
        runtime: '',
        languages: '',
        genre: '',
        location: '',
        artistName: '',
        artistPhotoUrl: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchConcerts();
    }, []);

    const fetchConcerts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/concerts');
            setConcerts(response.data);
        } catch (error) {
            console.error('Error fetching concerts:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:8080/api/concerts/${editId}`, formData);
            } else {
                await axios.post('http://localhost:8080/api/concerts', formData);
            }
            fetchConcerts();
            resetForm();
            setShowForm(false);
        } catch (error) {
            if (error.response?.status === 400) {
                setErrors(error.response.data);
            } else {
                console.error('Error saving concert:', error);
            }
        }
    };

    const handleEdit = (concert) => {
        setFormData({
            title: concert.title,
            posterUrl: concert.posterUrl,
            dateTime: concert.dateTime,
            runtime: concert.runtime,
            languages: concert.languages,
            genre: concert.genre,
            location: concert.location,
            artistName: concert.artistName,
            artistPhotoUrl: concert.artistPhotoUrl
        });
        setIsEditing(true);
        setEditId(concert.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this concert?')) {
            try {
                await axios.delete(`http://localhost:8080/api/concerts/${id}`);
                fetchConcerts();
            } catch (error) {
                console.error('Error deleting concert:', error);
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
            location: '',
            artistName: '',
            artistPhotoUrl: ''
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
        <div className="concert-container">
            <h1>Concert Management</h1>
            <button onClick={toggleForm} className="toggle-form-btn">
                {showForm ? 'Cancel' : 'Add New Concert'}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} className="concert-form">
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
                            placeholder="e.g., Pop, Rock"
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
                    <div className="form-group">
                        <label>Artist Name</label>
                        <input
                            type="text"
                            name="artistName"
                            value={formData.artistName}
                            onChange={handleInputChange}
                        />
                        {errors.artistName && <span className="error">{errors.artistName}</span>}
                    </div>
                    <div className="form-group">
                        <label>Artist Photo URL</label>
                        <input
                            type="text"
                            name="artistPhotoUrl"
                            value={formData.artistPhotoUrl}
                            onChange={handleInputChange}
                        />
                        {errors.artistPhotoUrl && <span className="error">{errors.artistPhotoUrl}</span>}
                    </div>
                    <button type="submit" className="submit-btn">
                        {isEditing ? 'Update' : 'Create'}
                    </button>
                </form>
            )}

            <div className="concert-list">
                <h2>Concerts List</h2>
                {concerts.length === 0 ? (
                    <p>No concerts available.</p>
                ) : (
                    concerts.map((concert) => (
                        <div key={concert.id} className="concert-item">
                            <div className="concert-details">
                                {concert.posterUrl && (
                                    <img src={concert.posterUrl} alt={concert.title} className="concert-poster" />
                                )}
                                <h3>{concert.title}</h3>
                                <p>Date and Time: {concert.dateTime}</p>
                                <p>Runtime: {concert.runtime} minutes</p>
                                <p>Languages: {concert.languages}</p>
                                <p>Genre: {concert.genre}</p>
                                <p>Location: {concert.location}</p>
                                <p>Artist: {concert.artistName}</p>
                                {concert.artistPhotoUrl && (
                                    <img
                                        src={concert.artistPhotoUrl}
                                        alt={concert.artistName}
                                        className="artist-photo"
                                    />
                                )}
                            </div>
                            <div className="concert-actions">
                                <button onClick={() => handleEdit(concert)} className="edit-btn">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(concert.id)} className="delete-btn">
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

export default Concert;