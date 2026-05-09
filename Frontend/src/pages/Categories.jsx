import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Plus, Trash2, X, Tag, Search, Layers } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      toast.error('Failed to fetch categories');
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/categories', formData);
      toast.success('Category added successfully!');
      setIsModalOpen(false);
      setFormData({ name: '' });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error adding category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? Products in this category will not be deleted but will lose their category association.')) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success('Category deleted');
        fetchCategories();
      } catch (err) {
        toast.error('Error deleting category');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Product Categories</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Organize your inventory with custom categories.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-7 py-3.5 rounded-2xl hover:from-indigo-500 hover:to-violet-500 transition-all shadow-[0_8px_20px_-6px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 font-bold"
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="p-5 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          <div className="relative w-full sm:w-[400px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              className="block w-full pl-12 pr-4 py-3.5 border border-slate-200/80 rounded-2xl leading-5 bg-slate-50/50 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            Total Categories: <span className="text-indigo-600 text-sm ml-1.5">{filteredCategories.length}</span>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map(cat => (
              <div key={cat._id} className="group relative bg-slate-50/50 border border-slate-100 p-6 rounded-3xl hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50 group-hover:scale-110 transition-transform">
                      <Tag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg">{cat.name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Category ID: {cat._id.slice(-6)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(cat._id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {filteredCategories.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mb-5 shadow-sm">
                    <Layers className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-1">No Categories Found</h3>
                  <p className="text-slate-500 font-medium text-sm">Add a category to start organizing your products.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-100">
            <div className="flex justify-between items-center p-8 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">New Category</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 bg-white border border-slate-200 p-2.5 rounded-full shadow-sm transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category Name</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-5 py-4 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-800 bg-slate-50 transition-all" 
                    value={formData.name} 
                    onChange={e => setFormData({ name: e.target.value })} 
                    placeholder="e.g. Covers, Phones, Chargers" 
                  />
                </div>
              </div>
              <div className="mt-10 flex flex-col-reverse sm:flex-row justify-end sm:space-x-4 gap-4 sm:gap-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-7 py-4 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl font-bold transition-all w-full sm:w-auto shadow-sm">Cancel</button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-7 py-4 text-white bg-slate-900 hover:bg-slate-800 rounded-2xl font-bold shadow-xl shadow-slate-900/20 transition-all w-full sm:w-auto disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
