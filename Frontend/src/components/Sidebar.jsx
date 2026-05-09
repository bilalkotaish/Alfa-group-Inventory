import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, Store, X, Tag } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Categories', path: '/categories', icon: Tag },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
  ];

  return (
    <div 
      className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-white transform transition-transform duration-300 ease-in-out border-r border-slate-200/60 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="h-24 flex items-center justify-between px-8 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-2xl shadow-[0_8px_16px_-6px_rgba(79,70,229,0.4)]">
            <Store className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Alfa<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Group</span>
          </h1>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 py-8 px-5 overflow-y-auto">
        <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-[22px] h-[22px] transition-transform duration-300 ${isActive ? 'text-white scale-110' : 'text-slate-400 group-hover:text-indigo-600 group-hover:scale-110'}`} />
                    <span className={`font-semibold tracking-wide ${isActive ? 'text-white' : ''}`}>{link.name}</span>
                    {isActive && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
      
      <div className="p-6">
        <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-bl-full blur-xl"></div>
          <p className="text-xs font-bold text-slate-800 mb-1">Inventory Pro</p>
          <p className="text-[11px] text-slate-500 font-medium">Enterprise Edition &copy; 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
