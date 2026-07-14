import { Link, useParams, useNavigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import { roomCards } from './VisitorPages';

export default function RoomDetailsPage() {
  const { roomName } = useParams();
  const navigate = useNavigate();
  const decoded = roomName ? decodeURIComponent(roomName) : '';
  const room = roomCards.find(r => r.name === decoded);

  if (!room) {
    return (
      <PublicLayout title="Room not found" description="Requested room could not be found.">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <h2 className="text-xl font-semibold">Room not found</h2>
          <p className="mt-3 text-slate-600">We couldn't find the room you were looking for.</p>
          <div className="mt-6">
            <button onClick={() => navigate('/rooms')} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white">Back to rooms</button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout title={`${room.name} — details`} description={room.details}>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-[1fr_0.9fr]">
          <div>
            <img src={room.image} alt={room.name} className="w-full rounded-2xl object-cover" />
            <h1 className="mt-4 text-2xl font-semibold text-slate-900">{room.name}</h1>
            <p className="mt-2 text-slate-600">{room.details}</p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-medium text-slate-800">Overview</p>
              <p className="mt-1 text-sm text-slate-600">{room.about}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">Occupancy: {room.capacity} {room.capacity > 1 ? 'sharing' : 'single'}</span>
              {room.ac ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">AC</span> : <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">Non-AC</span>}
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">Size: {room.size}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">Floor: {room.floor}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">Attached Bath: {room.attachedBathroom ? 'Yes' : 'No'}</span>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="font-semibold text-slate-800">Ventilation</p>
              <p className="mt-1 text-sm text-slate-600">{room.ventilation}</p>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="font-semibold text-slate-800">Amenities</p>
              <ul className="mt-2 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                {room.amenities?.map(amenity => (
                  <li key={amenity} className="inline-flex items-center gap-2">• {amenity}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-semibold text-slate-900">{room.price}</span>
              <Link to="/contact" state={{ room: room.name }} className="ml-auto inline-flex items-center gap-2 rounded-full border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600">Contact about this room</Link>
            </div>
          </div>
          <div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-800">What's included</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Daily housekeeping</li>
                <li>Secure entry and CCTV</li>
                <li>Shared common areas</li>
                <li>WiFi and water included (check plan)</li>
              </ul>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="font-semibold text-slate-800">Need help?</p>
              <p className="mt-2 text-sm text-slate-600">If you'd like to check availability or schedule a visit, contact our team and mention the room name.</p>
              <div className="mt-4">
                <button onClick={() => navigate('/contact')} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white">Contact team</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
