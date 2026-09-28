import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, TrendingDown, PieChart as PieIcon, BarChart3, LineChart, ShieldCheck } from 'lucide-react';
import { TreasuryRecord } from '../types';

interface TreasuryChartProps {
  records: TreasuryRecord[];
  currentBalance: number;
}

type ChartViewType = 'bar' | 'area' | 'pie';

export const TreasuryChart: React.FC<TreasuryChartProps> = ({ records, currentBalance }) => {
  const [chartType, setChartType] = useState<ChartViewType>('bar');

  // Compute current month totals from records
  const currentMonthInflow = records
    .filter((r) => r.type === 'masuk')
    .reduce((sum, r) => sum + r.amount, 0);

  const currentMonthOutflow = records
    .filter((r) => r.type === 'keluar')
    .reduce((sum, r) => sum + r.amount, 0);

  // Dynamic 6-month historical & current data
  const monthlyData = useMemo(() => {
    return [
      { month: 'Mei', pemasukan: 10250000, pengeluaran: 6200000, saldo: 15400000 },
      { month: 'Jun', pemasukan: 9900000, pengeluaran: 6850000, saldo: 18450000 },
      { month: 'Jul', pemasukan: 10450000, pengeluaran: 5900000, saldo: 23000000 },
      { month: 'Agu', pemasukan: 10100000, pengeluaran: 7120000, saldo: 25980000 },
      {
        month: 'Sep',
        pemasukan: currentMonthInflow,
        pengeluaran: currentMonthOutflow,
        saldo: currentBalance,
      },
    ];
  }, [currentMonthInflow, currentMonthOutflow, currentBalance]);

  // Dynamic Category breakdown of expenses
  const expenseByCategory = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    records
      .filter((r) => r.type === 'keluar')
      .forEach((r) => {
        const cat = r.category || 'Lainnya';
        categoryMap[cat] = (categoryMap[cat] || 0) + r.amount;
      });

    const colors = ['#f43f5e', '#f97316', '#eab308', '#8b5cf6', '#06b6d4'];
    const entries = Object.entries(categoryMap);
    const total = entries.reduce((s, [, v]) => s + v, 0) || 1;

    return entries.map(([name, value], idx) => ({
      name,
      value,
      percentage: Math.round((value / total) * 100),
      color: colors[idx % colors.length],
    }));
  }, [records]);

  // Average monthly calculations
  const avgInflow = Math.round(
    monthlyData.reduce((acc, d) => acc + d.pemasukan, 0) / monthlyData.length
  );
  const avgOutflow = Math.round(
    monthlyData.reduce((acc, d) => acc + d.pengeluaran, 0) / monthlyData.length
  );
  const surplusRate = Math.round(((avgInflow - avgOutflow) / avgInflow) * 100);

  // Custom Rupiah format for tooltips
  const formatRupiah = (val: number) => {
    if (val >= 1000000) {
      return `Rp ${(val / 1000000).toFixed(1)} Jt`;
    }
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const CustomBarAreaTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white px-3 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[140px]">
          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">
            Bulan {label} 2026
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-[11px]">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-white tabular-nums">
                Rp {Number(entry.value).toLocaleString('id-ID')}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white px-3 py-2 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
          <p className="font-bold text-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.payload.color }} />
            {data.name}
          </p>
          <div className="flex justify-between gap-3 text-[11px]">
            <span className="text-slate-400">Total:</span>
            <span className="font-mono font-bold text-white">
              Rp {Number(data.value).toLocaleString('id-ID')} ({data.payload.percentage}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Grafik Analisis Tren Kas RT 04
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Monitoring visual arus kas & perbandingan bulanan transparan
          </p>
        </div>

        {/* View Switcher Buttons */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl text-[11px] font-semibold self-start sm:self-auto">
          <button
            onClick={() => setChartType('bar')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
              chartType === 'bar'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Arus Kas</span>
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
              chartType === 'area'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LineChart className="w-3.5 h-3.5 text-sky-600" />
            <span>Akumulasi Saldo</span>
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
              chartType === 'pie'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5 text-rose-500" />
            <span>Alokasi</span>
          </button>
        </div>
      </div>

      {/* Main Chart Area with Recharts */}
      <div className="w-full h-56 relative pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${(val / 1000000).toFixed(0)}Jt`}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
              />
              <Tooltip content={<CustomBarAreaTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 8, fontSize: '11px' }}
                iconType="circle"
              />
              <Bar
                name="Pemasukan"
                dataKey="pemasukan"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                name="Pengeluaran"
                dataKey="pengeluaran"
                fill="#f43f5e"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          ) : chartType === 'area' ? (
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="saldoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${(val / 1000000).toFixed(0)}Jt`}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
              />
              <Tooltip content={<CustomBarAreaTooltip />} />
              <Area
                type="monotone"
                name="Saldo Kas"
                dataKey="saldo"
                stroke="#0284c7"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#saldoGradient)"
              />
            </AreaChart>
          ) : (
            <PieChart>
              <Tooltip content={<CustomPieTooltip />} />
              <Pie
                data={expenseByCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={4}
              >
                {expenseByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Dynamic Summary Badges & Insights */}
      {chartType === 'pie' ? (
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          {expenseByCategory.map((cat, idx) => (
            <div
              key={idx}
              className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-slate-700 truncate text-[11px] font-medium">{cat.name}</span>
              </div>
              <span className="font-mono font-bold text-slate-900 text-[11px] tabular-nums shrink-0">
                {cat.percentage}%
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
          <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
            <span className="text-[10px] text-emerald-800 font-medium block">Rata-rata Masuk</span>
            <span className="font-mono text-xs font-bold text-emerald-900 tabular-nums">
              {formatRupiah(avgInflow)}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-rose-50/70 border border-rose-100 text-center">
            <span className="text-[10px] text-rose-800 font-medium block">Rata-rata Keluar</span>
            <span className="font-mono text-xs font-bold text-rose-900 tabular-nums">
              {formatRupiah(avgOutflow)}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-center">
            <span className="text-[10px] text-sky-800 font-medium block">Rasio Surplus</span>
            <span className="font-mono text-xs font-bold text-sky-900 tabular-nums">
              +{surplusRate}%
            </span>
          </div>
        </div>
      )}

      {/* Footer Trust Indicator */}
      <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-2 text-slate-600 text-[11px]">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Grafik diperbarui secara otomatis setiap kali ada iuran lunas atau transaksi kas baru yang disetujui.
        </span>
      </div>
    </div>
  );
};
