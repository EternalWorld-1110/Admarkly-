import { useState, useMemo, useEffect } from "react";
import { fmt } from "../data/cars";
import { Calculator, Sparkles, Check, Link, Link2Off, Percent, Calendar } from "lucide-react";
import { motion } from "motion/react";

interface GrowwEMICalculatorProps {
  carPrice: number;
  carName?: string;
  fuelType?: string;
}

export default function GrowwEMICalculator({ carPrice, carName, fuelType }: GrowwEMICalculatorProps) {
  // Sync Status: users can unlink to calculate general car loans
  const [isSynced, setIsSynced] = useState<boolean>(true);

  // Core Calculator States
  const [manualLoanAmount, setManualLoanAmount] = useState<number>(1000000);
  const [downPayment, setDownPayment] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(9.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  // If synced with current configuration, loan amount is: carPrice - downPayment
  const activeLoanAmount = useMemo(() => {
    if (isSynced && carPrice > 0) {
      return Math.max(0, carPrice - downPayment);
    }
    return manualLoanAmount;
  }, [isSynced, carPrice, downPayment, manualLoanAmount]);

  // Adjust down payment slider max dynamically if selected
  const maxDownpaymentAllowed = useMemo(() => {
    return carPrice > 0 ? carPrice : 5000000;
  }, [carPrice]);

  // Handle auto-syncing down payment initial values
  useEffect(() => {
    if (carPrice > 0 && isSynced) {
      // Set default starting downpayment to ~20% of on-road price
      const suggestedDownPayment = Math.round((carPrice * 0.20) / 10000) * 10000;
      setDownPayment(suggestedDownPayment);
    }
  }, [carPrice, isSynced]);

  // Groww high-accuracy math
  const calculations = useMemo(() => {
    const P = activeLoanAmount;
    const AnnualRate = interestRate;
    const N = tenureYears * 12; // Total months

    const r = AnnualRate / 12 / 100; // Monthly interest rate

    let monthlyEMI = 0;
    if (P > 0) {
      if (r > 0) {
        monthlyEMI = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
      } else {
        monthlyEMI = P / N;
      }
    }

    const totalRepayment = monthlyEMI * N;
    const totalInterest = Math.max(0, totalRepayment - P);

    return {
      monthlyEMI: Math.round(monthlyEMI),
      principal: P,
      interest: Math.round(totalInterest),
      totalPayable: Math.round(totalRepayment)
    };
  }, [activeLoanAmount, interestRate, tenureYears]);

  // SVG circular calculations
  const chartPercentage = useMemo(() => {
    const total = calculations.principal + calculations.interest;
    if (total === 0) return { principal: 100, interest: 0 };
    const pPercent = (calculations.principal / total) * 100;
    const iPercent = 100 - pPercent;
    return {
      principal: Math.round(pPercent * 10) / 10,
      interest: Math.round(iPercent * 10) / 10
    };
  }, [calculations]);

  const strokeDasharray = 251.2; // 2 * pi * r (r=40)
  const principalOffset = strokeDasharray - (strokeDasharray * chartPercentage.principal) / 100;

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden space-y-6">
      {/* Background decorations */}
      <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 -translate-x-12 translate-y-12 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-zinc-900 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-display font-black text-sm tracking-wide text-zinc-100 flex items-center gap-2">
              GROWW HIGH-PRECISION EMI CALCULATOR
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase tracking-wider">
              Standard reducing balance formula • Live interactive ledger
            </p>
          </div>
        </div>

        {/* Sync Mode Toggle Button wrapper */}
        {carPrice > 0 ? (
          <button
            type="button"
            onClick={() => setIsSynced(!isSynced)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase font-mono font-bold tracking-wider transition-all duration-300 ${
              isSynced
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-300"
            }`}
          >
            {isSynced ? (
              <>
                <Link className="w-3 h-3" />
                Synced: {carName}
              </>
            ) : (
              <>
                <Link2Off className="w-3 h-3 text-zinc-500" />
                Independent Mode
              </>
            )}
          </button>
        ) : (
          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            Independent Mode
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column: Range & input sliders */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Sync or Manual Loan slider block */}
          {isSynced && carPrice > 0 ? (
            /* Synced downpayment control */
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 font-bold">
                  Margin Down Payment (₹)
                </label>
                <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 text-xs font-mono">₹</span>
                  <input
                    type="number"
                    value={downPayment}
                    min={0}
                    max={maxDownpaymentAllowed}
                    step={10000}
                    onChange={(e) => {
                      const val = Math.min(maxDownpaymentAllowed, Math.max(0, Number(e.target.value)));
                      setDownPayment(val);
                    }}
                    className="bg-transparent text-zinc-200 text-xs text-right font-mono font-bold focus:outline-none w-28"
                  />
                </div>
              </div>
              <input
                type="range"
                min="0"
                max={maxDownpaymentAllowed}
                step="10000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 accent-emerald-500 rounded-lg cursor-pointer transition-all"
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                <span>Min: ₹0</span>
                <span>Active Loan Principal: {fmt(activeLoanAmount)}</span>
                <span>Max: {fmt(maxDownpaymentAllowed)}</span>
              </div>
            </div>
          ) : (
            /* Independent Loan Amount controller */
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 font-bold">
                  Car Loan Amount (₹)
                </label>
                <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 text-xs font-mono">₹</span>
                  <input
                    type="number"
                    value={manualLoanAmount}
                    min={50000}
                    max={10000000}
                    step={10000}
                    onChange={(e) => {
                      const val = Math.min(10000000, Math.max(50000, Number(e.target.value)));
                      setManualLoanAmount(val);
                    }}
                    className="bg-transparent text-zinc-200 text-xs text-right font-mono font-bold focus:outline-none w-28"
                  />
                </div>
              </div>
              <input
                type="range"
                min="50000"
                max="5000000"
                step="10000"
                value={manualLoanAmount}
                onChange={(e) => setManualLoanAmount(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 accent-emerald-500 rounded-lg cursor-pointer transition-all"
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                <span>Min: ₹50K</span>
                <span>Max: ₹50L</span>
              </div>
            </div>
          )}

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 font-bold flex items-center gap-1">
                <Percent className="w-3 h-3 text-zinc-500" />
                Rate of Interest (% p.a.)
              </label>
              <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
                <input
                  type="number"
                  value={interestRate}
                  step={0.1}
                  min={1}
                  max={30}
                  onChange={(e) => {
                    const val = Math.min(30, Math.max(0.1, Number(e.target.value)));
                    setInterestRate(val);
                  }}
                  className="bg-transparent text-zinc-200 text-xs text-right font-mono font-bold focus:outline-none w-14"
                />
                <span className="text-zinc-500 text-xs font-mono">%</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="0.05"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 accent-emerald-500 rounded-lg cursor-pointer transition-all"
            />
            <div className="flex justify-between text-[9px] font-mono text-zinc-600">
              <span>1.0%</span>
              <span>12.5%</span>
              <span>25.0%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-zinc-500" />
                Loan Tenure (Years)
              </label>
              <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
                <input
                  type="number"
                  value={tenureYears}
                  min={1}
                  max={10}
                  step={1}
                  onChange={(e) => {
                    const val = Math.min(10, Math.max(1, Number(e.target.value)));
                    setTenureYears(val);
                  }}
                  className="bg-transparent text-zinc-200 text-xs text-right font-mono font-bold focus:outline-none w-10"
                />
                <span className="text-zinc-500 text-xs font-mono">Yrs</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 accent-emerald-500 rounded-lg cursor-pointer transition-all"
            />
            <div className="flex justify-between text-[9px] font-mono text-zinc-600">
              <span>1 Year</span>
              <span>3 Years</span>
              <span>5 Years</span>
              <span>8 Years</span>
              <span>10 Years</span>
            </div>
          </div>

        </div>

        {/* Right column: Donut proportions chart and calculated stats with green/custom aesthetic */}
        <div className="lg:col-span-5 bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl flex flex-col md:flex-row lg:flex-col items-center justify-between gap-6">
          
          {/* Radial Donut segment */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background ring */}
              <circle
                cx="72"
                cy="72"
                r="40"
                className="stroke-zinc-800 fill-none"
                strokeWidth="12"
              />
              {/* Interest payment track */}
              <circle
                cx="72"
                cy="72"
                r="40"
                className="stroke-indigo-600 fill-none transition-all duration-300"
                strokeWidth="12"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={0}
              />
              {/* Principal layer overlay track */}
              <circle
                cx="72"
                cy="72"
                r="40"
                className="stroke-emerald-400 fill-none transition-all duration-300"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={principalOffset}
              />
            </svg>
            
            {/* Center Label */}
            <div className="absolute text-center">
              <span className="text-[8px] uppercase tracking-wider font-mono text-zinc-500 block">Monthly EMI</span>
              <span className="text-sm font-mono font-black text-zinc-100">{fmt(calculations.monthlyEMI)}</span>
            </div>
          </div>

          {/* Numeric Ledger details */}
          <div className="flex-1 w-full space-y-3.5 text-xs text-zinc-400">
            {/* Principal line */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full inline-block" />
                <span>Principal Amount:</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-zinc-200 font-bold block">{fmt(calculations.principal)}</span>
                <span className="text-[9px] text-zinc-500 font-mono">({chartPercentage.principal}%)</span>
              </div>
            </div>

            {/* Interest Payable line */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full inline-block" />
                <span>Int. Payable:</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-zinc-200 font-bold block">{fmt(calculations.interest)}</span>
                <span className="text-[9px] text-zinc-500 font-mono">({chartPercentage.interest}%)</span>
              </div>
            </div>

            {/* Divider line */}
            <div className="border-t border-zinc-800" />

            {/* Total Payable */}
            <div className="flex items-center justify-between pt-0.5 text-sm">
              <span className="font-mono text-zinc-300 uppercase tracking-wider text-[10px] font-bold">Total Payable:</span>
              <span className="font-mono font-black text-emerald-400">{fmt(calculations.totalPayable)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
