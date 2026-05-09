import { useState, useEffect } from 'react';
import api from '../api';
import { Package, Layers, DollarSign, TrendingUp, TrendingDown, DollarSignIcon, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';



const StatCard = ({ title, value, icon: Icon, gradientClass, trend }) => (
  <div className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-7 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3.5 rounded-2xl ${gradientClass} text-indigo-600 shadow-sm border border-indigo-100/50`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend !== undefined && (
        <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${trend >= 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
          {trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    <div>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
      <p className="text-xs font-bold text-slate-400 mt-1.5 uppercase tracking-widest">{title}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStockQuantity: 0,
    stockValue: 0,
    dailyRevenue: 0,
    monthlyRevenue: 0,
    dailyProfit: 0,
    monthlyProfit: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/reports/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Real-time store metrics and inventory status.</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl flex items-center space-x-2.5 shadow-sm">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Live Connect</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={stats.totalProducts} icon={Package} gradientClass="bg-indigo-50" trend={12} />
        <StatCard title="Total Stock" value={stats.totalStockQuantity} icon={Layers} gradientClass="bg-violet-50 text-violet-600 border-violet-100/50" trend={-2} />
        <StatCard title="Stock Value" value={`$${stats.stockValue.toLocaleString()}`} icon={DollarSign} gradientClass="bg-emerald-50 text-emerald-600 border-emerald-100/50" />
        <StatCard title="Today's Revenue" value={`$${stats.dailyRevenue.toLocaleString()}`} icon={TrendingUp} gradientClass="bg-sky-50 text-sky-600 border-sky-100/50" trend={8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Revenue vs Profit</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">Financial overview for current period</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block px-4 py-2.5 outline-none cursor-pointer">
              <option>Last 7 Days</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={13} tickLine={false} axisLine={false} dy={15} fontFamily="Outfit" fontWeight={600} />
                <YAxis stroke="#94a3b8" fontSize={13} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} fontFamily="Outfit" fontWeight={600} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', fontFamily: 'Outfit', fontWeight: 600, padding: '12px 16px' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 8, strokeWidth: 0, fill: '#4f46e5' }} />
                <Area type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorProfit)" activeDot={{ r: 8, strokeWidth: 0, fill: '#8b5cf6' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 rounded-[2rem] shadow-[0_20px_40px_rgb(0,0,0,0.2)] p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-bl-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/20 rounded-tr-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-extrabold text-white mb-2">Monthly Overview</h3>
            <p className="text-sm font-medium text-indigo-200/60 mb-10">Summary of the current fiscal month</p>
            
            <div className="space-y-8">
              <div className="group">
                <p className="text-[11px] font-bold text-indigo-200/50 uppercase tracking-[0.2em] mb-3">Total Revenue</p>
                <div className="flex items-center space-x-5">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <DollarSignIcon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-5xl font-black text-white tracking-tight">${stats.monthlyRevenue.toLocaleString()}</span>
                </div>
              </div>

              <div className="w-full h-px bg-white/10"></div>

              <div className="group">
                <p className="text-[11px] font-bold text-indigo-200/50 uppercase tracking-[0.2em] mb-3">Net Profit</p>
                <div className="flex items-center space-x-5">
                  <div className="bg-gradient-to-br from-indigo-500 to-violet-500 p-4 rounded-2xl border border-white/20 shadow-lg shadow-indigo-500/30">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-5xl font-black text-white tracking-tight">${stats.monthlyProfit.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 relative z-10">
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl transition-all border border-white/10 flex items-center justify-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Download Statement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
