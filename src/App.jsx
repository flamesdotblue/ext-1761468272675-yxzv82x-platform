import { useEffect, useMemo, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, DollarSign } from 'lucide-react';
import Hero from './components/Hero';
import TransactionForm from './components/TransactionForm';
import InventoryTable from './components/InventoryTable';
import TransactionsList from './components/TransactionsList';

function seedTransactions() {
  const seed = [
    { id: crypto.randomUUID(), type: 'Buy', item: 'Milk 1L', quantity: 50, price: 0.7, date: new Date(Date.now() - 86400000 * 5).toISOString(), note: 'Supplier: DairyCo' },
    { id: crypto.randomUUID(), type: 'Buy', item: 'Bread Loaf', quantity: 40, price: 0.5, date: new Date(Date.now() - 86400000 * 4).toISOString(), note: 'Supplier: Bakery' },
    { id: crypto.randomUUID(), type: 'Sell', item: 'Milk 1L', quantity: 20, price: 1.1, date: new Date(Date.now() - 86400000 * 3).toISOString(), note: 'Morning sales' },
    { id: crypto.randomUUID(), type: 'Sell', item: 'Bread Loaf', quantity: 15, price: 0.9, date: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Evening peak' },
    { id: crypto.randomUUID(), type: 'Buy', item: 'Eggs (dozen)', quantity: 30, price: 1.2, date: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Supplier: FarmFresh' },
    { id: crypto.randomUUID(), type: 'Sell', item: 'Eggs (dozen)', quantity: 10, price: 2.0, date: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'Weekend rush' }
  ];
  return seed;
}

export default function App() {
  const [transactions, setTransactions] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const raw = localStorage.getItem('shopkeeper:transactions');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setTransactions(parsed);
      } catch (e) {
        console.error('Failed to parse transactions, seeding defaults', e);
        const seeded = seedTransactions();
        setTransactions(seeded);
        localStorage.setItem('shopkeeper:transactions', JSON.stringify(seeded));
      }
    } else {
      const seeded = seedTransactions();
      setTransactions(seeded);
      localStorage.setItem('shopkeeper:transactions', JSON.stringify(seeded));
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('shopkeeper:transactions', JSON.stringify(transactions));
  }, [transactions]);

  const itemNames = useMemo(() => {
    const set = new Set(transactions.map(t => t.item));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [transactions]);

  // Compute KPIs and inventory snapshot from transactions
  const { revenue, expenses, profit, inventory, inventoryValue, topItem } = useMemo(() => {
    const invMap = new Map();
    let revenueSum = 0;
    let expenseSum = 0;

    // For avg cost, track total units bought and total cost per item
    const buyAgg = new Map();

    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    for (const t of sorted) {
      const name = t.item;
      if (!invMap.has(name)) invMap.set(name, { qty: 0, avgCost: 0 });

      if (t.type === 'Buy') {
        expenseSum += t.quantity * t.price;
        const prevBuy = buyAgg.get(name) || { units: 0, cost: 0 };
        const newUnits = prevBuy.units + t.quantity;
        const newCost = prevBuy.cost + t.quantity * t.price;
        buyAgg.set(name, { units: newUnits, cost: newCost });
        const avgCost = newUnits > 0 ? newCost / newUnits : 0;
        const rec = invMap.get(name);
        rec.qty += t.quantity;
        rec.avgCost = avgCost;
        invMap.set(name, rec);
      } else if (t.type === 'Sell') {
        revenueSum += t.quantity * t.price;
        const rec = invMap.get(name);
        rec.qty -= t.quantity;
        // avgCost remains last known avg of buys
        invMap.set(name, rec);
      }
    }

    // Compute inventory value and top item by revenue
    let invValue = 0;
    const revenueByItem = new Map();
    for (const [name, rec] of invMap) {
      invValue += Math.max(0, rec.qty) * (rec.avgCost || 0);
    }
    for (const t of sorted) {
      if (t.type === 'Sell') {
        revenueByItem.set(t.item, (revenueByItem.get(t.item) || 0) + t.quantity * t.price);
      }
    }
    let top = null;
    for (const [name, rev] of revenueByItem) {
      if (!top || rev > top.revenue) top = { name, revenue: rev };
    }

    const inventoryArr = Array.from(invMap.entries()).map(([name, rec]) => ({ name, ...rec }));

    return {
      revenue: revenueSum,
      expenses: expenseSum,
      profit: revenueSum - expenseSum,
      inventory: inventoryArr,
      inventoryValue: invValue,
      topItem: top
    };
  }, [transactions]);

  const handleAddTransaction = (t) => {
    setTransactions(prev => [{ ...t, id: crypto.randomUUID() }, ...prev]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('This will delete all transactions. Continue?')) {
      setTransactions([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Hero />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20 pb-24">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Revenue</p>
              <ArrowUpCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900">${revenue.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Expenses</p>
              <ArrowDownCircle className="h-5 w-5 text-rose-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900">${expenses.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Profit</p>
              <DollarSign className={"h-5 w-5 " + (profit >= 0 ? 'text-emerald-500' : 'text-rose-500')} />
            </div>
            <p className={"mt-2 text-2xl font-semibold " + (profit >= 0 ? 'text-emerald-600' : 'text-rose-600')}>{profit >= 0 ? '+' : ''}${profit.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Inventory Value</p>
              <DollarSign className="h-5 w-5 text-indigo-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900">${inventoryValue.toFixed(2)}</p>
            {topItem && (
              <p className="mt-1 text-xs text-slate-500">Top seller: <span className="font-medium text-slate-700">{topItem.name}</span> (${topItem.revenue.toFixed(2)})</p>
            )}
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TransactionForm itemNames={itemNames} onAdd={handleAddTransaction} />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-slate-500">Data is saved locally in your browser.</p>
              <button onClick={handleClearAll} className="text-xs text-rose-600 hover:text-rose-700">Clear all</button>
            </div>
          </div>
          <div className="lg:col-span-2">
            <InventoryTable inventory={inventory} />
          </div>
        </section>

        <section className="mt-10">
          <TransactionsList transactions={transactions} onDelete={handleDeleteTransaction} />
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between">
          <p>Local Shop Keeper Dashboard</p>
          <p>Built with React + Tailwind</p>
        </div>
      </footer>
    </div>
  );
}
