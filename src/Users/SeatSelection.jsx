import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SeatSelection.css';

const SeatSelection = ({ showId, user }) => {
  const [rows, setRows] = useState(10);
  const [columns, setColumns] = useState(12);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [blockedSeats, setBlockedSeats] = useState([]);
  const [deletedSeats, setDeletedSeats] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError] = useState('');
  const [screenId, setScreenId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [seatClasses, setSeatClasses] = useState([
    { name: 'RECLINER', rows: 2, price: 450, color: 'purple' },
    { name: 'FIRST CLASS', rows: 4, price: 300, color: 'blue' },
    { name: 'BALCONY', rows: 4, price: 200, color: 'teal' },
  ]);

  const [newSeatClass, setNewSeatClass] = useState({
    name: '',
    rows: 1,
    price: 100,
    color: 'emerald',
  });

  const colorOptions = [
    'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'teal',
    'orange', 'emerald', 'cyan', 'amber',
  ];

  const isHost = user && user.role === 'HOST';

  useEffect(() => {
    const totalRows = seatClasses.reduce((sum, cls) => sum + cls.rows, 0);
    setRows(totalRows);
    if (showId) {
      fetchScreenAndSeats();
    }
  }, [seatClasses, showId]);

  const fetchScreenAndSeats = async () => {
    setIsLoading(true);
    try {
      // Fetch screen details for the show
      const showRes = await axios.get(`/api/shows/${showId}`);
      const screenId = showRes.data.screen_id;
      setScreenId(screenId);

      // Fetch screen configuration
      const screenRes = await axios.get(`/api/screens/${screenId}`);
      const { columns, seat_classes } = screenRes.data;
      setColumns(columns);
      setSeatClasses(seat_classes || seatClasses);

      // Fetch seats
      const seatsRes = await axios.get(`/api/screens/${screenId}/seats`);
      const seats = seatsRes.data.map(seat => ({
        id: seat.seat_id,
        row: parseInt(seat.seat_number.match(/[A-Z]+/)[0].charCodeAt(0) - 65),
        column: parseInt(seat.seat_number.match(/\d+/)[0]) - 1,
        class: seat.class,
        price: seat.price,
        color: seatClasses.find(cls => cls.name === seat.class)?.color || 'teal',
        status: seat.status,
      }));

      setSeats(seats);
      setBlockedSeats(seats.filter(seat => seat.status === 'BLOCKED').map(seat => seat.id));
      setDeletedSeats(seats.filter(seat => seat.status === 'DELETED').map(seat => seat.id));
      setIsGenerated(true);

      // Fetch booked seats for the show
      const bookedRes = await axios.get(`/api/shows/${showId}/booked-seats`);
      setBlockedSeats(prev => [
        ...prev,
        ...bookedRes.data.map(bs => bs.seat_id),
      ]);
    } catch (err) {
      setError('Failed to load screen data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveScreenAndSeats = async () => {
    setIsLoading(true);
    try {
      // Save screen configuration
      const screenData = {
        screen_number: 1, // Adjust as needed
        capacity: rows * columns - deletedSeats.length,
        theater_id: 1, // Pass theater_id as prop or fetch from context
        columns,
        seat_classes: seatClasses,
      };
      
      const screenRes = screenId 
        ? await axios.put(`/api/screens/${screenId}`, screenData)
        : await axios.post('/api/screens', screenData);
      
      const currentScreenId = screenRes.data.screen_id;
      setScreenId(currentScreenId);

      // Save seats
      const seatData = seats.map(seat => ({
        seat_id: seat.id,
        seat_number: formatSeatLabel(seat.row, seat.column),
        screen_id: currentScreenId,
        class: seat.class,
        price: seat.price,
        status: deletedSeats.includes(seat.id)
          ? 'DELETED'
          : blockedSeats.includes(seat.id)
          ? 'BLOCKED'
          : 'AVAILABLE',
      }));
      
      await axios.post(`/api/screens/${currentScreenId}/seats/batch`, seatData);
    } catch (err) {
      setError('Failed to save screen data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSeats = async () => {
    if (columns > 40) setColumns(40);
    if (seatClasses.some(cls => !cls.name || cls.rows <= 0 || cls.price < 0)) {
      setError('Invalid seat class configuration');
      return;
    }

    const newSeats = [];
    let rowCount = 0;

    seatClasses.forEach(seatClass => {
      for (let i = 0; i < seatClass.rows; i++) {
        for (let j = 0; j < columns; j++) {
          newSeats.push({
            id: `${rowCount}-${j}`,
            row: rowCount,
            column: j,
            class: seatClass.name,
            price: seatClass.price,
            color: seatClass.color,
            status: 'AVAILABLE',
          });
        }
        rowCount++;
      }
    });

    setSeats(newSeats);
    setSelectedSeats([]);
    setBlockedSeats([]);
    setDeletedSeats([]);
    setIsGenerated(true);
    setIsEditMode(false);
    setIsDeleteMode(false);
    
    try {
      await saveScreenAndSeats();
    } catch (err) {
      setError('Failed to generate seats');
    }
  };
  const addSeatClass = () => {
    if (newSeatClass.name && newSeatClass.rows > 0 && newSeatClass.price >= 0) {
      setSeatClasses([...seatClasses, { ...newSeatClass }]);
      setNewSeatClass({ name: "", rows: 1, price: 100, color: "emerald" });
    }
  };

  const removeSeatClass = (index) => {
    const updatedClasses = [...seatClasses];
    updatedClasses.splice(index, 1);
    setSeatClasses(updatedClasses);
  };

  const moveSeatClassUp = (index) => {
    if (index > 0) {
      const updatedClasses = [...seatClasses];
      const temp = updatedClasses[index];
      updatedClasses[index] = updatedClasses[index - 1];
      updatedClasses[index - 1] = temp;
      setSeatClasses(updatedClasses);
    }
  };

  const moveSeatClassDown = (index) => {
    if (index < seatClasses.length - 1) {
      const updatedClasses = [...seatClasses];
      const temp = updatedClasses[index];
      updatedClasses[index] = updatedClasses[index + 1];
      updatedClasses[index + 1] = temp;
      setSeatClasses(updatedClasses);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setIsDeleteMode(false);
    setSelectedSeats([]);
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setIsEditMode(false);
    setSelectedSeats([]);
  };

  const handleSeatClick = (seatId) => {
    if (isEditMode) {
      if (blockedSeats.includes(seatId)) {
        setBlockedSeats(blockedSeats.filter(id => id !== seatId));
      } else {
        setBlockedSeats([...blockedSeats, seatId]);
      }
    } else if (isDeleteMode) {
      if (deletedSeats.includes(seatId)) {
        setDeletedSeats(deletedSeats.filter(id => id !== seatId));
      } else {
        const seatToDelete = seats.find(seat => seat.id === seatId);
        if (seatToDelete) {
          const newDeletedSeats = [...deletedSeats, seatId];
          setDeletedSeats(newDeletedSeats);
          setTimeout(() => renumberSeats(seatToDelete.row), 100);
        }
      }
    } else {
      if (!blockedSeats.includes(seatId) && !deletedSeats.includes(seatId)) {
        if (selectedSeats.includes(seatId)) {
          setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
          setSelectedSeats([...selectedSeats, seatId]);
        }
      }
    }
  };

  const renumberSeats = (rowIndex) => {
    const rowSeats = seats.filter(seat => seat.row === rowIndex && !deletedSeats.includes(seat.id))
      .sort((a, b) => a.column - b.column);
    const updatedSeats = [...seats];

    rowSeats.forEach((seat, idx) => {
      const seatIndex = updatedSeats.findIndex(s => s.id === seat.id);
      if (seatIndex !== -1) {
        updatedSeats[seatIndex] = { ...updatedSeats[seatIndex], column: idx };
      }
    });

    setSeats(updatedSeats);
  };

  const getSeatColor = (seat) => {
    if (deletedSeats.includes(seat.id)) return 'invisible';
    if (isDeleteMode) return 'seat-delete';
    if (blockedSeats.includes(seat.id)) return 'seat-blocked';
    if (selectedSeats.includes(seat.id)) return 'seat-selected';
    return `seat-${seat.color}`;
  };

  const formatSeatLabel = (row, col) => `${String.fromCharCode(65 + row)}${col + 1}`;

  const isLastRowOfSection = (rowIndex) => {
    let cumulativeRows = 0;
    for (let i = 0; i < seatClasses.length; i++) {
      cumulativeRows += seatClasses[i].rows;
      if (rowIndex + 1 === cumulativeRows) return true;
    }
    return false;
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return total + (seat ? seat.price : 0);
    }, 0);
  };

  const getSectionForRow = (rowIndex) => {
    let cumulativeRows = 0;
    for (let i = 0; i < seatClasses.length; i++) {
      cumulativeRows += seatClasses[i].rows;
      if (rowIndex < cumulativeRows) return seatClasses[i].name;
    }
    return "";
  };

  const handleNewClassInputChange = (field, value) => {
    setNewSeatClass({ ...newSeatClass, [field]: value });
  };

  const updateSeatClass = (index, field, value) => {
    const updatedClasses = [...seatClasses];
    updatedClasses[index] = { ...updatedClasses[index], [field]: value };
    setSeatClasses(updatedClasses);
  };

  return (
    <div className="seatselection-container">
      <h1 className="title">Dynamic Movie Seat Booking</h1>

      {!isGenerated ? (
        <div className="config-section">
          <h2 className="subtitle">Configure Seating Layout</h2>
          <div className="form-group">
            <label className="label">Columns (max 40)</label>
            <input
              type="number"
              min="1"
              max="40"
              value={columns}
              onChange={(e) => setColumns(Math.min(parseInt(e.target.value) || 1, 40))}
              className="input"
            />
          </div>

          <h3 className="section-title">Seating Classes</h3>
          <div className="seat-classes">
            {seatClasses.map((cls, idx) => (
              <div key={idx} className="seat-class-item">
                <div className={`color-box ${cls.color}`}></div>
                <div>
                  <label className="small-label">Class Name</label>
                  <input
                    type="text"
                    value={cls.name}
                    onChange={(e) => updateSeatClass(idx, 'name', e.target.value)}
                    className="input small-input"
                  />
                </div>
                <div>
                  <label className="small-label">Rows</label>
                  <input
                    type="number"
                    min="1"
                    value={cls.rows}
                    onChange={(e) => updateSeatClass(idx, 'rows', parseInt(e.target.value) || 1)}
                    className="input tiny-input"
                  />
                </div>
                <div>
                  <label className="small-label">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={cls.price}
                    onChange={(e) => updateSeatClass(idx, 'price', parseInt(e.target.value) || 0)}
                    className="input price-input"
                  />
                </div>
                <div>
                  <label className="small-label">Color</label>
                  <select
                    value={cls.color}
                    onChange={(e) => updateSeatClass(idx, 'color', e.target.value)}
                    className="select"
                  >
                    {colorOptions.map((color, i) => (
                      <option key={i} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
                <div className="button-group">
                  <button onClick={() => moveSeatClassUp(idx)} disabled={idx === 0} className="move-btn">↑</button>
                  <button onClick={() => moveSeatClassDown(idx)} disabled={idx === seatClasses.length - 1} className="move-btn">↓</button>
                  <button onClick={() => removeSeatClass(idx)} className="remove-btn">×</button>
                </div>
              </div>
            ))}
          </div>

          <div className="new-class-section">
            <h3 className="new-class-title">Add New Seating Class</h3>
            <div className="new-class-form">
              <div>
                <label className="small-label">Class Name</label>
                <input
                  type="text"
                  value={newSeatClass.name}
                  onChange={(e) => handleNewClassInputChange('name', e.target.value)}
                  className="input small-input"
                  placeholder="VIP"
                />
              </div>
              <div>
                <label className="small-label">Rows</label>
                <input
                  type="number"
                  min="1"
                  value={newSeatClass.rows}
                  onChange={(e) => handleNewClassInputChange('rows', parseInt(e.target.value) || 1)}
                  className="input tiny-input"
                />
              </div>
              <div>
                <label className="small-label">Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={newSeatClass.price}
                  onChange={(e) => handleNewClassInputChange('price', parseInt(e.target.value) || 0)}
                  className="input price-input"
                />
              </div>
              <div>
                <label className="small-label">Color</label>
                <select
                  value={newSeatClass.color}
                  onChange={(e) => handleNewClassInputChange('color', e.target.value)}
                  className="select"
                >
                  {colorOptions.map((color, i) => (
                    <option key={i} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <div>
                <button onClick={addSeatClass} disabled={!newSeatClass.name} className="add-btn">Add Class</button>
              </div>
            </div>
          </div>

          <div className="seat-footer">
            <span className="total-rows">Total Rows: {rows}</span>
            <button onClick={generateSeats} disabled={seatClasses.length === 0} className="generate-btn">Generate Seats</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="button-bar">
            <button onClick={toggleEditMode} className={`toggle-btn ${isEditMode ? 'active-edit' : ''}`} disabled={isDeleteMode}>
              {isEditMode ? 'Exit Edit Mode' : 'Edit Seats'}
            </button>
            <button onClick={toggleDeleteMode} className={`toggle-btn ${isDeleteMode ? 'active-delete' : ''}`} disabled={isEditMode}>
              {isDeleteMode ? 'Exit Delete Mode' : 'Delete Seats'}
            </button>
            <button onClick={() => setIsGenerated(false)} className="reset-btn">Reset Layout</button>
          </div>

          {isEditMode && <div className="warning">Click on seats to mark them as blocked. Blocked seats won't be selectable.</div>}
          {isDeleteMode && <div className="warning">Click on seats to delete them. Subsequent seats in the same row will be renumbered.</div>}

          <div className="seat-map-container">
            <div className="seat-map">
              {Array.from({ length: rows }).map((_, rowIndex) => {
                const rowSeats = seats.filter(seat => seat.row === rowIndex);
                const sectionName = getSectionForRow(rowIndex);
                const isFirstRowOfSection = rowIndex === 0 || getSectionForRow(rowIndex - 1) !== sectionName;

                return (
                  <div key={rowIndex}>
                    {isFirstRowOfSection && (
                      <div className="section-label">
                        {sectionName} - ₹{seatClasses.find(c => c.name === sectionName)?.price}
                      </div>
                    )}
                    <div className="row">
                      <div className="row-label">{String.fromCharCode(65 + rowIndex)}</div>
                      <div className="seats">
                        {rowSeats.map((seat) => (
                          <div
                            key={seat.id}
                            onClick={() => handleSeatClick(seat.id)}
                            className={`seat ${getSeatColor(seat)}`}
                            style={deletedSeats.includes(seat.id) ? { visibility: 'hidden' } : {}}
                            title={`${formatSeatLabel(seat.row, seat.column)} - ${seat.class} (₹${seat.price})`}
                          >
                            {formatSeatLabel(seat.row, seat.column).slice(1)}
                          </div>
                        ))}
                      </div>
                      <div className="row-label">{String.fromCharCode(65 + rowIndex)}</div>
                    </div>
                    {isLastRowOfSection(rowIndex) && <div className="section-divider"></div>}
                  </div>
                );
              })}
              <div className="screen">Screen</div>
            </div>
          </div>

          {!isEditMode && !isDeleteMode && (
            <div className="selected-seats">
              <h2 className="subtitle">Selected Seats</ h2>
              {selectedSeats.length > 0 ? (
                <div>
                  <div className="seat-list">
                    {selectedSeats.map(id => {
                      const seat = seats.find(s => s.id === id);
                      if (seat) {
                        return (
                          <div key={id} className="seat-item">
                            {formatSeatLabel(seat.row, seat.column)} - {seat.class} (₹{seat.price})
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <div className="total">
                    Total: {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'} - ₹{calculateTotalPrice()}
                  </div>
                  <button className="book-btn">Proceed to Booking</button>
                </div>
              ) : (
                <p>No seats selected. Click on available seats to select them.</p>
              )}
            </div>
          )}

          <div className="legend">
            {seatClasses.map((cls, idx) => (
              <div key={idx} className="legend-item">
                <div className={`color-box ${cls.color}`}></div>
                <span>{cls.name}</span>
              </div>
            ))}
            <div className="legend-item">
              <div className="color-box blocked"></div>
              <span>Blocked</span>
            </div>
            <div className="legend-item">
              <div className="color-box selected"></div>
              <span>Selected</span>
            </div>
            {isDeleteMode && (
              <div className="legend-item">
                <div className="color-box delete"></div>
                <span>Delete Mode</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;