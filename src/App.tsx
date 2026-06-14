import { useState, useMemo, useEffect } from "react";
import { CarKey, Variant } from "./types";
import { CARS, fmt, fmtShort, getFeatures, DEALER, VEHICLE_COLORS, VEHICLE_ACCESSORIES, calculateBhRto, getEligibleColors } from "./data/cars";
import VoiceAssistant from "./components/VoiceAssistant";
import QuotationPreview from "./components/QuotationPreview";
import VehicleLogo from "./components/VehicleLogo";
import GrowwEMICalculator from "./components/GrowwEMICalculator";
import { 
  Car, 
  User, 
  Smartphone, 
  Tag, 
  FileEdit, 
  Sparkles, 
  MapPin, 
  PhoneCall, 
  HelpCircle,
  TrendingDown,
  Wrench,
  Check,
  Palette,
  Calculator
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [carKey, setCarKey] = useState<CarKey | "">("");
  const [fuelType, setFuelType] = useState("");
  const [variant, setVariant] = useState<Variant | null>(null);
  const [discount, setDiscount] = useState("");
  const [discountLabel, setDiscountLabel] = useState("Festival Offer");
  const [insuranceDiscount, setInsuranceDiscount] = useState("");
  const [note, setNote] = useState("");
  const [showQuoteView, setShowQuoteView] = useState(false);
  const [autoFillHighlights, setAutoFillHighlights] = useState<string[]>([]);
  const [showAutoFillToast, setShowAutoFillToast] = useState(false);
  const [activeTab, setActiveTab] = useState<"quotation" | "emi">("quotation");

  // Custom Showroom configuration states (Feature 1, 3, 5)
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [selectedAccessories, setSelectedAccessories] = useState<Array<{ name: string; price: number }>>([]);
  const [rtoType, setRtoType] = useState<"standard" | "bh">("standard");

  const selectedCar = carKey ? CARS[carKey] : null;
  const fuelTypes = selectedCar ? Object.keys(selectedCar.variants) : [];
  const variants = selectedCar && fuelType ? selectedCar.variants[fuelType] : [];

  // Auto-align selected paint color based on variant eligibility
  useEffect(() => {
    if (!variant || !carKey) return;
    const eligible = getEligibleColors(carKey as CarKey, variant.name);
    const isStillEligible = selectedColor && eligible.some(c => c.name === selectedColor.name);
    if (!isStillEligible && eligible.length > 0) {
      setSelectedColor(eligible[0]);
    }
  }, [variant, carKey, selectedColor]);

  const accessoriesTotal = useMemo(() => {
    return selectedAccessories.reduce((sum, item) => sum + item.price, 0);
  }, [selectedAccessories]);

  const effectiveRto = useMemo(() => {
    if (!variant) return 0;
    return rtoType === "bh" ? calculateBhRto(variant.ex, fuelType) : variant.rto;
  }, [variant, rtoType, fuelType]);

  const effectiveOnRoad = useMemo(() => {
    if (!variant) return 0;
    return variant.ex + variant.ins + effectiveRto + variant.tcs;
  }, [variant, effectiveRto]);

  const parsedDiscount = Number(discount) || 0;
  const parsedInsuranceDiscount = Number(insuranceDiscount) || 0;
  const finalPrice = variant ? (effectiveOnRoad + accessoriesTotal - parsedDiscount - parsedInsuranceDiscount) : 0;
  const accent = selectedColor ? selectedColor.hex : (selectedCar ? selectedCar.color : "#ea580c"); // Warm dynamic accent shade


  const isValidInputs = useMemo(() => {
    return customerName.trim().length >= 2 && variant !== null;
  }, [customerName, variant]);

  const handleAutoFill = (matchedDetails: string[]) => {
    setAutoFillHighlights(matchedDetails);
    setShowAutoFillToast(true);
    setTimeout(() => {
      setShowAutoFillToast(false);
    }, 4000);
  };

  const handleReset = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCarKey("");
    setFuelType("");
    setVariant(null);
    setDiscount("");
    setInsuranceDiscount("");
    setNote("");
    setShowQuoteView(false);
    setAutoFillHighlights([]);
    setSelectedColor(null);
    setSelectedAccessories([]);
    setRtoType("standard");
    setActiveTab("quotation");
  };

  // Helper to select preset discount amounts
  const applyPresetDiscount = (amount: number) => {
    setDiscount(String(amount));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-white">
      {/* Dynamic Voice Autofill Toast Indicator */}
      <AnimatePresence>
        {showAutoFillToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs py-3 px-5 rounded-full shadow-2xl flex items-center gap-2.5 border border-emerald-500/20"
          >
            <Check className="w-4 h-4 bg-white/20 rounded-full p-0.5 shrink-0" />
            <span>AI Voice Configured: {autoFillHighlights.join("  ")}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner Navigation bar */}
      <header className="border-b border-zinc-900 bg-zinc-900/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800 flex items-center justify-center font-mono font-black text-sm text-zinc-400">
              MAC
            </div>
            <div>
              <h1 className="font-display font-medium text-lg leading-tight flex items-center gap-2">
                <span className="font-extrabold text-amber-500">TATA</span> PRICE QUOTATION
              </h1>
              <p className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase">
                MAC Vehicles • Nagpur
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 opacity-80 decoration-zinc-800">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              Nagpur
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <a
              href={`tel:${DEALER.contact.split("|")[1].trim()}`}
              className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-500 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-zinc-500" />
              {DEALER.contact.split("|")[0]}
            </a>
          </div>
        </div>
      </header>

      {/* Sticky Dual Navigation Tabs for Price Quotation Sheets vs. High-Precision Groww EMI Calculator */}
      <div className="bg-zinc-950/90 border-b border-zinc-900 sticky top-[73px] z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-start gap-3">
          <button
            onClick={() => setActiveTab("quotation")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === "quotation"
                ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/45"
            }`}
          >
            <Car className="w-4 h-4 shrink-0" />
            <span>Price Quotation Sheet</span>
          </button>
          
          <button
            onClick={() => setActiveTab("emi")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === "emi"
                ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/10"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/45"
            }`}
          >
            <Calculator className="w-4 h-4 shrink-0" />
            <span>Groww Loan EMI Calculator</span>
            {variant && (
              <span className="hidden sm:inline bg-emerald-700/20 text-emerald-400 text-[8px] font-mono font-extrabold uppercase py-0.5 px-1.5 rounded tracking-widest border border-emerald-500/20 ml-1 leading-none">
                Live Pricing Linked
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "quotation" ? (
            <motion.div
              key="quotation"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              
              {/* LEFT PANEL: CONFIGURATION INPUTS FORM */}
              <div className="lg:col-span-7 space-y-6">
            
            {/* Elegant Hero Banner Overview */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-md">
                <h2 className="font-display font-black text-2xl tracking-wide leading-snug">
                  Precision <span className="text-amber-500">Quotation Maker</span>
                </h2>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                  Generate beautiful, shareable estimates complete with official price details, standard walkaround streaming video tutorials, and technical specification brochures.
                </p>
              </div>
            </div>

            {/* Smart Voice Assistant Widget */}
            <VoiceAssistant
              accent={accent}
              onAutoFill={handleAutoFill}
              setCustomerName={setCustomerName}
              setCarKey={setCarKey}
              setFuelType={setFuelType}
              setVariant={setVariant}
              setDiscount={setDiscount}
              setDiscountLabel={setDiscountLabel}
              setSelectedColor={setSelectedColor}
              setRtoType={setRtoType}
            />

            {/* Form Section */}
            <div id="quotation-form" className="bg-zinc-900/30 border border-zinc-900/60 rounded-3xl p-6 space-y-6">
              
              {/* Customer General Meta Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-zinc-500" />
                    Customer Full Name
                  </label>
                  <input
                    id="input-customer-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-zinc-200 placeholder-zinc-700 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                  />
                </div>

                {/* WhatsApp Phone */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-zinc-500" />
                    WhatsApp Number
                  </label>
                  <input
                    id="input-customer-phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/[^\d+]/g, ""))}
                    placeholder="e.g. 9689811509"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-zinc-200 placeholder-zinc-700 font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 transition-all"
                  />
                </div>
              </div>

              {/* TATA CAR SELECTOR GRID */}
              <div className="space-y-3">
                <label className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                  <Car className="w-3.5 h-3.5 text-zinc-500" />
                  Select TATA Luxury SUV
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(CARS).map(([key, item]) => {
                    const isSelected = carKey === key;
                    const borderCol = isSelected ? item.color : "rgba(63,63,70,0.4)";
                    const bgCol = isSelected ? `${item.color}15` : "rgba(9,9,11,0.4)";

                    return (
                      <button
                        key={key}
                        id={`btn-car-${key}`}
                        type="button"
                        onClick={() => {
                          const k = key as CarKey;
                          setCarKey(k);
                          setFuelType("");
                          setVariant(null);
                          const cColors = VEHICLE_COLORS[k];
                          setSelectedColor(cColors ? cColors[0] : null);
                          setSelectedAccessories([]);
                        }}
                        style={{
                          borderColor: borderCol,
                          backgroundColor: bgCol,
                        }}
                        className="p-4 rounded-2xl border text-center relative overflow-hidden transition-all duration-200 hover:scale-[1.02] cursor-pointer flex flex-col items-center justify-center gap-2"
                      >
                        <VehicleLogo carKey={key} isSelected={isSelected} size="md" className="mb-0.5" />
                        <span
                          className="text-xs font-bold font-display"
                          style={{
                            color: isSelected ? item.color : "rgba(228,228,231,0.8)",
                          }}
                        >
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FUEL TYPES & TRANSMISSION */}
              {selectedCar && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <label className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5 text-zinc-500" />
                    Fuel Type & Gearbox
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {fuelTypes.map((type) => {
                      const isSelected = fuelType === type;
                      return (
                        <button
                          key={type}
                          id={`btn-fuel-${type.replace(/\s+/g, "-")}`}
                          type="button"
                          onClick={() => {
                            setFuelType(type);
                            setVariant(null);
                          }}
                          className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/50 shadow-md shadow-amber-500/5 font-extrabold"
                              : "bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-400 border-zinc-800/80"
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* VARIANTS AND EX-ROAD SELECTOR LIST */}
              {variants.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <label className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 font-bold block">
                    Available Showroom Variants ({variants.length})
                  </label>
                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl max-h-[480px] overflow-y-auto divide-y divide-zinc-900">
                    {variants.map((v) => {
                      const isSelected = variant?.name === v.name;
                      const standardOnRoad = v.onroad;
                      const rtoBh = calculateBhRto(v.ex, fuelType);
                      const bhOnRoad = v.ex + v.ins + rtoBh + v.tcs;

                      return (
                        <div
                          key={v.name}
                          className={`w-full transition-all border-l-2 ${
                            isSelected ? "bg-zinc-900/40 border-amber-500" : "hover:bg-zinc-900/40 border-transparent"
                          }`}
                        >
                          <button
                            id={`btn-variant-${v.name.replace(/\s+/g, "-")}`}
                            type="button"
                            onClick={() => setVariant(v)}
                            className="w-full flex justify-between items-center p-4 text-left cursor-pointer transition-all duration-200"
                          >
                            <div>
                              <div
                                className="text-xs font-bold leading-tight flex flex-wrap items-center gap-1.5"
                                style={{ color: isSelected ? accent : "rgba(244,244,245,0.9)" }}
                              >
                                <span>{v.name.replace(/\bDK\b/g, "DARK").replace(/\bRDK\b/g, "RED DARK")}</span>
                                {(v.name.includes("DK") || v.name.includes("RDK") || v.name.toUpperCase().includes("DARK")) && (
                                  <span className="bg-zinc-950 border border-amber-500/30 text-[9px] font-mono font-black text-amber-500 px-1.5 py-0.5 rounded leading-none select-none tracking-wider shrink-0">
                                    DARK (BLACK COLOR)
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                                Ex-Showroom: {fmt(v.ex)}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <span className="text-[8px] font-mono uppercase text-zinc-500 tracking-wider block">
                                {rtoType === "bh" ? "BH Series On-Road" : "Standard On-Road"}
                              </span>
                              <span
                                className="text-sm font-extrabold font-mono"
                                style={{ color: isSelected ? accent : "rgba(161,161,170,0.9)" }}
                              >
                                {fmt(rtoType === "bh" ? bhOnRoad : standardOnRoad)}
                              </span>
                            </div>
                          </button>

                          {/* Beautiful Interactive Price Breakdown Card inside clicked individual variant */}
                          {isSelected && (
                            <div className="px-4 pb-4.5 pt-1 border-t border-zinc-900/60 overflow-hidden leading-normal">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                                {/* Standard Column */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 font-mono">Standard Passing</span>
                                  </div>
                                  <div className="space-y-1 text-xs font-mono text-zinc-400">
                                    <div className="flex justify-between">
                                      <span>Ex-Showroom:</span>
                                      <span className="text-zinc-200 font-semibold">{fmt(v.ex)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Insurance:</span>
                                      <span className="text-zinc-200 font-semibold">{fmt(v.ins)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>RTO Passing:</span>
                                      <span className="text-zinc-200 font-semibold">{fmt(v.rto)}</span>
                                    </div>
                                    {v.tcs > 0 && (
                                      <div className="flex justify-between">
                                        <span>TCS (1%):</span>
                                        <span className="text-zinc-200 font-semibold">{fmt(v.tcs)}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="pt-2 border-t border-zinc-900 flex justify-between text-xs font-bold text-zinc-200">
                                    <span>Total On-Road:</span>
                                    <span className="text-blue-400 font-extrabold font-mono">{fmt(standardOnRoad)}</span>
                                  </div>
                                </div>

                                {/* BH Column */}
                                <div className="space-y-2 pt-4 md:pt-0 md:pl-4 md:border-l border-zinc-900">
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500 font-mono">Bharat (BH) Passing</span>
                                  </div>
                                  <div className="space-y-1 text-xs font-mono text-zinc-400">
                                    <div className="flex justify-between">
                                      <span>Ex-Showroom:</span>
                                      <span className="text-zinc-200 font-semibold">{fmt(v.ex)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Insurance:</span>
                                      <span className="text-zinc-200 font-semibold">{fmt(v.ins)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-amber-500">BH RTO (2-Yr):</span>
                                      <span className="text-amber-400 font-bold">{fmt(rtoBh)}</span>
                                    </div>
                                    {v.tcs > 0 && (
                                      <div className="flex justify-between">
                                        <span>TCS (1%):</span>
                                        <span className="text-zinc-200 font-semibold">{fmt(v.tcs)}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="pt-2 border-t border-zinc-900 flex justify-between text-xs font-bold text-zinc-200">
                                    <span>Total BH On-Road:</span>
                                    <span className="text-amber-500 font-extrabold font-mono">{fmt(bhOnRoad)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* RTO REGISTRATION SERIES SELECTOR */}
              {variant && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 pt-4 border-t border-zinc-900"
                >
                  <label className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    RTO Registration Series
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRtoType("standard")}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                        rtoType === "standard"
                          ? "bg-zinc-900/90 text-white border-zinc-800 ring-2 ring-amber-500/10"
                          : "bg-zinc-950/40 hover:bg-zinc-900/10 text-zinc-400 border-zinc-900/60"
                      }`}
                    >
                      <span className="block text-xs font-bold">Standard MH RTO</span>
                      <span className="block text-[9px] text-zinc-500 font-mono mt-0.5">15 Years Lifetime Road Tax (Nagpur)</span>
                      {rtoType === "standard" && (
                        <div className="absolute right-3.5 top-3.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setRtoType("bh")}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                        rtoType === "bh"
                          ? "bg-zinc-900/90 text-white border-zinc-800 ring-2 ring-amber-500/10"
                          : "bg-zinc-950/40 hover:bg-zinc-900/10 text-zinc-400 border-zinc-900/60"
                      }`}
                    >
                      <span className="block text-xs font-bold text-amber-500 flex items-center gap-1.5">
                        Bharat (BH) Series
                        <span className="text-[9px] font-mono shrink-0 bg-amber-500/20 text-amber-500 px-1 rounded">HOT</span>
                      </span>
                      <span className="block text-[9px] text-zinc-500 font-mono mt-0.5">2 Years Renewable Tax (Lower Initial)</span>
                      {rtoType === "bh" && (
                        <div className="absolute right-3.5 top-3.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* FEATURE 3: PREMIUM PAINT SELECTOR */}
              {variant && carKey && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 pt-4 border-t border-zinc-900"
                >
                  <label className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-zinc-500" />
                    Select Premium Car Paint Shade
                  </label>
                  <div className="bg-zinc-950/40 border border-zinc-900 p-4 rounded-2xl space-y-3">
                    <div className="flex flex-wrap gap-2.5">
                      {(variant ? getEligibleColors(carKey as CarKey, variant.name) : VEHICLE_COLORS[carKey as CarKey] || []).map((color) => {
                        const isSelected = selectedColor?.name === color.name;
                        return (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => setSelectedColor(color)}
                            className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer relative flex items-center justify-center hover:scale-105 ${
                              isSelected 
                                ? "scale-105 ring-2 ring-zinc-300 shadow-lg shadow-black/40" 
                                : "border-zinc-800"
                            }`}
                            style={{
                              backgroundColor: color.hex,
                            }}
                            title={color.name}
                          >
                            {isSelected && (
                              <Check 
                                className="w-4.5 h-4.5 stroke-[2.5]" 
                                style={{ color: color.hex === "#fafafa" || color.hex === "#f8fafc" ? "#18181b" : "#ffffff" }} 
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {selectedColor && (
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedColor.hex }} />
                        <span className="text-xs font-semibold text-zinc-300">
                          {selectedColor.name} <span className="text-[10px] text-zinc-500 font-mono">(Included in Premium Estimate)</span>
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* FEATURE 5: DYNAMIC ACCESSORIES LIST */}
              {variant && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 pt-4 border-t border-zinc-900"
                >
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                      <Wrench className="w-3.5 h-3.5 text-zinc-500" />
                      Genuine TATA Showroom Accessories Addons
                    </label>
                    {selectedAccessories.length > 0 && (
                      <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                        +{fmt(accessoriesTotal)}
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl divide-y divide-zinc-900 overflow-hidden">
                    {VEHICLE_ACCESSORIES.map((item) => {
                      const isChecked = selectedAccessories.some((acc) => acc.name === item.name);
                      
                      const handleCheckboxChange = () => {
                        if (isChecked) {
                          setSelectedAccessories(selectedAccessories.filter((acc) => acc.name !== item.name));
                        } else {
                          setSelectedAccessories([...selectedAccessories, { name: item.name, price: item.price }]);
                        }
                      };

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={handleCheckboxChange}
                          className="w-full text-left p-3.5 flex items-start gap-3 hover:bg-zinc-900/40 transition-colors cursor-pointer"
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                            isChecked 
                              ? "bg-amber-500 border-amber-600 text-zinc-950" 
                              : "border-zinc-800 bg-zinc-950"
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className={`text-xs font-bold leading-normal ${isChecked ? "text-amber-400" : "text-zinc-300"}`}>
                                {item.name}
                              </span>
                              <span className="text-xs font-mono font-bold text-zinc-300 select-none shrink-0 ml-2">
                                {fmt(item.price)}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-500 font-normal leading-normal mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ACTION DISCOUNTS AND BONUS MODULE */}
              {variant && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4 pt-2 border-t border-zinc-900"
                >
                  <label className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-zinc-500" />
                    Promotional Benefits & Offers
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      id="discount-label-picker"
                      value={discountLabel}
                      onChange={(e) => setDiscountLabel(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-base md:text-xs text-zinc-300 font-semibold focus:outline-none focus:border-amber-500"
                    >
                      {[
                        "Festival Offer",
                        "Corporate Discount",
                        "Loyalty Bonus",
                        "Bank Cashback Scheme",
                        "Special Showroom Benefit",
                        "Referral Credit Bonus",
                        "Year-End Clearance",
                      ].map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>

                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-650 text-zinc-550 font-mono text-sm">
                        ₹
                      </span>
                      <input
                        id="input-discount-amount"
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="Promo Discount Amount"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-4 py-3 text-base md:text-xs text-zinc-200 placeholder-zinc-700 font-mono focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>

                  {/* quick presets */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono mr-1.5">
                      Presets Deduc:
                    </span>
                    {[25000, 50000, 75000, 100000].map((amtVal) => (
                      <button
                        key={amtVal}
                        type="button"
                        onClick={() => applyPresetDiscount(amtVal)}
                        className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 px-2.5 py-1 rounded-lg text-[10px] font-mono text-zinc-400 hover:text-white transition-all cursor-pointer"
                      >
                        -{fmtShort(amtVal)}
                      </button>
                    ))}
                    {discount && (
                      <button
                        type="button"
                        onClick={() => setDiscount("")}
                        className="text-[9px] text-red-400 font-bold uppercase tracking-wider ml-1 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Feature: Extra Insurance Discount Input */}
                  <div className="space-y-2 pt-1 border-t border-zinc-900/60">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono tracking-widest font-bold text-zinc-400 uppercase flex items-center gap-1">
                        <span>🛡️ Special Insurance Discount</span>
                      </label>
                      {insuranceDiscount && (
                        <button
                          type="button"
                          onClick={() => setInsuranceDiscount("")}
                          className="text-[9px] text-red-400 font-bold uppercase tracking-wider hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-sm">
                        ₹
                      </span>
                      <input
                        id="input-insurance-discount"
                        type="number"
                        value={insuranceDiscount}
                        onChange={(e) => setInsuranceDiscount(e.target.value)}
                        placeholder="e.g. Free Nil-Dep insurance offer or additional premium markdown"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-4 py-3 text-base md:text-xs text-zinc-200 placeholder-zinc-700 font-mono focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>

                  {(parsedDiscount > 0 || parsedInsuranceDiscount > 0) && (
                    <div className="bg-zinc-950/80 border border-green-950/50 p-4.5 rounded-xl flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs text-zinc-400">Total Deductions Applied:</span>
                      </div>
                      <span className="font-mono font-black text-emerald-400 text-sm">
                        -{fmt(parsedDiscount + parsedInsuranceDiscount)}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* SPECIAL COORDINATION NOTES */}
              {variant && (
                <div className="space-y-2 pt-2">
                  <label className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                    <FileEdit className="w-3.5 h-3.5 text-zinc-500" />
                    Special Coordination Note
                  </label>
                  <textarea
                    id="input-coordination-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Free dynamic accessories worth ₹15,000 included plus guaranteed priority delivery."
                    rows={2}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-xs text-zinc-300 placeholder-zinc-700 leading-relaxed font-normal focus:outline-none focus:border-amber-500 transition-all resize-none"
                  />
                </div>
              )}

              {/* MOBILE TOGGLE / TRIGGER BUTTON */}
              <div className="lg:hidden pt-4">
                <button
                  id="btn-generate-mobile"
                  type="button"
                  disabled={!isValidInputs}
                  onClick={() => setShowQuoteView(true)}
                  style={{
                    backgroundColor: isValidInputs ? accent : "rgba(39,39,42,0.6)",
                  }}
                  className="w-full text-white font-black text-sm tracking-wide py-4 rounded-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xl transition-all"
                >
                  {isValidInputs ? "Generate Quotation Summary" : "Ready Quote: Define Customer & Variant"}
                </button>
              </div>

            </div>

            {/* Elegant promotion block pointing to the dedicated EMI tab */}
            {variant && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Calculator className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-200">Groww Car Loan EMI Calculator</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Adjust downpayment and tenure range for {variant.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("emi")}
                  className="bg-emerald-500 hover:bg-emerald-450 text-zinc-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer"
                >
                  Configure EMI Plan
                </button>
              </motion.div>
            )}

          </div>

          {/* RIGHT PANEL: LIVE DYNAMIC PREVIEW VIEW CARD (DESKTOP AND MODAL PREVIEW) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            
            {/* DESKTOP VERSION (Visible on large screens, side-by-side) */}
            <div className="hidden lg:block">
              {variant ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-medium text-xs uppercase tracking-widest text-zinc-500">
                      Live Digital Mockup
                    </h3>
                  </div>
                  <QuotationPreview
                    customerName={customerName || "[New Prospect Name]"}
                    customerPhone={customerPhone}
                    carKey={carKey as CarKey}
                    fuelType={fuelType}
                    variant={variant}
                    discount={discount}
                    discountLabel={discountLabel}
                    insuranceDiscount={insuranceDiscount}
                    note={note}
                    onReset={handleReset}
                    selectedColor={selectedColor || undefined}
                    selectedAccessories={selectedAccessories}
                    rtoType={rtoType}
                    effectiveRto={effectiveRto}
                  />
                </div>
              ) : (
                <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-12 text-center text-zinc-600 flex flex-col items-center justify-center min-h-[450px]">
                  <HelpCircle className="w-10 h-10 text-zinc-800 mb-4 stroke-[1.5]" />
                  <p className="font-display font-bold text-sm text-zinc-400">
                    Real-Time Digital Invoice Preview
                  </p>
                  <p className="text-xs text-zinc-600 max-w-[280px] mt-1.5 leading-relaxed">
                    Select a TATA model, choose transmission specs, and define premium variants to build your live-updating bill.
                  </p>
                </div>
              )}
            </div>

            {/* MOBILE MODAL POPUP VIEW (Visible on mobile when clicked generate quotation) */}
            <AnimatePresence>
              {showQuoteView && variant && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-end lg:hidden"
                >
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 220 }}
                    className="bg-zinc-900 border-t border-zinc-800 rounded-t-3xl max-h-[92vh] overflow-y-auto p-6 space-y-6"
                  >
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                      <div>
                        <h4 className="font-display font-extrabold text-white text-sm">
                          Estimate Sheet Summary
                        </h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5">
                          Review data breakdown or send directly
                        </p>
                      </div>
                      <button
                        onClick={() => setShowQuoteView(false)}
                        className="text-xs font-bold text-zinc-400 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        Close
                      </button>
                    </div>

                    <QuotationPreview
                      customerName={customerName}
                      customerPhone={customerPhone}
                      carKey={carKey as CarKey}
                      fuelType={fuelType}
                      variant={variant}
                      discount={discount}
                      discountLabel={discountLabel}
                      insuranceDiscount={insuranceDiscount}
                      note={note}
                      onReset={() => {
                        handleReset();
                        setShowQuoteView(false);
                      }}
                      selectedColor={selectedColor || undefined}
                      selectedAccessories={selectedAccessories}
                      rtoType={rtoType}
                      effectiveRto={effectiveRto}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </motion.div>
      ) : (
        <motion.div
          key="emi"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Elegant Hero Banner Overview */}
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono font-black py-1 px-2.5 rounded-full border border-emerald-500/20 tracking-wider">
                FINANCIAL ADVICE
              </span>
              <h2 className="font-display font-black text-2xl tracking-wide leading-snug mt-3">
                Groww Car Loan <span className="text-emerald-400">EMI Planner</span>
              </h2>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed max-w-xl">
                Configure your payment structure with high precision. The tool automatically syncs with the exact net payable amount from your customized quotation after applying all discounts.
              </p>
            </div>
          </div>

          <GrowwEMICalculator 
            carPrice={finalPrice} 
            carName={variant?.name || "TATA Variant"} 
            fuelType={fuelType} 
          />

          {variant && (
            <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h5 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Active Linked Setup</h5>
                <p className="text-xs font-semibold text-zinc-300 mt-1">
                  Model: {selectedCar?.label} • Variant: {variant.name} • Net On-Road: <span className="text-emerald-400 font-mono font-bold">{fmt(finalPrice)}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("quotation")}
                className="bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white font-bold text-xs px-4.5 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer"
              >
                Adjust Price in Quotation
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 mt-16 py-8 text-center text-zinc-600 text-xs">
        <p>© 2026 Qutares. Built with high-fidelity showroom telemetry.</p>
        <p className="text-[10px] text-zinc-700 mt-2">Akshay D | +91 9689811509 | MH-29 Regional Coordinator Hubs</p>
      </footer>
    </div>
  );
}
