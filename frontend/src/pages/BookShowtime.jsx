import { useState, useEffect, useContext } from 'react';
import { useNavigate } from '../hooks/useNavigate';
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import LoadingLogo from '../components/LoadingLogo';
import { API_BASE_URL } from '../utils/api';

export default function BookShowtime() {
  const showtimeId = window.location.pathname.split('/')[2];
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showtime, setShowtime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAdult, setSelectedAdult] = useState(1);
  const [selectedChild, setSelectedChild] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    fetchShowtime();
  }, [showtimeId]);

  const fetchShowtime = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/showtimes/${showtimeId}`);
      if (!res.ok) throw new Error('Showtime not found');
      const data = await res.json();
      setShowtime(data.data);
    } catch (err) {
      toast.error(err.message || 'Unable to load showtime');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background-900 flex items-center justify-center">
      <LoadingLogo size={80} text="Loading booking..." />
    </div>
  );

  if (!showtime) return (
    <div className="min-h-screen bg-background-900 flex items-center justify-center">
      <div className="text-text-primary">Showtime not found</div>
    </div>
  );

  const totalTickets = Number(selectedAdult) + Number(selectedChild);

  const hallLayout = showtime.hallId?.layout || { rows: 0, cols: 0, seats: [] };

  const isSeatBooked = (label) => showtime.bookedSeats?.includes(label) || false;

  const toggleSeat = (label, active) => {
    if (!active) return;
    if (isSeatBooked(label)) return;
    if (selectedSeats.includes(label)) {
      setSelectedSeats(selectedSeats.filter(s => s !== label));
    } else {
      if (selectedSeats.length >= totalTickets) {
        toast.info(`You can only select ${totalTickets} seats`);
        return;
      }
      setSelectedSeats([...selectedSeats, label]);
    }
  };

  const handleConfirm = async () => {
    if (!user) {
      toast.info('Please login to complete booking');
      setTimeout(() => navigate('/login'), 600);
      return;
    }

    if (selectedSeats.length !== totalTickets) {
      toast.error('Please select seats equal to ticket count');
      return;
    }

    try {
      const body = { showtimeId, seats: selectedSeats, adultCount: selectedAdult, childCount: selectedChild };
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking failed');
      toast.success('Booking confirmed!');
      navigate('/profile');
    } catch (err) {
      toast.error(err.message || 'Booking failed');
    }
  };

  // Build seat grid
  const seatMap = {};
  (hallLayout.seats || []).forEach(s => {
    seatMap[`${s.row}-${s.col}`] = s;
  });

  const rows = hallLayout.rows || 0;
  const cols = hallLayout.cols || 0;

  return (
    <div className="min-h-screen bg-background-900 text-text-primary">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <BackButton to={`/movies/${showtime.movieId?._id || ''}/showtimes`} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2 bg-surface-600 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Select Seats</h2>
            <div className="mb-4">Select {totalTickets} seats for {new Date(showtime.startTime).toLocaleString()}</div>

            <div className="overflow-auto">
              <div className="inline-block p-4 bg-surface-500 rounded-lg">
                {[...Array(rows)].map((_, rIdx) => (
                  <div key={rIdx} className="flex gap-2 mb-2">
                    {[...Array(cols)].map((_, cIdx) => {
                      const key = `${rIdx+1}-${cIdx+1}`;
                      const seat = seatMap[key];
                      const label = seat?.label || `${String.fromCharCode(65 + rIdx)}${cIdx+1}`;
                      const active = seat ? seat.isActive !== false : false;
                      const booked = isSeatBooked(label);
                      const selected = selectedSeats.includes(label);
                      return (
                        <button
                          key={key}
                          onClick={() => toggleSeat(label, active)}
                          disabled={!active || booked}
                          className={`w-10 h-10 text-sm rounded ${booked ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : selected ? 'bg-primary-500 text-white' : active ? 'bg-surface-400 hover:bg-surface-300' : 'bg-gray-800 text-gray-500'}`}
                          title={label}
                        >{label}</button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface-600 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
            <div className="mb-3">
              <label className="block text-sm text-text-secondary">Adults</label>
              <input type="number" min={0} value={selectedAdult} onChange={(e) => setSelectedAdult(Math.max(0, Number(e.target.value)))} className="w-full px-3 py-2 rounded mt-1 bg-surface-500" />
            </div>
            <div className="mb-3">
              <label className="block text-sm text-text-secondary">Children</label>
              <input type="number" min={0} value={selectedChild} onChange={(e) => setSelectedChild(Math.max(0, Number(e.target.value)))} className="w-full px-3 py-2 rounded mt-1 bg-surface-500" />
            </div>

            <div className="mb-3">
              <div className="text-sm text-text-secondary">Price</div>
              <div className="text-lg font-bold">${Number(showtime.price).toFixed(2)} (Adult)</div>
              <div className="text-sm">Child = 50% discount</div>
            </div>

            <div className="mb-3">
              <div className="text-sm text-text-secondary">Selected Seats</div>
              <div className="mt-2">{selectedSeats.join(', ') || '-'}</div>
            </div>

            <div className="mt-6">
              <button onClick={handleConfirm} className="w-full py-2 bg-primary-500 rounded-lg text-white">Confirm Booking</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
