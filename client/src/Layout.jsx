import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Fleet Manager</h1>
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/dashboard" className="block text-gray-700 hover:bg-gray-200 p-2 rounded">Dashboard</Link>
          <Link to="/vehicles" className="block text-gray-700 hover:bg-gray-200 p-2 rounded">Vehicles</Link>
          <Link to="/trips" className="block text-gray-700 hover:bg-gray-200 p-2 rounded">Trips</Link>
          <Link to="/maintenance" className="block text-gray-700 hover:bg-gray-200 p-2 rounded">Maintenance</Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
