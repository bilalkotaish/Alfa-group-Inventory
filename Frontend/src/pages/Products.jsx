import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, ShoppingCart, Search, Package } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: '', brand: '', model: '', imei: '', purchasePrice: '', sellingPrice: '', stockQuantity: ''
  });
  const [sellData, setSellData] = useState({ quantity: 1, salePrice: '' });
  const [editingId, setEditingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      toast.error('Failed to fetch products');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.imei.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', formData);
        toast.success('New product added to inventory!');
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: '', category: '', brand: '', model: '', imei: '', purchasePrice: '', sellingPrice: '', stockQuantity: '' });
      fetchProducts();
    } catch (err) {
      toast.error('Error saving product');
    }
  };

  const handleSellSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sales', {
        productId: selectedProduct._id,
        quantity: sellData.quantity,
        salePrice: sellData.salePrice || selectedProduct.sellingPrice
      });
      toast.success('Sale successfully recorded!');
      setIsSellModalOpen(false);
      setSelectedProduct(null);
      setSellData({ quantity: 1, salePrice: '' });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error recording sale');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you absolutely sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted from inventory');
        fetchProducts();
      } catch (err) {
        toast.error('Error deleting product');
      }
    }
  };

  const openEditModal = (p) => {
    setFormData(p);
    setEditingId(p._id);
    setIsModalOpen(true);
  };

  const openSellModal = (p) => {
    setSelectedProduct(p);
    setSellData({ quantity: 1, salePrice: p.sellingPrice });
    setIsSellModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Products Inventory</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Manage stock levels, edit details, and process sales.</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setFormData({ name: '', category: '', brand: '', model: '', imei: '', purchasePrice: '', sellingPrice: '', stockQuantity: '' }); setIsModalOpen(true); }}
          className="w-full md:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-7 py-3.5 rounded-2xl hover:from-indigo-500 hover:to-violet-500 transition-all shadow-[0_8px_20px_-6px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 font-bold"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
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
              placeholder="Search products by name, brand, IMEI..."
              className="block w-full pl-12 pr-4 py-3.5 border border-slate-200/80 rounded-2xl leading-5 bg-slate-50/50 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            Total Inventory: <span className="text-indigo-600 text-sm ml-1.5">{filteredProducts.length}</span>
          </div>
        </div>

        {/* Mobile Card Layout */}
        <div className="block md:hidden p-4 space-y-4">
          {filteredProducts.map(p => (
            <div key={p._id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg border border-indigo-100/50">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">{p.name}</span>
                    <span className="text-xs font-bold text-slate-400">{p.brand}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${p.stockQuantity > 5 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : p.stockQuantity > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                  {p.stockQuantity} Unit{p.stockQuantity !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">{p.category || 'N/A'}</span>
                {p.model && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">{p.model}</span>}
                {p.imei && <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold font-mono bg-slate-50 text-slate-400 border border-slate-100">{p.imei}</span>}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex gap-4">
                  <div><span className="text-[10px] font-bold text-slate-400 block uppercase">Buy</span><span className="text-sm font-black text-slate-700">${p.purchasePrice}</span></div>
                  <div><span className="text-[10px] font-bold text-slate-400 block uppercase">Sell</span><span className="text-sm font-black text-indigo-600">${p.sellingPrice}</span></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openSellModal(p)} className="p-2.5 text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl transition-all" title="Record Sale"><ShoppingCart className="w-4 h-4" /></button>
                  <button onClick={() => openEditModal(p)} className="p-2.5 text-slate-600 bg-slate-50 border border-slate-200 rounded-xl transition-all" title="Edit Product"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p._id)} className="p-2.5 text-rose-600 bg-rose-50 border border-rose-100 rounded-xl transition-all" title="Delete Product"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="p-16 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mb-4 shadow-sm"><Package className="w-8 h-8 text-slate-400" /></div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1">Inventory Empty</h3>
                <p className="text-slate-500 font-medium text-sm">No products found.</p>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <th className="p-6 pl-8">Product Details</th>
                <th className="p-6">Category</th>
                <th className="p-6">Identifiers</th>
                <th className="p-6">Pricing</th>
                <th className="p-6 text-center">Stock</th>
                <th className="p-6 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/80">
              {filteredProducts.map(p => (
                <tr key={p._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-6 pl-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl border border-indigo-100/50 shadow-sm">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 text-base block">{p.name}</span>
                        <span className="text-xs font-bold text-slate-400 mt-0.5">{p.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-tighter">
                      {p.category || 'N/A'}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="font-bold text-slate-700">{p.model}</div>
                    <span className="inline-flex items-center px-2.5 py-1 mt-1.5 rounded-md text-[10px] font-bold font-mono bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-wider">
                      {p.imei}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="text-xs font-bold text-slate-400">Buy: ${p.purchasePrice}</div>
                    <div className="text-sm font-black text-slate-900 mt-1">Sell: ${p.sellingPrice}</div>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border shadow-sm ${p.stockQuantity > 5 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : p.stockQuantity > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                      {p.stockQuantity} Unit{p.stockQuantity !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="p-6 pr-8 text-right space-x-2">
                    <button onClick={() => openSellModal(p)} className="p-3 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white border border-indigo-100 hover:border-indigo-600 rounded-xl transition-all shadow-sm" title="Record Sale">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                    <button onClick={() => openEditModal(p)} className="p-3 text-slate-600 bg-slate-50 hover:bg-slate-800 hover:text-white border border-slate-200 hover:border-slate-800 rounded-xl transition-all shadow-sm" title="Edit Product">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="p-3 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-100 hover:border-rose-600 rounded-xl transition-all shadow-sm" title="Delete Product">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mb-5 shadow-sm">
                        <Package className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 mb-1">Inventory Empty</h3>
                      <p className="text-slate-500 font-medium text-sm">No products found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals with Glassmorphism */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto transform transition-all border border-slate-100">
            <div className="flex justify-between items-center p-5 sm:p-8 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">{editingId ? 'Edit Product Details' : 'Register New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 bg-white border border-slate-200 p-2.5 rounded-full shadow-sm transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Product Name</label>
                  <input type="text" required className="w-full px-5 py-4 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-800 bg-slate-50 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. iPhone 15 Pro Max" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
                    <Link to="/categories" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-500 underline uppercase tracking-widest">Manage</Link>
                  </div>
                  <select 
                    required 
                    className="w-full px-5 py-4 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-800 bg-slate-50 transition-all appearance-none" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                    {categories.length === 0 && <option disabled>No categories found - Please add one</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Brand</label>
                  <input type="text" className="w-full px-5 py-4 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-800 bg-slate-50 transition-all" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} placeholder="e.g. Apple (Optional)" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Model</label>
                  <input type="text" className="w-full px-5 py-4 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-800 bg-slate-50 transition-all" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} placeholder="e.g. A2849 (Optional)" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">IMEI / Serial Number</label>
                  <input type="text" className="w-full px-5 py-4 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold font-mono text-slate-800 bg-slate-50 transition-all" value={formData.imei} onChange={e => setFormData({...formData, imei: e.target.value})} placeholder="IMEI or Serial (Optional)" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Purchase Price ($)</label>
                  <input type="number" required className="w-full px-5 py-4 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-800 bg-slate-50 transition-all" value={formData.purchasePrice} onChange={e => setFormData({...formData, purchasePrice: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Selling Price ($)</label>
                  <input type="number" required className="w-full px-5 py-4 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-black text-indigo-600 bg-slate-50 transition-all" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: e.target.value})} />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Initial Stock Quantity</label>
                  <input type="number" required className="w-full px-5 py-4 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-800 bg-slate-50 transition-all" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} />
                </div>
              </div>
              <div className="mt-10 flex flex-col-reverse sm:flex-row justify-end sm:space-x-4 gap-4 sm:gap-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-7 py-4 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl font-bold transition-all w-full sm:w-auto shadow-sm">Cancel</button>
                <button type="submit" className="px-7 py-4 text-white bg-slate-900 hover:bg-slate-800 rounded-2xl font-bold shadow-xl shadow-slate-900/20 transition-all w-full sm:w-auto">
                  {editingId ? 'Save Changes' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSellModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto transform transition-all border border-slate-100">
            <div className="flex justify-between items-center p-5 sm:p-8 border-b border-slate-100 bg-indigo-50/50 sticky top-0 z-10">
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900">Record Sale</h2>
              <button onClick={() => setIsSellModalOpen(false)} className="text-slate-400 hover:text-indigo-600 bg-white border border-slate-200 p-2.5 rounded-full shadow-sm transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSellSubmit} className="p-5 sm:p-8">
              <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-indigo-900 to-violet-900 rounded-2xl shadow-inner relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full blur-xl pointer-events-none"></div>
                <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-2 relative z-10">Selected Product</p>
                <p className="font-black text-xl sm:text-2xl relative z-10">{selectedProduct.name}</p>
                <div className="flex justify-between mt-3 sm:mt-4 text-xs sm:text-sm font-bold relative z-10">
                  <span className="text-indigo-200/80">Model: {selectedProduct.model}</span>
                  <span className="bg-white/20 px-2.5 py-1 rounded-lg backdrop-blur-md">{selectedProduct.stockQuantity} in stock</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Quantity to Sell</label>
                  <input type="number" min="1" max={selectedProduct.stockQuantity} required className="w-full px-5 py-4 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-black text-2xl text-slate-800 bg-slate-50 transition-all text-center" value={sellData.quantity} onChange={e => setSellData({...sellData, quantity: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Sale Price ($) per item</label>
                  <input type="number" required className="w-full px-5 py-4 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-black text-2xl text-slate-800 bg-slate-50 transition-all text-center" value={sellData.salePrice} onChange={e => setSellData({...sellData, salePrice: e.target.value})} />
                </div>
              </div>
              
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-2">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-xs sm:text-sm">Total Revenue:</span>
                <span className="font-black text-2xl sm:text-3xl text-indigo-600">${(sellData.quantity * sellData.salePrice) || 0}</span>
              </div>

              <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end sm:space-x-4 gap-4 sm:gap-0">
                <button type="button" onClick={() => setIsSellModalOpen(false)} className="px-7 py-4 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl font-bold transition-all w-full sm:w-auto shadow-sm">Cancel</button>
                <button type="submit" className="px-7 py-4 text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-2xl font-bold shadow-[0_8px_20px_-6px_rgba(79,70,229,0.4)] transition-all flex justify-center items-center space-x-2 w-full sm:w-auto">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Confirm Sale</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
