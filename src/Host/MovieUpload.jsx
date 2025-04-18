import { useState } from 'react';
import axios from 'axios';

function MovieUpload() {
  const [movie, setMovie] = useState({
    name: '',
    imageUrl: '',
    rating: 'U/A',
    runtime: '',
    description: '',
    languages: [],
    basePrice: '',
    starCast: [{ name: '', role: '' }],
    crew: [{ name: '', role: '' }],
    runStartDate: '',
    runEndDate: '',
  });

  const languageOptions = ['Hindi', 'Telugu', 'Tamil', 'Malayalam', 'Kannada', 'English', 'Japanese'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  const handleLanguageChange = (e) => {
    const { value, checked } = e.target;
    setMovie({
      ...movie,
      languages: checked
        ? [...movie.languages, value]
        : movie.languages.filter((lang) => lang !== value),
    });
  };

  const handleCastChange = (index, field, value) => {
    const newCast = [...movie.starCast];
    newCast[index][field] = value;
    setMovie({ ...movie, starCast: newCast });
  };

  const handleCrewChange = (index, field, value) => {
    const newCrew = [...movie.crew];
    newCrew[index][field] = value;
    setMovie({ ...movie, crew: newCrew });
  };

  const addCastMember = () => setMovie({ ...movie, starCast: [...movie.starCast, { name: '', role: '' }] });
  const addCrewMember = () => setMovie({ ...movie, crew: [...movie.crew, { name: '', role: '' }] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/host/movie', movie);
    alert('Movie submitted for approval');
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#1a1a1a', color: '#fff', padding: '20px' }}>
      <input name="name" value={movie.name} onChange={handleChange} placeholder="Movie Name" />
      <input name="imageUrl" value={movie.imageUrl} onChange={handleChange} placeholder="Image URL" />
      <select name="rating" value={movie.rating} onChange={handleChange}>
        <option value="U">U</option>
        <option value="U/A">U/A</option>
        <option value="A+">A+</option>
      </select>
      <input name="runtime" value={movie.runtime} onChange={handleChange} placeholder="Runtime (e.g., 2h 47m)" />
      <textarea name="description" value={movie.description} onChange={handleChange} placeholder="Description" />

      <div>
        <h3>Languages</h3>
        {languageOptions.map((lang) => (
          <label key={lang}>
            <input type="checkbox" value={lang} checked={movie.languages.includes(lang)} onChange={handleLanguageChange} />
            {lang}
          </label>
        ))}
      </div>

      <div>
        <h3>Cast</h3>
        {movie.starCast.map((member, index) => (
          <div key={index}>
            <input
              value={member.name}
              onChange={(e) => handleCastChange(index, 'name', e.target.value)}
              placeholder="Name"
            />
            <input
              value={member.role}
              onChange={(e) => handleCastChange(index, 'role', e.target.value)}
              placeholder="Role (optional)"
            />
          </div>
        ))}
        <button type="button" onClick={addCastMember}>Add Cast Member</button>
      </div>

      <div>
        <h3>Crew</h3>
        {movie.crew.map((member, index) => (
          <div key={index}>
            <input
              value={member.name}
              onChange={(e) => handleCrewChange(index, 'name', e.target.value)}
              placeholder="Name"
            />
            <input
              value={member.role}
              onChange={(e) => handleCrewChange(index, 'role', e.target.value)}
              placeholder="Role (e.g., Director)"
            />
          </div>
        ))}
        <button type="button" onClick={addCrewMember}>Add Crew Member</button>
      </div>

      <input type="number" name="basePrice" value={movie.basePrice} onChange={handleChange} placeholder="Base Price" />
      <input type="date" name="runStartDate" value={movie.runStartDate} onChange={handleChange} />
      <input type="date" name="runEndDate" value={movie.runEndDate} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default MovieUpload;