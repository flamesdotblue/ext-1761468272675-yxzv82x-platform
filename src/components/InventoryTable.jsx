import { useMemo } from 'react';

export default function InventoryTable({ inventory }) {
  const rows = useMemo(() => {
    const safe = Array.isArray(inventory) ? inventory : [];
    return safe
      .filter(r => r.qty !== 0)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [inventory]);

  const totalValue = useMemo(() => rows.reduce((sum, r) => sum + Math.max(0, r.qty) * (r.avgCost || 0), 0), [rows]);

  const downloadCSV = () => {
    const header = ['Item','Quantity','Avg Cost','Stock Value'];
    const lines = [header.join(',')];
    for (const r of rows) {
      const line = [
        '"' + r.name.replaceAll('"','""') + '"',
        r.qty,
        r.avgCost.toFixed(2),
        (Math.max(0, r.qty) * (r.avgCost || 0)).toFixed(2)
      ].join(',');
      lines.push(line);
    }
    lines.push(['TOTAL','','', totalValue.toFixed(2)].join(','));
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="inventory" className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Current Inventory</h2>
          <p className="mt-1 text-sm text-slate-500">Snapshot based on your Buy and Sell transactions.</p>
        </div>
        <button onClick={downloadCSV} className="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">Download CSV</button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2 pr-4">Item</th>
              <th className="py-2 pr-4">Quantity</th>
              <th className="py-2 pr-4">Avg Cost</th>
              <th className="py-2 pr-4">Stock Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-500">No inventory yet. Record a Buy transaction to add stock.</td>
              </tr>
            ) : (
              rows.map(r => (
                <tr key={r.name} className="border-t border-slate-100">
                  <td className="py-2 pr-4 font-medium text-slate-800">{r.name}</td>
                  <td className="py-2 pr-4">{r.qty}</td>
                  <td className="py-2 pr-4">${(r.avgCost || 0).toFixed(2)}</td>
                  <td className="py-2 pr-4">${(Math.max(0, r.qty) * (r.avgCost || 0)).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
          {rows.length > 0 && (
            <tfoot>
              <tr className="border-t border-slate-200 font-semibold text-slate-900">
                <td className="py-2 pr-4">Total</td>
                <td className="py-2 pr-4">{rows.reduce((s, r) => s + Math.max(0, r.qty), 0)}</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2 pr-4">${totalValue.toFixed(2)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
