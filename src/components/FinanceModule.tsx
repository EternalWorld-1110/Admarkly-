import { useState, useEffect, useMemo, FormEvent } from "react";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Calculator, 
  UserCheck, 
  FileText, 
  Share2, 
  Plus, 
  Trash2, 
  AlertCircle, 
  ArrowRight, 
  Smartphone, 
  Briefcase, 
  Building2, 
  BookOpen, 
  Search, 
  MessageCircle,
  Database,
  RefreshCw,
  Sparkles,
  PhoneCall
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  getFinanceLeads, 
  addFinanceLead, 
  updateFinanceLead, 
  deleteFinanceLead,
  getFirestoreActiveState
} from "../firebase";
import { FinanceLead, FinanceStatus, CarKey } from "../types";
import { CARS, fmt, fmtShort } from "../data/cars";

interface FinanceModuleProps {
  initialCarKey?: string;
  initialVariantName?: string;
  initialOnRoadPrice?: number;
  initialCustomerName?: string;
  initialCustomerPhone?: string;
}

export default function FinanceModule({ 
  initialCarKey = "", 
  initialVariantName = "", 
  initialOnRoadPrice = 0,
  initialCustomerName = "",
  initialCustomerPhone = ""
}: FinanceModuleProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<"dashboard" | "emi" | "eligibility" | "documents">("dashboard");

  // Database state
  const [leads, setLeads] = useState<FinanceLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isLive, setIsLive] = useState(false);

  // Search and Filter leads state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Lead Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCarKey, setFormCarKey] = useState<CarKey | "HARRIER">("HARRIER");
  const [formVariant, setFormVariant] = useState("");
  const [formEmi, setFormEmi] = useState(25000);
  const [formDownPayment, setFormDownPayment] = useState(200000);
  const [formStatus, setFormStatus] = useState<FinanceStatus>("Documents Pending");
  const [formFollowup, setFormFollowup] = useState("");

  // EMI Calculator states
  const [calcCar, setCalcCar] = useState<string>(initialCarKey || "HARRIER");
  const [calcVariantName, setCalcVariantName] = useState<string>(initialVariantName || "");
  const [calcOnRoad, setCalcOnRoad] = useState<number>(initialOnRoadPrice || 2350000);
  const [calcDownpayment, setCalcDownpayment] = useState<number>(initialOnRoadPrice ? Math.round(initialOnRoadPrice * 0.20) : 450000);
  const [calcRate, setCalcRate] = useState<number>(8.75);
  const [calcTenure, setCalcTenure] = useState<number>(5); // years
  const [showAmortization, setShowAmortization] = useState<boolean>(false);
  const [hoveredSegment, setHoveredSegment] = useState<"principal" | "interest" | null>(null);
  const [selectedBankKey, setSelectedBankKey] = useState<string>("SBI");
  const [calcCustomerName, setCalcCustomerName] = useState<string>(initialCustomerName || "");
  const [calcCustomerPhone, setCalcCustomerPhone] = useState<string>(initialCustomerPhone || "");

  // Eligibility states
  const [income, setIncome] = useState<number>(80000);
  const [existingEmi, setExistingEmi] = useState<number>(10000);
  const [empType, setEmpType] = useState<"salaried" | "self_employed">("salaried");
  const [cibil, setCibil] = useState<number>(750) ;
  const [eligibilityDownpayment, setEligibilityDownpayment] = useState<number>(200000);

  // Documents Required state
  const [docTab, setDocTab] = useState<"salaried" | "self_employed" | "proprietor" | "partnership" | "pvt_ltd">("salaried");

  // Messages / Toast feedback
  const [toastMsg, setToastMsg] = useState("");

  // Get all variants flat for selected calcCar
  const calcCarVariants = useMemo(() => {
    const carObj = CARS[calcCar as CarKey];
    if (!carObj || !carObj.variants) return [];
    
    const flatList: Array<{ name: string; onroad: number; transmission: string }> = [];
    Object.entries(carObj.variants).forEach(([transmission, variantList]) => {
      if (Array.isArray(variantList)) {
        variantList.forEach((v) => {
          flatList.push({
            name: v.name,
            onroad: v.onroad,
            transmission
          });
        });
      }
    });
    return flatList;
  }, [calcCar]);

  // Handle auto-populations on mount or initial prop changes
  useEffect(() => {
    if (initialCarKey) {
      setCalcCar(initialCarKey);
      setFormCarKey(initialCarKey as CarKey);
    }
    if (initialOnRoadPrice) {
      setCalcOnRoad(initialOnRoadPrice);
      setCalcDownpayment(Math.round(initialOnRoadPrice * 0.20));
    }
    if (initialVariantName) {
      setCalcVariantName(initialVariantName);
      setFormVariant(initialVariantName);
    }
    if (initialCustomerName) {
      setCalcCustomerName(initialCustomerName);
    }
    if (initialCustomerPhone) {
      setCalcCustomerPhone(initialCustomerPhone);
    }
  }, [initialCarKey, initialVariantName, initialOnRoadPrice, initialCustomerName, initialCustomerPhone]);

  // Fetch Leads on load
  const loadLeads = async () => {
    setLoading(true);
    try {
      const fetched = await getFinanceLeads();
      setLeads(fetched);
      setIsLive(getFirestoreActiveState());
    } catch (e) {
      console.error(e);
      showToast("Error reading lead data. Using local storage.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const triggerSync = async () => {
    setSyncing(true);
    await loadLeads();
    setTimeout(() => {
      setSyncing(false);
      showToast("Database Synced Successfully");
    }, 600);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg("");
    }, 4000);
  };

  // Live EMI Calculation logic
  const calculatedLoanAmount = useMemo(() => {
    return Math.max(0, calcOnRoad - calcDownpayment);
  }, [calcOnRoad, calcDownpayment]);

  const calculatedMonthlyEmi = useMemo(() => {
    const loan = calculatedLoanAmount;
    if (loan <= 0) return 0;
    const r = (calcRate / 100) / 12;
    const n = calcTenure * 12;
    if (r === 0) return Math.round(loan / n);
    const emiFn = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emiFn);
  }, [calculatedLoanAmount, calcRate, calcTenure]);

  const totalPayableWithInterest = useMemo(() => {
    const months = calcTenure * 12;
    return calculatedMonthlyEmi * months;
  }, [calculatedMonthlyEmi, calcTenure]);

  const totalInterestPaid = useMemo(() => {
    return Math.max(0, totalPayableWithInterest - calculatedLoanAmount);
  }, [totalPayableWithInterest, calculatedLoanAmount]);

  // Amortization schedule calculator
  const amortizationSchedule = useMemo(() => {
    const schedule = [];
    let remainingBalance = calculatedLoanAmount;
    const monthlyRate = (calcRate / 100) / 12;
    const totalMonths = calcTenure * 12;
    const emi = calculatedMonthlyEmi;

    if (remainingBalance <= 0 || emi <= 0) return [];

    for (let year = 1; year <= calcTenure; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      const openingBalance = remainingBalance;

      for (let month = 1; month <= 12; month++) {
        const currentMonthIndex = (year - 1) * 12 + month;
        if (currentMonthIndex > totalMonths) break;

        const interestForMonth = remainingBalance * monthlyRate;
        let principalForMonth = emi - interestForMonth;

        if (principalForMonth > remainingBalance) {
          principalForMonth = remainingBalance;
        }

        yearlyPrincipal += principalForMonth;
        yearlyInterest += interestForMonth;
        remainingBalance -= principalForMonth;
      }

      schedule.push({
        year,
        openingBalance: Math.round(openingBalance),
        principalPaid: Math.round(yearlyPrincipal),
        interestPaid: Math.round(yearlyInterest),
        totalPaid: Math.round(yearlyPrincipal + yearlyInterest),
        endingBalance: Math.round(Math.max(0, remainingBalance)),
      });
    }
    return schedule;
  }, [calculatedLoanAmount, calcRate, calcTenure, calculatedMonthlyEmi]);


  // Eligibility Calculation Logic
  const eligibilityResult = useMemo(() => {
    // Basic standard Indian banking formula: FOIR (Fixed Obligation to Income Ratio)
    // Max FOIR allowed based on monthly income:
    // Income < 50k: 45%, 50k-100k: 50%, > 100k: 55%
    let foirMax = 0.50;
    if (income < 50000) foirMax = 0.45;
    if (income > 100000) foirMax = 0.55;

    // Adjusted Max EMI based on current Income & Existing EMI obligations
    const rawMaxEmi = (income * foirMax) - existingEmi;
    const maxEmi = Math.max(0, rawMaxEmi);

    // CIBIL Multiplier
    let cibilFactor = 1.0;
    let rank: "Strong Eligibility" | "Moderate Eligibility" | "Low Eligibility" = "Low Eligibility";
    let colorClass = "text-red-600 bg-red-50 border-red-200";

    if (cibil >= 750) {
      rank = "Strong Eligibility";
      colorClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
      cibilFactor = 1.0;
    } else if (cibil >= 680) {
      rank = "Moderate Eligibility";
      colorClass = "text-amber-700 bg-amber-50 border-amber-205";
      cibilFactor = 0.8;
    } else {
      rank = "Low Eligibility";
      colorClass = "text-red-700 bg-red-50 border-red-200";
      cibilFactor = 0.4;
    }

    // Rate based on Cibil score
    const estRate = cibil >= 750 ? 8.65 : cibil >= 680 ? 9.50 : 11.5;
    const nMonths = 60; // Assume standard 5 years tenure for evaluation
    const rPerMonth = (estRate / 100) / 12;

    // Max loan formula based on permissible EMI
    let maxLoanAmount = 0;
    if (maxEmi > 0) {
      maxLoanAmount = Math.round((maxEmi * (Math.pow(1 + rPerMonth, nMonths) - 1)) / (rPerMonth * Math.pow(1 + rPerMonth, nMonths)) * cibilFactor);
    }

    return {
      rank,
      colorClass,
      maxEmi: Math.round(maxEmi),
      maxLoanAmount: Math.round(maxLoanAmount),
      suggestedOnRoadPrice: Math.round(maxLoanAmount + eligibilityDownpayment),
      estimatedRate: estRate
    };
  }, [income, existingEmi, cibil, eligibilityDownpayment]);


  // Add Lead Logic
  const handleCreateLead = async (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      showToast("Please provide customer name and mobile");
      return;
    }

    const payload = {
      customerName: formName,
      mobile: formPhone,
      vehicle: formCarKey,
      variant: formVariant || "Base Standard Variant",
      emi: formEmi,
      downPayment: formDownPayment,
      status: formStatus,
      followupDate: formFollowup || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    setLoading(true);
    try {
      const added = await addFinanceLead(payload);
      setLeads([added, ...leads]);
      setShowAddForm(false);
      // Reset form
      setFormName("");
      setFormPhone("");
      setFormVariant("");
      setFormFollowup("");
      showToast("Finance Lead Logged Successfully");
    } catch (e) {
      console.error(e);
      showToast("Failed to write lead to database.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: FinanceStatus) => {
    try {
      await updateFinanceLead(id, { status: newStatus });
      setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
      showToast(`Status updated to: ${newStatus}`);
    } catch (e) {
      console.error(e);
      showToast("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this finance file record?")) return;
    try {
      await deleteFinanceLead(id);
      setLeads(leads.filter(lead => lead.id !== id));
      showToast("Lead record deleted");
    } catch (e) {
      console.error(e);
      showToast("Delete failed");
    }
  };

  // WhatsApp Share Formatter
  const generateWhatsAppMsg = (lead: Omit<FinanceLead, 'id'> | FinanceLead) => {
    const text = `*TATA MOTORS DEALERSHIP FINANCE PROPOSAL* 🚗
----------------------------------
Dear *${lead.customerName} Sir*,

Based on our discussions for your selected *TATA ${lead.vehicle}* (Variant: _${lead.variant}_), here is your customized showroom direct loan summary:

🏦 *FINANCE MODEL SUMMARY*
• Estimated On-Road: *${fmt(lead.downPayment + (lead.emi * 60))}*
• Outflow Down Payment: *${fmt(lead.downPayment)}*
• Monthly EMI Estimation: *${fmt(lead.emi)}/month*
• Tenure Preference: *5 Years (60 Mos)*

📋 *REQUIRED VERIFICATION DOCUMENTS*
${empType === 'salaried' ? `• PAN Card & Aadhaar Card
• Last 3 Months Salary Slips
• Last 6 Months Bank Statement
• 2 Passport Photos` : `• Business GST Certificate
• Last 2 Years Income Tax Returns (ITR)
• Profit & Loss Balance Sheet
• Last 6 Months Current A/c Statement`}

We look forward to confirming your bank approval priority. Please reply to schedule your documentation pickup.

Best Regards,
_MAC Vehicles Dealership Hub Sales Team_
Nagpur`;
    return encodeURIComponent(text);
  };

  const triggerWhatsAppShare = (lead: FinanceLead) => {
    const msg = generateWhatsAppMsg(lead);
    const url = `https://api.whatsapp.com/send?phone=91${lead.mobile}&text=${msg}`;
    window.open(url, "_blank");
  };

  const triggerDirectCalculatorShare = (includeDocs = true) => {
    const carLabel = CARS[calcCar as CarKey]?.label || calcCar;
    const namePart = calcCustomerName ? `Dear *${calcCustomerName} Sir*,` : "Dear Valued Customer,";
    const variantPart = calcVariantName ? ` (${calcVariantName})` : "";
    
    let docsText = "";
    if (includeDocs) {
      if (docTab === "salaried") {
        docsText = `

🪪 *REQUIRED DOCUMENTS (SALARIED PROFILE)*:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Aadhaar & PAN Card (Mandatory)
• Last 3 Months Salary Slips
• Latest Form 16 / Income statements
• Last 6 Months Salary Bank statement
• 2 Passport Size Photos`;
      } else if (docTab === "self_employed") {
        docsText = `

📂 *REQUIRED DOCUMENTS (SELF EMPLOYED PROFILE)*:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Business GST Certificate & Shop License
• Last 2 Years ITR V acknowledgment copies
• Profit & Loss Statement & Audited Balance Sheets
• Last 6 Months Current & Savings Bank statements
• 2 Passport Size Photos`;
      } else if (docTab === "proprietor") {
        docsText = `

📃 *REQUIRED DOCUMENTS (PROPRIETORSHIP PROFILE)*:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Proprietorship PAN & GST Certificate Copy
• Shop Establishment License copy
• Last 2 Years ITR V acknowledgment & computation
• Last 12 Months Audited Current Bank Statements`;
      } else if (docTab === "partnership") {
        docsText = `

📜 *REQUIRED DOCUMENTS (PARTNERSHIP PROFILE)*:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Registered Partnership Deed Copy
• Firm PAN Card & GST Certificate Copy
• Last 2 Years Partnership Audited ITR V
• Last 12 Months Audited Current Bank Statements`;
      } else {
        docsText = `

🏢 *REQUIRED DOCUMENTS (PRIVATE LIMITED PROFILE)*:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Certificate of Incorporation (COI) & MOA/AOA
• Company PAN & GST Certificate Copy
• Board Resolution authorizing loan application
• Last 12 Months Audited Current Bank Statements
• Active directors signing authority Aadhaar`;
      }
    }

    const textMsg = `🚗 *TATA MOTORS — VEHICLE LOAN ESTIMATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${namePart}

Based on our discussions for your *TATA ${carLabel}${variantPart}*, here is your customized vehicle financing proposal configured live:

💰 *FINANCIAL DETAILS*
• Ex-Showroom + On-Road (Est): *${fmt(calcOnRoad)}*
• Margin Down Payment: *${fmt(calcDownpayment)}*
• Net Principal Financed: *${fmt(calculatedLoanAmount)}*

🏦 *EMI ESTIMATE*
• *Estimated Monthly EMI: ${fmt(calculatedMonthlyEmi)}/month*
• Active Interest Rate: *${calcRate}% p.a.*
• Chosen Tenure: *${calcTenure} Years (${calcTenure * 12} Mos)*

📊 *REPAYMENT INSIGHT*
• Total Borrow Outflow: *${fmt(totalPayableWithInterest)}*
• Cumulative Interest charges: *${fmt(totalInterestPaid)}*${docsText}

📋 _Monthly installments are estimated through standard retail auto financing schedules and are subject to underwriting guidelines._

Best Regards,
_MAC Vehicles Dealership Hub Sales Team_
Nagpur`;

    const encodedText = encodeURIComponent(textMsg);
    const cleanPh = calcCustomerPhone.replace(/\D/g, "");
    
    // If we have 10 digits, format with prefix. Otherwise, let user choose contacts in WhatsApp.
    const shareUrl = cleanPh.length >= 10
      ? `https://api.whatsapp.com/send?phone=91${cleanPh.slice(-10)}&text=${encodedText}`
      : `https://api.whatsapp.com/send?text=${encodedText}`;
      
    window.open(shareUrl, "_blank");
    showToast("Opening WhatsApp share window...");
  };

  // Stats Logic for Dashboard
  const stats = useMemo(() => {
    const total = leads.length;
    const approved = leads.filter(l => l.status === "Approved" || l.status === "Disbursed").length;
    const pendingDocs = leads.filter(l => l.status === "Documents Pending").length;
    
    // Check if followup is today or earlier (overdue or today)
    const todayStr = new Date().toISOString().split('T')[0];
    const followupsToday = leads.filter(l => l.followupDate <= todayStr && l.status !== "Disbursed" && l.status !== "Rejected").length;

    return { total, approved, pendingDocs, followupsToday };
  }, [leads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchesSearch = l.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            l.mobile.includes(searchTerm) || 
                            l.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  return (
    <div className="bg-[#F8FAFC] text-slate-800 rounded-3xl border border-slate-200/90 shadow-2xl p-6 md:p-8 space-y-6 select-none max-w-7xl mx-auto dynamic-container font-sans">
      
      {/* Toast Alert Feedback */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-10 right-10 z-50 bg-blue-900 text-white font-semibold text-xs py-3.5 px-6 rounded-2xl shadow-xl flex items-center gap-2 border border-blue-950"
          >
            <Sparkles className="w-4 h-4 text-blue-300 animate-pulse" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Module Title Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white font-mono text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded shadow-sm">
              Dealership Portal
            </span>
            <span className={`text-[10px] font-mono flex items-center gap-1 ${isLive ? "text-emerald-600" : "text-amber-600"}`}>
              <Database className="w-3 h-3" />
              {isLive ? "Cloud Live Sync Connected" : "Local Sandbox Environment"}
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            Finance & Loan Assistance System
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Seamless EMI calculators, pre-approval scoring matrices, compliance checklists, and real-time lead managers.
          </p>
        </div>

        {/* Database Toggle Refresh Trigger */}
        <button
          onClick={triggerSync}
          disabled={syncing}
          className="bg-white border border-slate-200/80 hover:border-slate-350 text-slate-600 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-xs hover:shadow-sm cursor-pointer transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? "Refreshing..." : "Sync Database"}
        </button>
      </div>

      {/* Primary Tab Bar Menu navigation */}
      <div className="flex flex-wrap gap-2.5 border-b border-slate-200/60 pb-3">
        {[
          { id: "dashboard", label: "Dashboard & Follow-ups", icon: Users },
          { id: "emi", label: "Dealership EMI Calc", icon: Calculator },
          { id: "eligibility", label: "Eligibility Checker", icon: UserCheck },
          { id: "documents", label: "Required Documents", icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
                isActive 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/15 scale-[1.02]" 
                  : "bg-slate-100/70 hover:bg-slate-200/60 text-slate-600 border border-transparent hover:border-slate-200/40"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* MAIN CONTAINER CONTENT VIEW */}
      <div>
        <AnimatePresence mode="wait">
          
          {/* TAB 1: DASHBOARD & LEADS */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Stat Cards Grid Column */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Total Finance Leads", value: stats.total, subtitle: "All Active Files", icon: Users, color: "bg-blue-50 text-blue-600 border-blue-100" },
                  { title: "Approved & Connected", value: stats.approved, subtitle: "Approved + Disbursed", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                  { title: "Pending KYC Files", value: stats.pendingDocs, subtitle: "Needs Documents", icon: Clock, color: "bg-amber-50 text-amber-600 border-amber-100" },
                  { title: "Action Scheduled Today", value: stats.followupsToday, subtitle: "Due Follow-ups Today", icon: Calendar, color: "bg-pink-50 text-pink-600 border-pink-100" }
                ].map((stat, i) => {
                  const SIcon = stat.icon;
                  return (
                    <div key={i} className={`p-4 rounded-2xl border ${stat.color} shadow-xs space-y-2 relative overflow-hidden transition-all hover:shadow-md`}>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase font-mono tracking-wider opacity-85">{stat.title}</span>
                        <SIcon className="w-5 h-5 opacity-75 mr-1" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black tracking-tight">{stat.value}</span>
                        <span className="text-[9px] font-mono opacity-80">{stat.subtitle}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Toolbar Column & Search bars */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
                  <div className="flex flex-1 items-center gap-2 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full max-w-md">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search by customer, phone or model..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-transparent border-none text-xs w-full focus:outline-none focus:ring-0 text-slate-800"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Filter Stat:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 font-semibold focus:outline-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Documents Pending">Documents Pending</option>
                      <option value="Bank Processing">Bank Processing</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Disbursed">Disbursed</option>
                    </select>

                    <button
                      onClick={() => {
                        // Set followup date to tomorrow default
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 2);
                        setFormFollowup(tomorrow.toISOString().split('T')[0]);
                        setShowAddForm(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-sm shadow-blue-500/10 cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Finance Lead
                    </button>
                  </div>
                </div>

                {/* EXPANDABLE NEW LEAD LOGGER FORM */}
                <AnimatePresence>
                  {showAddForm && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleCreateLead}
                      className="border border-blue-100 bg-blue-50/20 rounded-2xl p-5 space-y-4 overflow-hidden"
                    >
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
                        <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
                          <Plus className="w-4 h-4" /> Record New Dealership Finance File
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="text-xs font-bold text-slate-400 hover:text-slate-600"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Customer Name</label>
                          <input
                            type="text"
                            placeholder="Rahul Sharma"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs w-full text-slate-800"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">WhatsApp Mobile</label>
                          <input
                            type="tel"
                            placeholder="9689811509"
                            value={formPhone}
                            onChange={(e) => setFormPhone(e.target.value.replace(/[^\d]/g, ""))}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs w-full font-mono text-slate-800"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Vehicle Model</label>
                          <select
                            value={formCarKey}
                            onChange={(e) => setFormCarKey(e.target.value as CarKey)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs w-full text-slate-800"
                          >
                            {Object.entries(CARS).map(([key, item]) => (
                              <option key={key} value={key}>{item.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Variant Detail</label>
                          <input
                            type="text"
                            placeholder="e.g. Fearless Plus Dark Edition"
                            value={formVariant}
                            onChange={(e) => setFormVariant(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs w-full text-slate-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Approved Loan Downpayment</label>
                          <input
                            type="number"
                            value={formDownPayment}
                            onChange={(e) => setFormDownPayment(Number(e.target.value))}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs w-full font-mono text-slate-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Indicative EMI Value</label>
                          <input
                            type="number"
                            value={formEmi}
                            onChange={(e) => setFormEmi(Number(e.target.value))}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs w-full font-mono text-slate-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">File Process Status</label>
                          <select
                            value={formStatus}
                            onChange={(e) => setFormStatus(e.target.value as FinanceStatus)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs w-full text-slate-800"
                          >
                            <option value="Documents Pending">Documents Pending</option>
                            <option value="Bank Processing">Bank Processing</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Disbursed">Disbursed</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Next Follow-up Date</label>
                          <input
                            type="date"
                            value={formFollowup}
                            onChange={(e) => setFormFollowup(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs w-full text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-5 rounded-lg ml-auto transition-colors"
                        >
                          Submit Lead Log
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* LEAD RECORDS TABLE VIEW */}
                <div className="overflow-x-auto min-w-full">
                  {loading ? (
                    <div className="py-12 text-center text-slate-450 text-xs flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                      Loading Finance Lead Directory...
                    </div>
                  ) : filteredLeads.length === 0 ? (
                    <div className="py-16 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-8 h-8 text-slate-400 stroke-[1.5]" />
                      No matching finance files recorded for: "{searchTerm || 'selected criteria'}"
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-500 font-mono text-[10px] uppercase pb-2">
                          <th className="py-2.5 font-bold">Prospect / Mob</th>
                          <th className="py-2.5 font-bold">Selected Variant</th>
                          <th className="py-2.5 font-bold">Loan Settings</th>
                          <th className="py-2.5 font-bold">Status Hub</th>
                          <th className="py-2.5 font-bold text-right">Follow-up Due</th>
                          <th className="py-2.5 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredLeads.map((lead) => {
                          const isOverdue = lead.followupDate < new Date().toISOString().split('T')[0] && lead.status !== 'Disbursed' && lead.status !== 'Rejected';
                          return (
                            <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3 pr-2">
                                <span className="font-extrabold text-slate-900 block">{lead.customerName}</span>
                                <span className="text-[10px] text-slate-400 font-mono font-medium flex items-center gap-1">
                                  <Smartphone className="w-3 h-3 text-slate-400" />
                                  +91 {lead.mobile}
                                </span>
                              </td>
                              <td className="py-3">
                                <span className="text-slate-800 font-bold block">{lead.vehicle}</span>
                                <span className="text-[10px] text-slate-500 font-mono truncate max-w-[200px] block">{lead.variant}</span>
                              </td>
                              <td className="py-3">
                                <span className="text-slate-800 font-semibold block">EMI: {fmt(lead.emi)}/m</span>
                                <span className="text-[10px] text-slate-500 font-mono block">DP: {fmt(lead.downPayment)}</span>
                              </td>
                              <td className="py-3">
                                <select
                                  value={lead.status}
                                  onChange={(e) => handleUpdateStatus(lead.id!, e.target.value as FinanceStatus)}
                                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border ${
                                    lead.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-250 font-black' :
                                    lead.status === 'Disbursed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    lead.status === 'Bank Processing' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                    lead.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                    'bg-amber-50 text-amber-700 border-amber-250'
                                  }`}
                                >
                                  <option value="Documents Pending">Documents Pending</option>
                                  <option value="Bank Processing">Bank Processing</option>
                                  <option value="Approved">Approved</option>
                                  <option value="Rejected">Rejected</option>
                                  <option value="Disbursed">Disbursed</option>
                                </select>
                              </td>
                              <td className="py-3 text-right">
                                <span className={`font-mono text-[10px] font-black ${isOverdue ? "text-red-500 bg-red-50 px-1.5 py-0.5 rounded animate-pulse" : "text-slate-600 font-medium"}`}>
                                  {lead.followupDate}
                                </span>
                                {isOverdue && (
                                  <span className="text-[8px] font-bold uppercase text-red-600 block mt-0.5">OVERDUE TRACKING</span>
                                )}
                              </td>
                              <td className="py-3 text-right">
                                <div className="flex justify-end gap-1.5">
                                  {/* WhatsApp share */}
                                  <button
                                    onClick={() => triggerWhatsAppShare(lead)}
                                    title="Share on WhatsApp"
                                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 p-2 rounded-xl transition-all cursor-pointer active:scale-90"
                                  >
                                    <MessageCircle className="w-4 h-4 shrink-0 fill-current" />
                                  </button>
                                  {/* Trash */}
                                  <button
                                    onClick={() => handleDelete(lead.id!)}
                                    title="Delete File Record"
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 p-2 rounded-xl transition-all cursor-pointer active:scale-90"
                                  >
                                    <Trash2 className="w-4 h-4 shrink-0" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: EMI CALCULATOR */}
          {activeTab === "emi" && (
            <motion.div
              key="emi-calc"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* 1. TOP ALIGNMENT BANNER: Dynamic Price Synchronization with First Block */}
              <div className="lg:col-span-12">
                {initialOnRoadPrice > 0 ? (
                  <div className="bg-emerald-50 border border-emerald-150 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100/80 flex items-center justify-center text-emerald-700 shrink-0">
                        <CheckCircle className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold text-emerald-600 font-mono tracking-wider uppercase px-2 py-0.5 bg-emerald-100 rounded-sm">
                            Showroom Price Sync Connected
                          </span>
                          {calcOnRoad !== initialOnRoadPrice && (
                            <span className="text-[9px] font-bold text-amber-600 font-mono tracking-wider uppercase px-2 py-0.5 bg-amber-100 rounded-sm">
                              Manual Override Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-emerald-900 font-medium mt-0.5">
                          Acquired <strong className="font-extrabold text-emerald-950">₹{fmt(initialOnRoadPrice)}</strong> configured price of <strong className="font-semibold text-emerald-950">{initialCarKey ? `TATA ${CARS[initialCarKey as CarKey]?.label || initialCarKey}` : "Selected SUV"} ({initialVariantName || "Base specifications"})</strong> from the Price Quotation Sheet.
                        </p>
                      </div>
                    </div>
                    {calcOnRoad !== initialOnRoadPrice && (
                      <button
                        onClick={() => {
                          setCalcOnRoad(initialOnRoadPrice);
                          setCalcDownpayment(Math.round(initialOnRoadPrice * 0.20));
                          setCalcCar(initialCarKey);
                          showToast("Fully re-synchronized with active Quotation Sheet inputs!");
                        }}
                        className="px-3.5 py-1.5 rounded-xl text-[10px] font-bold font-mono transition-all bg-white hover:bg-emerald-100/30 text-emerald-800 border border-emerald-200 shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
                      >
                        <RefreshCw className="w-3 h-3 text-emerald-600" />
                        Restore Sync Price
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-amber-100/80 flex items-center justify-center text-amber-750 shrink-0">
                      <AlertCircle className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-amber-600 font-mono tracking-wider uppercase px-2 py-0.5 bg-amber-100 rounded-sm">
                        Quotation price not found
                      </span>
                      <p className="text-xs text-amber-900 font-medium mt-1">
                        Please go to the <strong className="font-bold">"Price Quotation Sheet"</strong> tab first to select a TATA model & variant. We are demonstrating below calculations using standard <strong className="font-bold">Harrier</strong> reference estimates (₹23.50L). You can also edit the price manually.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Left sliders side */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs">
                <div className="space-y-1 border-b border-slate-100 pb-3">
                  <h3 className="font-display font-black text-slate-800 flex items-center gap-1.5 text-sm uppercase tracking-tight">
                    <Calculator className="w-5 h-5 text-blue-600" /> Estimator Configurator
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium font-sans">
                    Fine-tune downpayment margin bounds, tenure rates, and on-road aggregates.
                  </p>
                </div>

                {/* Customer Info Row for personalized sharing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100/70">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Customer Name</label>
                    <input
                      type="text"
                      value={calcCustomerName}
                      onChange={(e) => setCalcCustomerName(e.target.value)}
                      placeholder="e.g. Anand Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base md:text-xs text-slate-705 font-bold focus:outline-none focus:border-blue-500/80 transition-all font-sans"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">WhatsApp Number (For Direct Sharing)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold font-mono">+91</span>
                      <input
                        type="text"
                        maxLength={10}
                        value={calcCustomerPhone}
                        onChange={(e) => setCalcCustomerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="10-digit mobile number"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-3.5 py-2.5 text-base md:text-xs text-slate-705 font-bold font-mono focus:outline-none focus:border-blue-500/80 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Direct Selector Autopopulate input values */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Autofill Model Spec</label>
                    <select
                      value={calcCar}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCalcCar(val);
                        // Get base representative price for configured values
                        const carObj = CARS[val as CarKey];
                        if (carObj) {
                          const baseVariant = Object.values(carObj.variants)[0]?.[0];
                          if (baseVariant) {
                            setCalcVariantName(baseVariant.name);
                            setCalcOnRoad(baseVariant.onroad);
                            setCalcDownpayment(Math.round(baseVariant.onroad * 0.20));
                          }
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-base md:text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-500/80 transition-all cursor-pointer"
                    >
                      {Object.entries(CARS).map(([key, item]) => (
                        <option key={key} value={key}>TATA {item.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Autofill Variant Spec</label>
                    <select
                      value={calcVariantName}
                      onChange={(e) => {
                        const vName = e.target.value;
                        setCalcVariantName(vName);
                        const match = calcCarVariants.find(v => v.name === vName);
                        if (match) {
                          setCalcOnRoad(match.onroad);
                          setCalcDownpayment(Math.round(match.onroad * 0.20));
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-base md:text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-500/80 transition-all cursor-pointer"
                    >
                      {calcCarVariants.map((v, i) => (
                        <option key={i} value={v.name}>
                          {v.name} ({v.transmission})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Custom On-Road Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-xs">₹</span>
                      <input
                        type="number"
                        value={calcOnRoad}
                        onChange={(e) => {
                          const num = Number(e.target.value);
                          setCalcOnRoad(num);
                          if (calcDownpayment > num) setCalcDownpayment(Math.round(num * 0.20));
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-6 pr-3.5 py-3 text-base md:text-xs text-slate-700 font-mono font-black focus:outline-none focus:border-blue-500/80 transition-all font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Margin Down Payment Slider representation with Presets */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Margin Down Payment (DP):</span>
                    <span className="font-mono font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded text-sm">
                      {fmt(calcDownpayment)} <span className="text-[10px] text-slate-400 font-normal">({calcOnRoad > 0 ? Math.round((calcDownpayment / calcOnRoad) * 100) : 0}%)</span>
                    </span>
                  </div>
                  
                  {/* Downpayment Preset Quick Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "10% DP", value: Math.round(calcOnRoad * 0.10) },
                      { label: "20% DP", value: Math.round(calcOnRoad * 0.20) },
                      { label: "30% DP", value: Math.round(calcOnRoad * 0.30) },
                      { label: "50% DP", value: Math.round(calcOnRoad * 0.50) },
                    ].map((preset, idx) => {
                      const isCurrent = Math.abs(calcDownpayment - preset.value) < 5000;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCalcDownpayment(preset.value)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                            isCurrent
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80"
                          }`}
                        >
                          {preset.label} ({fmtShort(preset.value)})
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="range"
                    min={Math.round(calcOnRoad * 0.05) || 100000}
                    max={calcOnRoad}
                    step="10000"
                    value={calcDownpayment}
                    onChange={(e) => setCalcDownpayment(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                    <span>Min (5%): {fmt(Math.round(calcOnRoad * 0.05))}</span>
                    <span>Max: {fmtShort(calcOnRoad)}</span>
                  </div>
                </div>

                {/* Loan Tenure Slider representation */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Loan Tenancy Tenure:</span>
                    <span className="font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded text-xs">
                      {calcTenure} Years <span className="text-[10px] text-slate-400 font-mono">({calcTenure * 12} Mos)</span>
                    </span>
                  </div>

                  {/* Tenure Quick Chips */}
                  <div className="flex gap-2">
                    {[3, 5, 7].map((years) => (
                      <button
                        key={years}
                        type="button"
                        onClick={() => setCalcTenure(years)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                          calcTenure === years
                            ? "bg-blue-600 text-white border-blue-600 border shadow-sm"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {years} Years ({years * 12} Mos)
                      </button>
                    ))}
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="7"
                    step="1"
                    value={calcTenure}
                    onChange={(e) => setCalcTenure(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                    <span>1 Year</span>
                    <span>3 Years</span>
                    <span>5 Years</span>
                    <span>7 Years max</span>
                  </div>
                </div>

                {/* Top Financial Partners Grid (Selector Index) */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block pb-1 border-b border-slate-100">
                    Select Dealer Direct Financial Partner
                  </span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: "TATA", name: "TATA Capital", rate: 8.55, type: "Dealer Special", logo: "🤝" },
                      { id: "SBI", name: "State Bank of India", rate: 8.75, type: "Express Car", logo: "🏛️" },
                      { id: "HDFC", name: "HDFC Bank", rate: 8.95, type: "HDFC ZipDrive", logo: "🏦" },
                      { id: "ICICI", name: "ICICI Bank", rate: 9.15, type: "ICICI Instant", logo: "💳" }
                    ].map((bank) => {
                      const isSelected = selectedBankKey === bank.id;
                      return (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => {
                            setSelectedBankKey(bank.id);
                            setCalcRate(bank.rate);
                            showToast(`Applied ${bank.name} rates: ${bank.rate}% p.a. Processing charges applied.`);
                          }}
                          className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer hover:scale-[1.02] flex flex-col justify-between h-[105px] ${
                            isSelected
                              ? "bg-blue-50/75 border-blue-600 shadow-xs"
                              : "bg-slate-50 hover:bg-slate-100/60 border-slate-200/80"
                          }`}
                        >
                          <div className="flex justify-between items-start w-full">
                            <span className="text-xl font-mono">{bank.logo}</span>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded font-mono ${
                              isSelected ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                            }`}>
                              {bank.rate}%
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-black block truncate text-slate-800 font-display">{bank.name}</span>
                            <span className="text-[8px] font-semibold text-slate-400 block mt-0.5">{bank.type}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Loan Interest Rate p.a. representation */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Custom Yearly Interest Rate (p.a):</span>
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">{calcRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="7"
                    max="15"
                    step="0.05"
                    value={calcRate}
                    onChange={(e) => {
                      setCalcRate(Number(e.target.value));
                      setSelectedBankKey(""); // Clear preset active marker
                    }}
                    className="w-full h-1.5 bg-slate-100 rounded-lg cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                    <span>7.00%</span>
                    <span>9.50%</span>
                    <span>12.00%</span>
                    <span>15.00% max p.a.</span>
                  </div>
                </div>
              </div>

              {/* Right EMI breakdown display column with Visual SVG Chart */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-b from-slate-900 to-[#10172A] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden h-full">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-5">
                  <span className="text-[10px] font-bold uppercase font-mono tracking-widest text-blue-400">Monthly EMI Estimate Breakdown</span>
                  
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-medium">Indicative Monthly Installment</span>
                    <h2 className="text-3xl font-mono font-black text-blue-400 tracking-tight">
                      {fmt(calculatedMonthlyEmi)}
                      <span className="text-[11px] text-slate-350 block font-sans font-medium mt-1.5">
                        / month for {calcTenure * 12} Months tenure p.a.
                      </span>
                    </h2>
                  </div>

                  {/* HIGH-FIDELITY INTERACTIVE SVG CHART (Principal vs Interest) */}
                  <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4.5 flex items-center justify-between gap-4">
                    <div className="relative shrink-0">
                      {/* SVG Circle Stack representing Donut */}
                      {(() => {
                        const r = 38;
                        const strokeW = 8;
                        const circum = 2 * Math.PI * r; // ~238.76

                        const totalOut = totalPayableWithInterest || 1;
                        const princP = (calculatedLoanAmount / totalOut) * 100;
                        const intP = (totalInterestPaid / totalOut) * 100;

                        const principalDash = (circum * calculatedLoanAmount) / totalOut;
                        const interestDash = (circum * totalInterestPaid) / totalOut;

                        return (
                          <svg viewBox="0 0 100 100" className="w-[110px] h-[110px] select-none scale-[1.02] transform transition-transform duration-300 hover:rotate-3">
                            {/* Base track */}
                            <circle
                              cx="50"
                              cy="50"
                              r={r}
                              fill="transparent"
                              stroke="rgba(255,255,255,0.06)"
                              strokeWidth={strokeW}
                            />
                            {/* Principal Segment - Blue */}
                            <circle
                              cx="50"
                              cy="50"
                              r={r}
                              fill="transparent"
                              stroke={hoveredSegment === "principal" ? "#60a5fa" : "#2563eb"}
                              strokeWidth={hoveredSegment === "principal" ? strokeW + 2.5 : strokeW}
                              strokeDasharray={`${principalDash} ${circum}`}
                              strokeDashoffset="0"
                              transform="rotate(-90 50 50)"
                              className="transition-all duration-300 cursor-pointer"
                              onMouseEnter={() => setHoveredSegment("principal")}
                              onMouseLeave={() => setHoveredSegment(null)}
                            />
                            {/* Interest Segment - Amber */}
                            <circle
                              cx="50"
                              cy="50"
                              r={r}
                              fill="transparent"
                              stroke={hoveredSegment === "interest" ? "#fecdd3" : "#f59e0b"}
                              strokeWidth={hoveredSegment === "interest" ? strokeW + 2.5 : strokeW}
                              strokeDasharray={`${interestDash} ${circum}`}
                              strokeDashoffset={-principalDash}
                              transform="rotate(-90 50 50)"
                              className="transition-all duration-300 cursor-pointer"
                              onMouseEnter={() => setHoveredSegment("interest")}
                              onMouseLeave={() => setHoveredSegment(null)}
                            />
                            {/* Central Overlay Texts */}
                            <g className="pointer-events-none">
                              <text x="50" y="47" textAnchor="middle" className="text-[8px] font-bold fill-slate-400 tracking-wider font-mono">LOAN</text>
                              <text x="50" y="60" textAnchor="middle" className="text-[10px] font-black fill-white font-mono">
                                {Math.round(calculatedLoanAmount / (calcOnRoad || 1) * 100)}%
                              </text>
                            </g>
                          </svg>
                        );
                      })()}
                    </div>

                    <div className="flex-1 space-y-2.5">
                      {/* Interactive Legends */}
                      <div 
                        onMouseEnter={() => setHoveredSegment("principal")}
                        onMouseLeave={() => setHoveredSegment(null)}
                        className={`p-1.5 rounded-lg transition-all ${
                          hoveredSegment === "principal" ? "bg-white/5 pl-2.5 scale-[1.03]" : ""
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                          Principal Loan
                        </div>
                        <span className="font-mono text-xs font-black text-white block mt-0.5">
                          {fmtShort(calculatedLoanAmount)} <span className="text-[9px] text-slate-500">({totalPayableWithInterest > 0 ? Math.round((calculatedLoanAmount / totalPayableWithInterest) * 100) : 0}%)</span>
                        </span>
                      </div>

                      <div 
                        onMouseEnter={() => setHoveredSegment("interest")}
                        onMouseLeave={() => setHoveredSegment(null)}
                        className={`p-1.5 rounded-lg transition-all ${
                          hoveredSegment === "interest" ? "bg-white/5 pl-2.5 scale-[1.03]" : ""
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-350 font-bold uppercase tracking-wider">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                          Interest Payable
                        </div>
                        <span className="font-mono text-xs font-black text-amber-400 block mt-0.5">
                          {fmtShort(totalInterestPaid)} <span className="text-[9px] text-slate-500">({totalPayableWithInterest > 0 ? Math.round((totalInterestPaid / totalPayableWithInterest) * 100) : 0}%)</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 pt-4 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Total Net Loan Requested:</span>
                      <span className="font-bold text-slate-200 font-mono">{fmt(calculatedLoanAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Bank Interest Charges:</span>
                      <span className="font-bold text-amber-400 font-mono">{fmt(totalInterestPaid)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-slate-850 pt-2.5">
                      <span className="text-slate-300">Total Borrow Outflow:</span>
                      <span className="font-black text-white font-mono text-sm tracking-tight">
                        {fmt(totalPayableWithInterest)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  <button
                    onClick={() => {
                      // Save directly dynamically to leads
                      setFormCarKey(calcCar as CarKey);
                      setFormEmi(calculatedMonthlyEmi);
                      setFormDownPayment(calcDownpayment);
                      setFormVariant(`${CARS[calcCar as CarKey]?.label || calcCar}${calcVariantName ? ` (${calcVariantName})` : ""} (@${calcRate}%) - Synced Quotation`);
                      setShowAddForm(true);
                      setActiveTab("dashboard");
                      showToast("EMI parameters loaded into CRM Logger. Define customer name to reserve priority approval!");
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs py-3.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all font-sans"
                  >
                    <Plus className="w-4 h-4" /> Save & Log to Database CRM
                  </button>

                  <button
                    onClick={triggerDirectCalculatorShare}
                    className="w-full bg-[#10B981] hover:bg-[#059669] active:scale-95 text-white font-bold text-xs py-3.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all font-sans"
                  >
                    <MessageCircle className="w-4 h-4" /> Share Estimate via WhatsApp
                  </button>

                  <p className="text-[10px] text-slate-500 text-center leading-normal">
                    *Estimations are sourced on active {calcRate}% retail p.a and do not include secondary registration charges or credit scoring processing logs.
                  </p>
                </div>
              </div>

              {/* 3. DETAILED COLLAPSIBLE AMORTIZATION SCHEDULE */}
              <div className="lg:col-span-12">
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAmortization(!showAmortization);
                      showToast(showAmortization ? "Amortization table collapsed" : "Yearly amortization table expanded");
                    }}
                    className="w-full flex items-center justify-between p-5 text-left text-slate-800 font-bold text-xs hover:bg-slate-50/55 transition-colors select-none cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-display uppercase tracking-tight font-black text-xs text-slate-850">
                      <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                      View Full Amortization Balance Sheet & Yearly Repayments
                    </span>
                    <span className="text-[11px] font-mono font-bold bg-blue-50 text-blue-650 px-2.5 py-1 rounded-xl">
                      {showAmortization ? "Hide Details ▲" : "Show Details ▼"}
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {showAmortization && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border-t border-slate-100/90"
                      >
                        <div className="p-5 overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-600 min-w-[650px]">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-600 font-mono text-[10px] uppercase">
                                <th className="py-2.5 font-bold">Year Index</th>
                                <th className="py-2.5 font-bold">Opening Debt</th>
                                <th className="py-2.5 font-bold text-blue-650">Principal Paid (A)</th>
                                <th className="py-2.5 font-bold text-amber-650">Interest Paid (B)</th>
                                <th className="py-2.5 font-bold">Total Installments (A+B)</th>
                                <th className="py-2.5 font-bold text-right">Ending Balance Sheet</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {amortizationSchedule.map((row) => (
                                <tr key={row.year} className="hover:bg-slate-50/60 transition-colors">
                                  <td className="py-3 font-extrabold text-slate-900 font-display">Year {row.year}</td>
                                  <td className="py-3 font-mono text-slate-600">{fmt(row.openingBalance)}</td>
                                  <td className="py-3 font-mono text-blue-600 font-extrabold">+{fmt(row.principalPaid)}</td>
                                  <td className="py-3 font-mono text-amber-600 font-bold">+{fmt(row.interestPaid)}</td>
                                  <td className="py-3 font-mono text-slate-800 font-extrabold">{fmt(row.totalPaid)}</td>
                                  <td className="py-3 font-mono text-right text-slate-500">
                                    {row.endingBalance === 0 ? (
                                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                                        LOAN FULLY CLOSED
                                      </span>
                                    ) : (
                                      fmt(row.endingBalance)
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          
                          <div className="mt-4 p-4 bg-blue-50/40 rounded-2xl flex items-start gap-2.5 border border-blue-100/45">
                            <AlertCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-blue-900 leading-normal font-sans font-medium">
                              <strong className="font-bold">Dealership Advisory:</strong> Early loan payments represent a higher interest-to-principal ratio. If pre-payment facilities are offered by the banker without pre-closure charges, prepaying ₹1-2 Lakhs in Year 1 can save over ₹30,000 to ₹50,000 in compound interest over the lifecycle of your TATA vehicle loan.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: ELIGIBILITY CHECKER */}
          {activeTab === "eligibility" && (
            <motion.div
              key="eligibility-check"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Input params block */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-xs">
                <div className="space-y-1 border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-slate-800 flex items-center gap-1.5">
                    <UserCheck className="w-5 h-5 text-blue-600" /> Credit Eligibility Analyzer
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Verify customer banking profiles against the FOIR standard threshold indices.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Monthly In-Hand Salary (Net)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-xs">₹</span>
                      <input
                        type="number"
                        value={income || ""}
                        onChange={(e) => setIncome(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-6 pr-3.5 py-2.5 text-xs text-slate-700 font-mono font-black focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Current Existing EMI obligations</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-xs">₹</span>
                      <input
                        type="number"
                        value={existingEmi || 0}
                        onChange={(e) => setExistingEmi(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-6 pr-3.5 py-2.5 text-xs text-slate-700 font-mono font-black focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Employment Status Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => { setEmpType("salaried"); setDocTab("salaried"); }}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          empType === "salaried"
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        Salaried
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEmpType("self_employed"); setDocTab("self_employed"); }}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          empType === "self_employed"
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        Self-Employed
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Personal CIBIL Score ({cibil})</label>
                    <input
                      type="range"
                      min="300"
                      max="900"
                      step="5"
                      value={cibil}
                      onChange={(e) => setCibil(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg cursor-pointer accent-blue-600 mt-2.5"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-slate-450 font-bold">
                      <span className="text-red-500">Poor (300)</span>
                      <span className="text-amber-600">Fair (650)</span>
                      <span className="text-emerald-600">Excellent (900)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Intended Margin Down Payment</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={eligibilityDownpayment || ""}
                      onChange={(e) => setEligibilityDownpayment(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-6 pr-3.5 py-2.5 text-xs text-slate-700 font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Assessment display card */}
              <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Assessed Credit Profile Card</span>
                  
                  <div className="flex items-center gap-3">
                    <div className={`border px-3.5 py-1.5 rounded-xl font-bold font-display text-xs ${eligibilityResult.colorClass}`}>
                      {eligibilityResult.rank}
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-500">CIBIL Factor: {cibil}</span>
                  </div>

                  <div className="divide-y divide-slate-100/95 space-y-3">
                    <div className="pt-3 flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">Estimated EMI Buffer:</span>
                      <span className="font-mono font-extrabold text-slate-800 text-sm">{fmt(eligibilityResult.maxEmi)}/m</span>
                    </div>
                    
                    <div className="pt-3 flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">Maximum Loan Capacity:</span>
                      <span className="font-mono font-extrabold text-slate-800 text-sm">{fmt(eligibilityResult.maxLoanAmount)}</span>
                    </div>

                    <div className="pt-3 flex justify-between items-center border-t border-slate-200">
                      <span className="text-xs text-slate-700 font-bold">Suggested On-Road Affiliation:</span>
                      <span className="font-mono font-black text-blue-600 text-base">{fmt(eligibilityResult.suggestedOnRoadPrice)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setFormEmi(eligibilityResult.maxEmi > 0 ? eligibilityResult.maxEmi : 20000);
                      setFormDownPayment(eligibilityDownpayment);
                      setFormVariant(`Pre-Scored File (CIBIL: ${cibil})`);
                      setFormStatus("Documents Pending");
                      setShowAddForm(true);
                      setActiveTab("dashboard");
                      showToast("Pre-approval parameters copied into Lead Logger.");
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-md shadow-blue-500/10"
                  >
                    <Plus className="w-4 h-4" /> Move Profile to Lead CRM
                  </button>
                  <p className="text-[9.5px] text-slate-400 text-center leading-relaxed">
                    Estimate assumes standard debt servicing conditions. Real scores are affected by active commercial tax filings, GST returns and corporate audits.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: REQUIRED DOCUMENTS */}
          {activeTab === "documents" && (
            <motion.div
              key="doc-guide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs"
            >
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-5 h-5 text-blue-600" /> Dynamic Document Checklist
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Configure checklist dynamically based on customer business entity type.</p>
              </div>

              {/* Sub tabs inside docs page */}
              <div className="flex flex-wrap gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/60 max-w-fit">
                {[
                  { id: "salaried", label: "Salaried", icon: Briefcase },
                  { id: "self_employed", label: "Self Employed", icon: TrendingUp },
                  { id: "proprietor", label: "Proprietorship", icon: Users },
                  { id: "partnership", label: "Partnership Firm", icon: Building2 },
                  { id: "pvt_ltd", label: "Private Limited", icon: Building2 }
                ].map(sub => {
                  const SubIcon = sub.icon;
                  const isSectionActive = docTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setDocTab(sub.id as any)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${
                        isSectionActive 
                          ? "bg-white text-blue-600 shadow-sm" 
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <SubIcon className="w-4 h-4 text-slate-400" />
                      {sub.label}
                    </button>
                  );
                })}
              </div>

              {/* Document display board details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-3">
                
                {/* ID & Address proof */}
                {docTab === "salaried" && (
                  <>
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                      <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-1">🪪 Identity Proof Cards (Choose Any 1)</span>
                      <ul className="text-xs text-slate-600 space-y-2.5 font-medium list-disc list-inside">
                        <li>Aadhaar Card (Linked with active mobile)</li>
                        <li>PAN Card (Mandatory for credit query)</li>
                        <li>Passport copy (Valid)</li>
                        <li>Driving License</li>
                        <li>Voter ID Card</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                      <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-1">📍 Address Verification Proofs</span>
                      <ul className="text-xs text-slate-600 space-y-2.5 font-medium list-disc list-inside">
                        <li>Aadhaar Card with correct Nagpur limits</li>
                        <li>Electricity Bill / Gas Bill (Last 2 Mos)</li>
                        <li>Passport copy address page</li>
                        <li>Registered Rent Agreement Copy</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                      <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-1">💼 Income & Banking slips</span>
                      <ul className="text-xs text-slate-600 space-y-2.5 font-medium list-disc list-inside">
                        <li>Last 3 Months Salary Slips</li>
                        <li>Latest Form 16 / Annual Accounts statements</li>
                        <li>Last 6 Months Salary Bank statements</li>
                        <li>2-3 Passport Size Photos</li>
                      </ul>
                    </div>
                  </>
                )}

                {docTab === "self_employed" && (
                  <>
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                      <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-1">📂 Business Legitimacy Proofs</span>
                      <ul className="text-xs text-slate-600 space-y-2.5 font-medium list-disc list-inside">
                        <li>GST Certificate Copy (Complete)</li>
                        <li>Shop Establishment Act License copy</li>
                        <li>Professional Tax Registration</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                      <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-1">📊 Income Tax Audit Files</span>
                      <ul className="text-xs text-slate-600 space-y-2.5 font-medium list-disc list-inside">
                        <li>Last 2 Years ITR V acknowledgment copies</li>
                        <li>Profit & Loss A/c Statement (Audited)</li>
                        <li>Complete Audited Balance Sheets</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                      <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-1">🏦 Activity Bank Statements</span>
                      <ul className="text-xs text-slate-600 space-y-2.5 font-medium list-disc list-inside">
                        <li>Last 6 Months Current Bank A/c statements</li>
                        <li>Last 6 Months Savings Bank A/c statement</li>
                        <li>KYC details copy of all Directors/Owners</li>
                      </ul>
                    </div>
                  </>
                )}

                {(docTab === "proprietor" || docTab === "partnership" || docTab === "pvt_ltd") && (
                  <>
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                      <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-1">📃 Corporate Constitution Documents</span>
                      <ul className="text-xs text-slate-600 space-y-2.5 font-medium list-disc list-inside">
                        <li>Company PAN Card Copy</li>
                        {docTab === "partnership" && <li>Notarized/Registered Partnership Deed copy</li>}
                        {docTab === "pvt_ltd" && <li>Memorandum & Articles of Association (MOA/AOA)</li>}
                        {docTab === "pvt_ltd" && <li>Certificate of Incorporation (COI)</li>}
                        <li>GST Certificate with Active status</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                      <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-1">🔐 Board Authorization & Credit</span>
                      <ul className="text-xs text-slate-600 space-y-2.5 font-medium list-disc list-inside">
                        <li>ITR V and Computation of Income (Last 2 Yrs)</li>
                        {docTab === "pvt_ltd" && <li>Board Resolution copy for loan application</li>}
                        <li>List of active partners / Directors list</li>
                        <li>Director Signing Authority Aadhaar Card docs</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                      <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-1">🏢 Commercial Bank Tracking</span>
                      <ul className="text-xs text-slate-600 space-y-2.5 font-medium list-disc list-inside">
                        <li>Last 12 Months Audited Current Bank Statements</li>
                        <li>Tax Audit Report Copy (Form 3CD if applicable)</li>
                        <li>Latest shareholding pattern sheet (for Pvt Ltd)</li>
                      </ul>
                    </div>
                  </>
                )}

              </div>

              {/* WhatsApp Share Panel for active profile checklist and EMI */}
              <div className="bg-emerald-50 border border-emerald-100/80 rounded-2xl p-5 mt-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-emerald-900 flex items-center gap-1.5 font-sans">
                      <MessageCircle className="w-5 h-5 text-emerald-600" /> WhatsApp Customer Sharing Center
                    </span>
                    <p className="text-[11px] text-emerald-700 font-medium font-sans">
                      Share the selected checklist ({docTab.toUpperCase().replace("_", " ")}) along with active vehicle and EMI estimation in one click.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Customer Name</label>
                    <input
                      type="text"
                      value={calcCustomerName}
                      onChange={(e) => setCalcCustomerName(e.target.value)}
                      placeholder="e.g. Anand Sharma"
                      className="w-full bg-white border border-emerald-200/65 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-emerald-500 transition-all font-sans"
                    />
                  </div>
                  <div className="space-y-1.5 font-mono">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">WhatsApp Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] text-emerald-500 font-bold">+91</span>
                      <input
                        type="text"
                        maxLength={10}
                        value={calcCustomerPhone}
                        onChange={(e) => setCalcCustomerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="10-digit number"
                        className="w-full bg-white border border-emerald-200/65 rounded-xl pl-11 pr-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => triggerDirectCalculatorShare(true)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs py-3.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/10 font-sans"
                  >
                    <MessageCircle className="w-4 h-4" /> Share Combined EMI + Documents Checklist
                  </button>
                  <button
                    onClick={() => triggerDirectCalculatorShare(false)}
                    className="bg-white hover:bg-emerald-100/50 text-emerald-700 border border-emerald-200 font-bold text-xs px-5 py-3.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all font-sans"
                  >
                    Share EMI Estimates Only
                  </button>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
