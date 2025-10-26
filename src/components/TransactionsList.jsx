import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function TransactionsList({ transactions, onDelete }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions
      .filter(t => (type === 'All' ? true : t.type === type))
      .filter(t => (q ? (t.item.toLowerCase().includes(q) || (t.note || '').toLowerCase().includes(q)) : true));
  }, [transactions, query, type]);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Transactions</h2>
          <p className="mt-1 text-sm text-slate-500">History of what you bought and sold.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-md border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-slate-200">
            <option>All</option>
            <option>Buy</option>
            <option>Sell</option>
          </select>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search item or note" className="rounded-md border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-slate-200" />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">Item</th>
              <th className="py-2 pr-4">Qty</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Note</th>
              <th className="py-2 pl-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-500">No transactions yet.</td>
              </tr>
            ) : (
              filtered.map(t => {
                const total = t.quantity * t.price;
                const dateStr = new Date(t.date).toLocaleString();
                const amountClass = t.type === 'Sell' ? 'text-emerald-600' : 'text-rose-600';
                const sign = t.type === 'Sell' ? '+' : '-';
                return (
                  <tr key={t.id} className="border-t border-slate-100">
                    <td className="py-2 pr-4 whitespace-nowrap">{dateStr}</td>
                    <td className="py-2 pr-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${t.type === 'Sell' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' : 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'}`}>{t.type}</span>
                    </td>
                    <td className="py-2 pr-4 font-medium text-slate-800">{t.item}</td>
                    <td className="py-2 pr-4">{t.quantity}</td>
                    <td className="py-2 pr-4">${t.price.toFixed(2)}</td>
                    <td className={`py-2 pr-4 font-medium ${amountClass}`}>{sign}${total.toFixed(2)}</td>
                    <td className="py-2 pr-4 text-slate-500">{t.note || '—'}</td>
                    <td className="py-2 pl-2 text-right">
                      <button onClick={() => onDelete(t.id)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-rose-600 hover:bg-rose-50">
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
