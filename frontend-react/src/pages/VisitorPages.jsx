import { useState } from 'react';
import {
  ArrowRight,
  BedDouble,
  Building2,
  Camera,
  Car,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Droplets,
  HeartPulse,
  Home,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  Users,
  Wifi,
  Zap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import { useAuth } from '../context/AuthContext';
import heroImage from '../pg photos/Standard Single.jpg';
import aboutImage from '../pg photos/Gym area.jpg';
import standardSingleImage from '../pg photos/Standard Single.jpg';
import singleNonAcImage from '../pg photos/Single Non-AC.jpg';
import twinSharingImage from '../pg photos/Twin Sharing Non-AC.jpg';
import twinSharingAcImage from '../pg photos/Twin Sharing AC.jpg';
import twinSharingNonAcImage from '../pg photos/Twin Sharing Non-AC.jpg';
import tripleSharingAcImage from '../pg photos/Triple Sharing AC.jpg';
import tripleSharingNonAcImage from '../pg photos/Triple Sharing Non-AC.jpg';
import premiumSuiteImage from '../pg photos/Premium Suite.avif';
import messAreaImage from '../pg photos/Mess area.jpg';
import waitingAreaImage from '../pg photos/Waiting area.jpg';
import selfCookingImage from '../pg photos/Self coocking area.jpg';
import rooftopImage from '../pg photos/roof top.jpg';
import playZoneImage from '../pg photos/play zone.jpg';
import contactImage from '../pg photos/play zone.jpg';

const highlightCards = [
  { title: 'Safe stays', body: 'Secure entry, verified visitors, and responsive support for every resident.', icon: ShieldCheck },
  { title: 'Comfort-first rooms', body: 'Clean, airy spaces with thoughtful amenities for work, rest, and daily living.', icon: Sparkles },
  { title: 'Community-driven care', body: 'Shared living that keeps routines simple, welcoming, and well-organized.', icon: Users }
];

export const roomCards = [
  { name: 'Standard Single', price: '₹8,000/mo', details: 'Private bed, wardrobe, cooling, and housekeeping', about: 'Perfect for residents who want privacy, a quiet study corner, and a clean personal space.', image: standardSingleImage, badge: 'Solo comfort', capacity: 1, ac: true, ventilation: 'Large window with cross-ventilation', attachedBathroom: false, floor: '2nd floor', size: '110 sqft', amenities: ['Wardrobe', 'Study table', 'Attached light', 'Ceiling fan'] },
  { name: 'Single Non-AC', price: '₹7,000/mo', details: 'Budget-friendly stay with essential comfort and daily support', about: 'A simple and affordable room option with basic comfort, good airflow, and daily housekeeping.', image: singleNonAcImage, badge: 'Value stay', capacity: 1, ac: false, ventilation: 'Good natural airflow with window', attachedBathroom: false, floor: '1st floor', size: '100 sqft', amenities: ['Wardrobe', 'Study lamp', 'Fan'] },
  { name: 'Twin Sharing', price: '₹6,500/mo', details: 'Balanced layout for students and professionals', about: 'A practical shared room that offers comfort, shared amenities, and a friendly community feel.', image: twinSharingImage, badge: 'Budget-friendly', capacity: 2, ac: false, ventilation: 'Shared windows and extractor for airflow', attachedBathroom: false, floor: '3rd floor', size: '160 sqft', amenities: ['Two beds', 'Two wardrobes', 'Shared study desk'] },
  { name: 'Twin Sharing AC', price: '₹7,500/mo', details: 'Air-conditioned shared room with extra comfort', about: 'Ideal for those who want cooler rooms, better sleep, and a more relaxed shared stay.', image: twinSharingAcImage, badge: 'AC comfort', capacity: 2, ac: true, ventilation: 'AC with window for fresh air', attachedBathroom: false, floor: '3rd floor', size: '160 sqft', amenities: ['AC', 'Two beds', 'Individual lockers'] },
  { name: 'Twin Sharing Non-AC', price: '₹6,000/mo', details: 'Simple shared room with good ventilation and value', about: 'A budget-friendly shared room that keeps the stay practical and comfortable without extra cost.', image: twinSharingNonAcImage, badge: 'Shared value', capacity: 2, ac: false, ventilation: 'Cross-ventilation windows', attachedBathroom: false, floor: '2nd floor', size: '150 sqft', amenities: ['Two beds', 'Shared wardrobe', 'Fan'] },
  { name: 'Triple Sharing AC', price: '₹8,500/mo', details: 'Comfortable shared room with cooling and study-friendly space', about: 'Great for roommates who want a comfortable, cool, and well-organized shared setup.', image: tripleSharingAcImage, badge: 'AC shared', capacity: 3, ac: true, ventilation: 'AC plus windows for airflow', attachedBathroom: false, floor: '4th floor', size: '210 sqft', amenities: ['AC', 'Three beds', 'Shared study area'] },
  { name: 'Triple Sharing Non-AC', price: '₹7,000/mo', details: 'Affordable shared room with practical facilities', about: 'A good fit for residents who want shared living at a lower price with useful amenities.', image: tripleSharingNonAcImage, badge: 'Budget shared', capacity: 3, ac: false, ventilation: 'Large windows for natural ventilation', attachedBathroom: false, floor: '4th floor', size: '200 sqft', amenities: ['Three beds', 'Shared wardrobe'] },
  { name: 'Premium Suite', price: '₹10,500/mo', details: 'Extra space, attached washroom, and premium furnishing', about: 'A premium option with extra room, better furnishing, and a more elevated living experience.', image: premiumSuiteImage, badge: 'Premium stay', capacity: 1, ac: true, ventilation: 'Private window and exhaust', attachedBathroom: true, floor: 'Penthouse', size: '220 sqft', amenities: ['Attached bathroom', 'Mini-fridge', 'Sofa', 'Work desk'] }
];

const pricingTiers = [
  { name: 'Starter', price: '₹6,000', details: 'Single occupancy with essential amenities', icon: Home },
  { name: 'Balanced', price: '₹8,000', details: 'Shared comfort with flexible meal plans', icon: BedDouble },
  { name: 'Premium', price: '₹10,500', details: 'Priority service, better room, and extra support', icon: CircleDollarSign }
];

const galleryItems = [
  { title: 'Standard Room', description: 'Clean, bright rooms with practical furniture and good ventilation.', image: standardSingleImage },
  { title: 'Twin Sharing', description: 'A comfortable shared setup for everyday living and study routines.', image: twinSharingImage },
  { title: 'Twin Sharing AC', description: 'Air-conditioned shared rooms with a calmer, cooler feel.', image: twinSharingAcImage },
  { title: 'Triple Sharing AC', description: 'A spacious shared option for groups and roommates.', image: tripleSharingAcImage },
  { title: 'Mess Area', description: 'A neat dining space for shared meals and conversations.', image: messAreaImage },
  { title: 'Self Cooking', description: 'A practical self-cooking zone for independent routines.', image: selfCookingImage },
  { title: 'Rooftop', description: 'An airy rooftop area for relaxing and enjoying the view.', image: rooftopImage },
  { title: 'Waiting Area', description: 'A welcoming common area for residents and visitors.', image: waitingAreaImage },
  { title: 'Play Zone', description: 'A lighthearted space for downtime and recreation.', image: playZoneImage },
  { title: 'Gym Area', description: 'A simple fitness setup for healthy daily routines.', image: aboutImage }
];

const contactPoints = [
  { label: 'Phone', value: '+91 98765 43210', icon: Phone },
  { label: 'Email', value: 'hello@my-pg.com', icon: Mail },
  { label: 'Address', value: '12, MG Road, Bengaluru', icon: MapPin }
];

const infrastructureItems = [
  { title: 'Reception', description: 'Welcoming front desk and visitor support.', icon: Building2 },
  { title: 'Dining Hall', description: 'Clean shared dining space for daily meals.', icon: UtensilsCrossed },
  { title: 'Kitchen', description: 'Well-maintained cooking and serving area.', icon: Home },
  { title: 'Laundry', description: 'Convenient washing and drying facility.', icon: Home },
  { title: 'Parking', description: 'Safe parking space for residents and visitors.', icon: Car },
  { title: 'Garden', description: 'Green open area for relaxation and fresh air.', icon: Sparkles },
  { title: 'Study Area', description: 'Quiet zone for focus and productivity.', icon: Home },
  { title: 'Gym', description: 'Basic fitness setup for healthy routines.', icon: Sparkles },
  { title: 'Rooftop', description: 'Open terrace for evening views and leisure.', icon: Building2 },
  { title: 'Power Backup', description: 'Reliable backup support for essential needs.', icon: Zap },
  { title: 'WiFi', description: 'Stable internet for study and work.', icon: Wifi },
  { title: 'CCTV', description: 'Secure monitoring for peace of mind.', icon: ShieldCheck }
];

const availabilityItems = [
  { label: 'Single', value: '15 Available' },
  { label: 'Double', value: '8 Available' },
  { label: 'Triple', value: '5 Available' },
  { label: 'Four Sharing', value: '12 Available' }
];

const facilitiesItems = [
  { title: 'WiFi', description: 'Fast internet for work and study.', icon: Wifi },
  { title: 'Parking', description: 'Vehicle parking support.', icon: Car },
  { title: 'Laundry', description: 'Laundry and drying support.', icon: Home },
  { title: 'Housekeeping', description: 'Daily cleaning and maintenance.', icon: Sparkles },
  { title: 'Food', description: 'Nutritious meals and meal plans.', icon: UtensilsCrossed },
  { title: 'Water', description: '24/7 water availability.', icon: Droplets },
  { title: 'Power Backup', description: 'Reliable backup electricity.', icon: Zap },
  { title: 'CCTV', description: 'Round-the-clock surveillance.', icon: ShieldCheck },
  { title: 'Security', description: 'Secure entry and support staff.', icon: ShieldCheck },
  { title: 'Lift', description: 'Easy access for residents.', icon: Building2 },
  { title: 'RO Water', description: 'Clean purified drinking water.', icon: Droplets },
  { title: 'Medical Support', description: 'First-aid access and emergency support.', icon: HeartPulse }
];

const testimonialItems = [
  { title: 'Excellent Food', body: 'The food quality and cleanliness are always impressive.', stars: '★★★★★' },
  { title: 'Safe Environment', body: 'I feel secure and comfortable living here every day.', stars: '★★★★★' },
  { title: 'Good Rooms', body: 'The rooms are bright, neat, and very well maintained.', stars: '★★★★★' }
];

const faqItems = [
  { question: 'Is the PG suitable for students?', answer: 'Yes, we offer a calm and productive environment for students and working professionals.' },
  { question: 'Are meals included?', answer: 'Meal plans are available and can be customized based on your preference.' },
  { question: 'Can visitors come anytime?', answer: 'Visitors can be registered at the reception and guided through the entry process.' }
];

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookNow = () => {
    if (user) {
      navigate('/rooms');
      return;
    }

    navigate('/login', { state: { from: '/rooms' } });
  };

  return (
    <PublicLayout title="Welcome to My PG Management" description="Comfortable living, affordable pricing, and a safe environment designed for students and professionals.">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
          <img src={heroImage} alt="Modern PG room interior" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-slate-900/20" />
          <div className="relative p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-100">Visitor journey</p>
            <h2 className="mt-4 text-3xl font-semibold">Comfortable Living • Affordable Pricing • Safe Environment</h2>
            <p className="mt-4 max-w-2xl text-indigo-100">Browse the property, review rooms, and continue to login to reach your role-specific dashboard instantly.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/login" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-indigo-700">Login</Link>
              <button type="button" onClick={handleBookNow} className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white">Book Now</button>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Why visitors choose MY-PG</h3>
          <div className="mt-5 space-y-3">
            {highlightCards.map(card => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Icon className="h-4 w-4" />
                    <p className="font-medium text-slate-800">{card.title}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{card.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { value: '100+', label: 'Residents' },
          { value: '50', label: 'Rooms' },
          { value: '200', label: 'Beds' },
          { value: '24/7', label: 'Security' }
        ].map(stat => (
          <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">About PG</h2>
          <p className="mt-4 text-slate-600">We are dedicated to creating a living space that combines comfort, cleanliness, and responsive service. Our vision is to deliver a trusted, secure, and friendly PG experience for modern lifestyles.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-800">Vision</p>
              <p className="mt-1 text-sm text-slate-600">To become the most trusted PG brand for safe and comfortable living.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-800">Mission</p>
              <p className="mt-1 text-sm text-slate-600">To offer dependable service, well-maintained spaces, and a community feel.</p>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img src={aboutImage} alt="Comfortable PG living space" className="h-64 w-full object-cover" />
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Featured Rooms</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Room Types</h2>
          </div>
          <Link to="/rooms" className="text-sm font-medium text-indigo-600">See all rooms</Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {roomCards.map(room => (
            <div key={room.name} className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
              <img src={room.image} alt={room.name} className="h-40 w-full object-cover" />
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-lg font-semibold text-slate-900">{room.name}</p>
                  <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">{room.badge}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{room.details}</p>
                <p className="mt-4 text-xl font-semibold text-slate-900">{room.price}</p>
                <Link to={`/rooms/${encodeURIComponent(room.name)}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-indigo-600">View Details <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Bed Availability</h2>
          <div className="mt-6 space-y-3">
            {availabilityItems.map(item => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-medium text-slate-800">{item.label}</span>
                <span className="text-sm text-slate-600">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Facilities</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {facilitiesItems.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Icon className="h-4 w-4" />
                    <p className="font-medium text-slate-800">{item.title}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Pricing</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Simple plans for every stay</h2>
          </div>
          <Link to="/pricing" className="text-sm font-medium text-indigo-600">View pricing</Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pricingTiers.map(plan => {
            const Icon = plan.icon;
            return (
              <div key={plan.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Icon className="h-5 w-5" />
                  <p className="text-lg font-semibold text-slate-900">{plan.name}</p>
                </div>
                <p className="mt-3 text-sm text-slate-600">{plan.details}</p>
                <p className="mt-4 text-2xl font-semibold text-slate-900">{plan.price}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Gallery</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">A glimpse of our spaces</h2>
          </div>
          <Link to="/gallery" className="text-sm font-medium text-indigo-600">Browse gallery</Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {galleryItems.map(item => (
            <div key={item.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
              <div className="p-4">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Testimonials</h2>
          <div className="mt-6 space-y-4">
            {testimonialItems.map(item => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">{item.stars}</p>
                <p className="mt-2 font-medium text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">FAQ</h2>
          <div className="mt-6 space-y-3">
            {faqItems.map(item => (
              <div key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-800">{item.question}</p>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Contact</h2>
            <p className="mt-3 text-slate-600">Reach out for room availability, visit scheduling, or service questions.</p>
            <div className="mt-6 space-y-3">
              {contactPoints.map(point => {
                const Icon = point.icon;
                return (
                  <div key={point.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{point.label}</p>
                      <p className="mt-1 text-slate-700">{point.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-xl font-semibold text-slate-900">Send a message</h3>
            <form className="mt-4 space-y-3">
              <input className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5" placeholder="Your name" />
              <input className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5" placeholder="Your email" />
              <textarea className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5" placeholder="Your message" />
              <button type="button" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white">Send message</button>
            </form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

export function AboutPage() {
  return (
    <PublicLayout title="About PG" description="A welcoming stay designed around safety, community, and everyday ease.">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Built for students, professionals, and families</h2>
            <p className="mt-3 text-slate-600">Our PG offers a balanced lifestyle with clean spaces, responsive support, and comfortable surroundings that make everyday living easier.</p>
            <div className="mt-6 space-y-3">
              {['Trusted by residents for the last 6 years', 'Flexible stay plans and clear communication', 'Round-the-clock support for comfort and security'].map(item => (
                <div key={item} className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
            <img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80" alt="PG community lifestyle" className="h-64 w-full object-cover" />
            <div className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Highlights</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="rounded-2xl border border-slate-200 bg-white p-3">Comfortable rooms with daily housekeeping</li>
                <li className="rounded-2xl border border-slate-200 bg-white p-3">Safe and easy visitor entry process</li>
                <li className="rounded-2xl border border-slate-200 bg-white p-3">Supportive environment for studying and working</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

export function FacilitiesPage() {
  return (
    <PublicLayout title="Facilities" description="A practical set of amenities that support a clean, comfortable, and stress-free stay.">
      <section className="grid gap-6 lg:grid-cols-2">
        {facilitiesItems.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600">
                <Icon className="h-5 w-5" />
                <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
              </div>
              <p className="mt-3 text-slate-600">{item.description}</p>
            </div>
          );
        })}
      </section>
    </PublicLayout>
  );
}

export function RoomsPage() {
  const [activeRoom, setActiveRoom] = useState(null);

  return (
    <PublicLayout title="Rooms" description="Choose from room options that match your routine, comfort, and budget.">
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {roomCards.map(room => {
          const isOpen = activeRoom === room.name;

          return (
            <div key={room.name} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img src={room.image} alt={room.name} className="h-44 w-full object-cover" />
              <div className="p-6">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Stay option</p>
                  <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">{room.badge}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">{room.name}</h2>
                <p className="mt-3 text-slate-600">{room.details}</p>

                <button
                  type="button"
                  onClick={() => setActiveRoom(isOpen ? null : room.name)}
                  className="mt-4 text-sm font-medium text-indigo-600"
                >
                  {isOpen ? 'Hide details' : 'About this room'}
                </button>

                {isOpen ? (
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                    <p className="font-medium text-slate-800">Brief overview</p>
                    <p className="mt-1">{room.about}</p>
                  </div>
                ) : null}

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-900">{room.price}</span>
                  <Link to={`/rooms/${encodeURIComponent(room.name)}`} className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </PublicLayout>
  );
}

export function PricingPage() {
  return (
    <PublicLayout title="Pricing" description="Clear, simple pricing that keeps your stay plan straightforward.">
      <section className="grid gap-6 lg:grid-cols-3">
        {pricingTiers.map(plan => {
          const Icon = plan.icon;
          return (
            <div key={plan.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600">
                <Icon className="h-5 w-5" />
                <h2 className="text-xl font-semibold text-slate-900">{plan.name}</h2>
              </div>
              <p className="mt-3 text-slate-600">{plan.details}</p>
              <p className="mt-6 text-3xl font-semibold text-slate-900">{plan.price}</p>
              <p className="mt-1 text-sm text-slate-500">per month</p>
            </div>
          );
        })}
      </section>
    </PublicLayout>
  );
}

export function GalleryPage() {
  return (
    <PublicLayout title="Gallery" description="Take a quick tour of the shared spaces, rooms, and welcoming areas.">
      <section className="grid gap-6 md:grid-cols-2">
        {galleryItems.map(item => (
          <div key={item.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
            <div className="p-6">
              <div className="flex items-center gap-2 text-indigo-600">
                <Camera className="h-5 w-5" />
                <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
              </div>
              <p className="mt-3 text-slate-600">{item.description}</p>
            </div>
          </div>
        ))}
      </section>
    </PublicLayout>
  );
}

export function ContactPage() {
  return (
    <PublicLayout title="Contact" description="Reach out to arrange a visit, ask about availability, or speak with the property team.">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">We are ready to help</h2>
            <p className="mt-3 text-slate-600">For inquiries about room availability, facilities, or visit scheduling, use the contact details below.</p>
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
              <img src={contactImage} alt="PG front desk and contact area" className="h-56 w-full object-cover" />
            </div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6">
            {contactPoints.map(point => {
              const Icon = point.icon;
              return (
                <div key={point.label} className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{point.label}</p>
                    <p className="mt-1 text-slate-700">{point.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
