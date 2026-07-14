import { Link, NavLink } from 'react-router-dom';
import { Building2, ChevronRight } from 'lucide-react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About PG' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' }
];

export default function PublicLayout({ title, description, eyebrow = 'Visitor experience', children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-600 p-2 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">MY-PG</p>
              <p className="text-sm text-slate-500">Comfort, care, community</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
            {links.map(link => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'text-indigo-600' : 'hover:text-indigo-600')}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <Link to="/login" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
            Login
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {(title || description) && (
          <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-600">{eyebrow}</p>
            {title ? <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h1> : null}
            {description ? <p className="mt-3 max-w-3xl text-base text-slate-600">{description}</p> : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700">
                Continue to login <ChevronRight className="h-4 w-4" />
              </Link>
              <Link to="/rooms" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600">
                Explore rooms
              </Link>
            </div>
          </section>
        )}

        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white/80 px-4 py-6 text-center text-sm text-slate-500">
        Built for modern PG operations with a visitor-first experience.
      </footer>
    </div>
  );
}
