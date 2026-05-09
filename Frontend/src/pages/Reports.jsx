import { useState, useEffect } from 'react';
import api from '../api';
import { FileText, Download, Calendar, ArrowUpRight } from 'lucide-react';

const Reports = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await api.get('/sales');
      setSales(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = () => {
    const headers = ['Date,Product,Quantity,Sale Price,Total Amount,Profit'];
    const rows = sales.map(s => 
      `${new Date(s.date).toLocaleDateString()},"${s.product?.name || 'Unknown'}",${s.quantity},${s.salePrice},${s.totalAmount},${s.profit}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "alfa_group_sales_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Analytics & Reports</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Transaction history and financial exports.</p>
        </div>
        <button
          onClick={handleExport}
          className="w-full md:w-auto flex items-center justify-center space-x-2 bg-white text-indigo-600 px-7 py-3.5 rounded-2xl hover:bg-indigo-50 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 font-bold group"
        >
          <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          <span>Export to CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-bl-full opacity-50 pointer-events-none"></div>
        
        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 bg-white">
          <div className="flex items-center space-x-5">
            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 border border-indigo-100">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Transaction Ledger</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Chronological Sales Record</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-slate-50 px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">All Time</span>
          </div>
        </div>
        
        <div className="overflow-x-auto relative z-10 bg-white">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <th className="p-6 pl-8">Date & Time</th>
                <th className="p-6">Product Sold</th>
                <th className="p-6">Quantity</th>
                <th className="p-6">Unit Price</th>
                <th className="p-6">Total Revenue</th>
                <th className="p-6 pr-8 text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/80">
              {sales.map(sale => (
                <tr key={sale._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-6 pl-8 text-slate-500 font-medium">
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-extrabold">{new Date(sale.date).toLocaleDateString()}</span>
                      <span className="text-xs font-bold text-slate-400 mt-0.5">{new Date(sale.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </td>
                  <td className="p-6 font-extrabold text-slate-900">
                    <div className="flex items-center space-x-2">
                      <span>{sale.product?.name || 'Deleted Product'}</span>
                    </div>
                  </td>
                  <td className="p-6 text-slate-600 font-black">
                    <span className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">{sale.quantity}x</span>
                  </td>
                  <td className="p-6 text-slate-500 font-bold">
                    ${sale.salePrice.toLocaleString()}
                  </td>
                  <td className="p-6 font-black text-slate-900 text-lg">
                    ${sale.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-6 pr-8 text-right">
                    <div className="inline-flex items-center space-x-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-100 shadow-sm">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="font-extrabold text-base">${sale.profit.toLocaleString()}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mb-5 shadow-sm">
                        <FileText className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 mb-2">No transactions recorded</h3>
                      <p className="text-slate-500 font-medium text-sm max-w-sm">Completed sales will appear here for your accounting and records.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
