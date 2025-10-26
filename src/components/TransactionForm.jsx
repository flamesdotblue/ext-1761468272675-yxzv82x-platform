import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

export default function TransactionForm({ itemNames, onAdd }) {
  const [type, setType] = useState('Buy');
  const [item, setItem] = useState('');
  const [customItem, setCustomItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [note, setNote] = useState('');

  const finalItem = useMemo(() => {
    return item === '__new__' ? customItem.trim() : item;
  }, [item, customItem]);

  const canSubmit = useMemo(() => {
    const q = Number(quantity);
    const p = Number(price);
    return finalItem && q > 0 && p >= 0 && date;
  }, [finalItem, quantity, price, date]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const payload = {
      type,
      item: finalItem,
      quantity: Number(quantity),
      price: Number(price),
      date: new Date(date).toISOString(),
      note: note.trim()
    };
    onAdd(payload);
    // reset minimal
    if (item === '__new__') {
      setItem(finalItem);
    }
    setQuantity('');
    setPrice('');
    setNote('');
  };

  return (
    <div id="transactions" className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
      <h2 className="text-lg font-semibold text-slate-900">Record a Transaction</h2>
      <p className="mt-1 text-sm text-slate-500">Add a buy or sell entry. This updates your cashflow and inventory.</p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full rounded-md border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-slate-200">
              <option>Buy</option>
              <option>Sell</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Date & time</label>
            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-md border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-slate-200" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600">Item</label>
          <div className="mt-1 grid grid-cols-1 gap-2">
            <select value={item} onChange={(e) => setItem(e.target.value)} className="w-full rounded-md border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-slate-200">
              <option value="">Select item</option>
              <option value="__new__">+ Add new item</option>
              {itemNames.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            {item === '__new__' && (
              <input value={customItem} onChange={(e) => setCustomItem(e.target.value)} placeholder="Enter new item name" className="w-full rounded-md border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-slate-200" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600">Quantity</label>
            <input type="number" min="0" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className="mt-1 w-full rounded-md border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-slate-200" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Price per unit</label>
            <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="mt-1 w-full rounded-md border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-slate-200" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600">Note</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional: supplier, reason, etc." className="mt-1 w-full rounded-md border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-slate-200" />
        </div>

        <button disabled={!canSubmit} className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white ${canSubmit ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-300 cursor-not-allowed'}`}>
          <Plus className="h-4 w-4" /> Add Transaction
        </button>
      </form>
    </div>
  );
}
