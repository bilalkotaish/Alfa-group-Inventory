import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { Store, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      toast.success('Authentication Successful.');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Invalid Credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden selection:bg-indigo-200 selection:text-indigo-900">
      {/* Stunning Aurora Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] bg-violet-400/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-400/20 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />
      <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[100px] mix-blend-multiply pointer-events-none" />

      <div className="max-w-md w-full mx-4 relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
          
          <div className="p-8 sm:p-12">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-violet-500 blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-tr from-indigo-600 to-violet-600 p-4 rounded-2xl shadow-xl border border-white/20">
                  <Store className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                Alfa Group
              </h1>
              <p className="text-sm font-medium text-slate-500">
                Sign in to manage your inventory & analytics
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-slate-800 font-semibold placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-slate-800 font-semibold placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 py-4 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-bold text-lg shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] transform hover:-translate-y-1 transition-all duration-300 outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
                  {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-50/80 border-t border-slate-100 p-6 flex justify-center items-center">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Demo Access: <b className="text-indigo-600">admin</b> / <b className="text-indigo-600">admin123</b></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
