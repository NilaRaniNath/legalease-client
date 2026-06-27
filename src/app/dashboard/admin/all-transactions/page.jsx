import { DollarSign, Calendar } from "lucide-react";

async function getTransactions() {
  try {
    const res = await fetch("http://localhost:8000/api/transactions", { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.transactions : [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function AllTransactionsPage() {
  const transactions = await getTransactions();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-white text-left">
      <div className="flex items-center gap-2">
        <DollarSign className="text-emerald-500 w-6 h-6" />
        <h2 className="text-2xl font-bold">All Financial Transactions</h2>
      </div>

      <div className="bg-[#152238] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-[#0B1524] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Transaction ID</th>
                <th className="px-6 py-4 font-semibold">Payer Email</th>
                <th className="px-6 py-4 font-semibold">Purpose</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transactions.map((tx) => (
                <tr key={tx._id.toString()} className="hover:bg-[#1a2942] transition-colors">
                  <td className="px-6 py-4 font-mono text-amber-500 text-xs font-semibold">{tx.transactionId}</td>
                  <td className="px-6 py-4 text-slate-300">{tx.userEmail}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">{tx.purpose || "N/A"}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">${tx.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs text-slate-400 inline-flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-500" />
                      {new Date(tx.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}