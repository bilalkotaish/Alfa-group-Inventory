import { LogOut, User, Menu, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/products': return 'Inventory';
      case '/reports': return 'Analytics';
      default: return 'Alfa Group';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-24 flex items-center justify-between px-6 lg:px-10 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/50">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{getPageTitle()}</h2>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 sm:space-x-5">
        <button className="p-3 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 shadow-sm rounded-full transition-all relative group">
          <Bell className="w-5 h-5 group-hover:animate-bounce" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
        </button>

        <div className="flex items-center space-x-3 bg-white p-1.5 pr-5 rounded-full border border-slate-200 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-md border-2 border-white">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-slate-800 capitalize hidden sm:block tracking-wide">
            {localStorage.getItem('role') || 'Admin'}
          </span>
        </div>
        
        <button
          onClick={handleLogout}
          className="p-3 bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 shadow-sm rounded-full transition-all"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
