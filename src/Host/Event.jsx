import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Event.css';

const Event = () => {
    const [events, setEvents] = useState([]);
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
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:8080/api/events/${editId}`, formData);
            } else {
                await axios.post('http://localhost:8080/api/events', formData);
            }
            fetchEvents();
            resetForm();
            setShowForm(false);
        } catch (error) {
            if (error.response?.status === 400) {
                setErrors(error.response.data);
            } else {
                console.error('Error saving event:', error);
            }
        }
    };

    const handleEdit = (event) => {
        setFormData({
            title: event.title,
            posterUrl: event.posterUrl,
            dateTime: event.dateTime,
            runtime: event.runtime,
            languages: event.languages,
            genre: event.genre,
            location: event.location,
            artistName: event.artistName,
            artistPhotoUrl: event.artistPhotoUrl
        });
        setIsEditing(true);
        setEditId(event.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await axios.delete(`http://localhost:8080/api/events/${id}`);
                fetchEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
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
        <div className="event-container">
            <h1>Event Management</h1>
            <button onClick={toggleForm} className="toggle-form-btn">
                {showForm ? 'Cancel' : 'Add New Event'}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} className="event-form">
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
                            placeholder="e.g., Concert, Theater"
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

            <div className="event-list">
                <h2>Events List</h2>
                {events.length === 0 ? (
                    <p>No events available.</p>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="event-item">
                            <div className="event-details">
                                {event.posterUrl && (
                                    <img src={event.posterUrl} alt={event.title} className="event-poster" />
                                )}
                                <h3>{event.title}</h3>
                                <p>Date and Time: {event.dateTime}</p>
                                <p>Runtime: {event.runtime} minutes</p>
                                <p>Languages: {event.languages || 'N/A'}</p>
                                <p>Genre: {event.genre || 'N/A'}</p>
                                <p>Location: {event.location}</p>
                                <p>Artist: {event.artistName || 'N/A'}</p>
                                {event.artistPhotoUrl && (
                                    <img
                                        src={event.artistPhotoUrl}
                                        alt={event.artistName}
                                        className="artist-photo"
                                    />
                                )}
                            </div>
                            <div className="event-actions">
                                <button onClick={() => handleEdit(event)} className="edit-btn">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(event.id)} className="delete-btn">
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

export default Event;