import { useState } from "react";
import { CarKey, Variant } from "../types";
import { CARS, fmt, getFeatures, getVideo, DEALER } from "../data/cars";
import VehicleLogo from "./VehicleLogo";
import { Copy, Send, RotateCcw, Flame, CheckCircle, Video, List, FileText, Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface QuotationPreviewProps {
  customerName: string;
  customerPhone: string;
  carKey: CarKey;
  fuelType: string;
  variant: Variant;
  discount: string;
  discountLabel: string;
  note: string;
  onReset: () => void;
  // Feature 3: Selected Car Color Shade
  selectedColor?: { name: string; hex: string };
  // Feature 5: Selected Accessories checklist from parent State
  selectedAccessories?: Array<{ name: string; price: number }>;
  // Feature 1: Finance Estimates state variables
  includeFinance?: boolean;
  financeTenure?: number;
  financeDownpayment?: number;
  financeRate?: number;
  rtoType?: "standard" | "bh";
  effectiveRto?: number;
}

export default function QuotationPreview({
  customerName,
  customerPhone,
  carKey,
  fuelType,
  variant,
  discount,
  discountLabel,
  note,
  onReset,
  selectedColor,
  selectedAccessories = [],
  includeFinance = false,
  financeTenure = 5,
  financeDownpayment = 0,
  financeRate = 8.75,
  rtoType = "standard",
  effectiveRto,
}: QuotationPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"invoice" | "raw">("invoice");

  const car = CARS[carKey];
  const discNum = Number(discount) || 0;
  
  // Calculate total accessories amount
  const accessoriesTotal = selectedAccessories.reduce((sum, item) => sum + item.price, 0);

  // Use dynamic RTO tax if provided
  const rtoCharge = effectiveRto !== undefined ? effectiveRto : variant.rto;
  const computedOnRoad = variant.ex + variant.ins + rtoCharge + variant.tcs;
  
  // Compute true final price with selected genuine accessories and discount
  const finalPrice = computedOnRoad + accessoriesTotal - discNum;
  
  // Custom Dynamic Color Accent of headers/borders matching the selected color shade!
  const accent = selectedColor?.hex || car.color;

  const keyFeatures = getFeatures(carKey, variant.name);
  const videoUrl = getVideo(carKey, variant.name);
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Calculate Monthly EMI math (standard fixed rate formula)
  const loanPrincipal = Math.max(0, finalPrice - financeDownpayment);
  const monthlyRate = (financeRate / 100) / 12;
  const totalMonths = financeTenure * 12;
  const monthlyEMI = loanPrincipal > 0 && monthlyRate > 0
    ? (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : loanPrincipal / Math.max(1, totalMonths);

  const generateRawWhatsAppText = () => {
    let message = `🚗 *TATA MOTORS — PRICE QUOTATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${currentDate}
👤 *Customer:* ${customerName}${customerPhone ? `\n📞 *Phone:* ${customerPhone}` : ""}
🚙 *Model:* ${car.label}`;

    if (selectedColor) {
      message += `\n🎨 *Color shade:* ${selectedColor.name}`;
    }

    message += `
⚙️ *Type:* ${fuelType}
📋 *Variant:* *${variant.name}*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 *PRICE BREAKDOWN*
• Ex-Showroom:             ${fmt(variant.ex)}
• Insurance (Nil Dep):    ${fmt(variant.ins)}
• RTO Tax & Charges:   ${fmt(rtoCharge)} ${rtoType === "bh" ? "(BH Series 2-Yr)" : ""}${variant.tcs > 0 ? `\n• TCS:                          ${fmt(variant.tcs)}` : ""}`;

    if (selectedAccessories.length > 0) {
      message += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n➕ *GENUINE ADDONS & ACCESSORIES*`;
      selectedAccessories.forEach((item) => {
        message += `\n• ${item.name}: ${fmt(item.price)}`;
      });
      message += `\n• Accessories Subtotal:    ${fmt(accessoriesTotal)}`;
    }

    message += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ *On Road Standard: ${fmt(computedOnRoad)}*`;

    if (accessoriesTotal > 0) {
      message += `\n➕ *Accessories pack: ${fmt(accessoriesTotal)}*`;
    }

    if (discNum > 0) {
      message += `\n🎁 *${discountLabel}:  -${fmt(discNum)}*`;
    }

    message += `\n💥 *Net Payable Amount:  ${fmt(finalPrice)}*`;

    if (includeFinance && loanPrincipal > 0) {
      message += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏦 *FINANCE ESTIMATOR (Indicative)*
• Proposed Tenure:         ${financeTenure} Years (${totalMonths} months)
• margin Down Payment:    ${fmt(financeDownpayment)}
• Principal Loan Amount:   ${fmt(loanPrincipal)}
• Interest Rate:          ${financeRate}% p.a.
• *Estimated Monthly EMI: ${fmt(Math.round(monthlyEMI))}/month*`;
    }

    message += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 *Watch Car Video:*
${videoUrl}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⭐ *KEY FEATURES — ${variant.name}*
${keyFeatures.map((f, i) => `${i + 1}. ${f}`).join("\n")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━${note ? `\n📝 *Note:* ${note}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━` : ""}
📍 *${DEALER.name}*
🗺️ ${DEALER.locations}
📞 *${DEALER.contact}*

_Valid 7 days. Prices subject to change at billing._
_🔑 Book today & drive your dream Tata!_`;

    return message;
  };

  const copyToClipboard = () => {
    const rawText = generateRawWhatsAppText();
    const fallbackCopy = () => {
      const ta = document.createElement("textarea");
      ta.value = rawText;
      ta.style.cssText = "position:fixed;opacity:0;";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error("Could not copy", err);
      }
      document.body.removeChild(ta);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(rawText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        })
        .catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }
  };

  const cleanPhoneForUrl = customerPhone.replace(/\D/g, "");
  const formattedPhoneForUrl = cleanPhoneForUrl.startsWith("91") ? cleanPhoneForUrl : "91" + cleanPhoneForUrl.slice(-10);
  const textMsgForUrl = encodeURIComponent(generateRawWhatsAppText());
  const whatsappDirectUrl = `https://wa.me/${formattedPhoneForUrl}?text=${textMsgForUrl}`;
  const whatsappGeneralUrl = `https://wa.me/?text=${textMsgForUrl}`;

  const sendWhatsAppDirect = () => {
    window.open(whatsappDirectUrl, "_blank");
  };

  const sendWhatsAppGeneral = () => {
    window.open(whatsappGeneralUrl, "_blank");
  };

  return (
    <div className="space-y-6 animate-none">
      {/* Display View Toggle */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60">
        <button
          onClick={() => setViewMode("invoice")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            viewMode === "invoice"
              ? "bg-white text-blue-600 shadow-sm border border-slate-200/80"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Luxury Invoice Mockup
        </button>
        <button
          onClick={() => setViewMode("raw")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            viewMode === "raw"
              ? "bg-white text-blue-600 shadow-sm border border-slate-200/80"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <List className="w-3.5 h-3.5" />
          WhatsApp RAW String
        </button>
      </div>

      {viewMode === "invoice" ? (
        /* invoice visual receipt style component */
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg relative">
          
          {/* Header Colored Stamp Brand with Custom Selected Accent Background */}
          <div
            className="p-6 flex items-center justify-between text-white relative transition-all duration-300 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${accent}, ${accent}90)`,
            }}
          >
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-black/15 px-2.5 py-0.5 rounded-full inline-block mb-1.5 backdrop-blur-sm font-bold">
                Official Estimate
              </span>
              <h2 className="font-display font-medium text-xl tracking-wide">
                TATA MOTORS ESTIMATE
              </h2>
              <p className="text-xs text-white/95 font-medium tracking-wide mt-1">
                Prepared by {DEALER.name}
              </p>
            </div>
            <div className="flex items-center justify-center p-1 rounded-xl bg-black/10 backdrop-blur-xs border border-white/10">
              <VehicleLogo carKey={carKey} isSelected={true} size="md" />
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Meta row cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                  Customer Name
                </span>
                <span className="font-semibold text-sm text-slate-800 mt-0.5 block truncate">
                  {customerName}
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                  Vehicle Model Color
                </span>
                <span
                  className="font-bold text-sm mt-0.5 block truncate uppercase tracking-tight"
                  style={{ color: accent }}
                >
                  {selectedColor ? selectedColor.name : "Showroom Default"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {customerPhone && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                    Contact Phone
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-700 mt-0.5 block">
                    +91 {customerPhone.replace(/\D/g, "").slice(-10)}
                  </span>
                </div>
              )}
              <div
                className={`bg-slate-50 p-3.5 rounded-2xl border border-slate-100 ${
                  !customerPhone ? "col-span-2" : ""
                }`}
              >
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                  Variant Spec & Trans
                </span>
                <span className="font-medium text-xs text-slate-705 mt-0.5 block truncate font-bold text-slate-700">
                  {variant.name} • {fuelType}
                </span>
              </div>
            </div>

            {/* Price section lines */}
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                  Detailed Pricing Itemization
                </h4>
              </div>
              <div className="bg-slate-50/50 rounded-2xl p-4.5 border border-slate-200/60 divide-y divide-slate-100 animate-fadeIn">
                <div className="flex justify-between py-2.5 text-xs">
                  <span className="text-slate-500">Ex-Showroom Price</span>
                  <span className="font-mono text-slate-800 font-semibold">{fmt(variant.ex)}</span>
                </div>
                <div className="flex justify-between py-2.5 text-xs">
                  <span className="text-slate-500">Insurance Policy (Nil Depreciation)</span>
                  <span className="font-mono text-slate-800 font-semibold">{fmt(variant.ins)}</span>
                </div>
                <div className="flex justify-between py-2.5 text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5 flex-wrap">
                    RTO Registration Tax & Charges
                    {rtoType === "bh" && (
                      <span className="bg-blue-50 text-blue-600 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                        BH Series (2-Yr)
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-slate-800 font-semibold">{fmt(rtoCharge)}</span>
                </div>
                {variant.tcs > 0 && (
                  <div className="flex justify-between py-2.5 text-xs">
                    <span className="text-slate-500">Tax Collected at Source (TCS)</span>
                    <span className="font-mono text-slate-800 font-semibold">{fmt(variant.tcs)}</span>
                  </div>
                )}
                
                {/* Genuine Accessories Premium section if added */}
                {selectedAccessories.length > 0 && (
                  <div className="py-2.5 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block tracking-wider font-semibold">
                      ➕ Genuine Addons & Accessories Subtotal
                    </span>
                    <div className="space-y-1 pl-2">
                      {selectedAccessories.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] text-slate-600">
                          <span>{item.name}</span>
                          <span className="font-mono">{fmt(item.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-3 pb-1">
                  <span className="font-bold text-xs text-slate-500">Gross Vehicle Valuation</span>
                  <span className="font-mono font-bold text-sm text-slate-800">
                    {fmt(computedOnRoad + accessoriesTotal)}
                  </span>
                </div>

                {discNum > 0 && (
                  <div className="flex justify-between py-2.5 text-xs text-emerald-600">
                    <span className="font-semibold">🎁 Applied Offer ({discountLabel})</span>
                    <span className="font-mono font-bold">-{fmt(discNum)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-3.5 pb-1 border-t border-slate-200">
                  <span className="font-display font-bold text-sm text-emerald-700">
                    Final Net Payable Total
                  </span>
                  <span className="font-mono font-extrabold text-base text-emerald-700">
                    {fmt(finalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Feature 1: EMI Finance Plan box summary inside Luxury Invoice if ticked */}
            {includeFinance && loanPrincipal > 0 && (
              <div 
                className="bg-slate-50/50 rounded-2xl p-4.5 border transition-all duration-300"
                style={{ borderColor: `${accent}40` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-2 w-2 rounded-full relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-blue-600"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  <h4 className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-450">
                    🏦 Indicative Finance Scheme Estimator
                  </h4>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-mono">Down Payment</span>
                    <span className="text-xs font-mono font-bold text-slate-800 block mt-0.5">{fmt(financeDownpayment)}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-mono">Loan Amount</span>
                    <span className="text-xs font-mono font-bold text-slate-800 block mt-0.5">{fmt(loanPrincipal)}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-mono">Tenure Range</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">{financeTenure} Yrs</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-mono">Annual Rate</span>
                    <span className="text-xs font-mono font-bold text-slate-800 block mt-0.5">{financeRate}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Estimated Monthly EMI</span>
                    <span className="text-[10px] text-slate-500">Fixed monthly installment</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-mono font-bold text-blue-600" style={{ color: accent }}>
                      {fmt(Math.round(monthlyEMI))}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">per month</span>
                  </div>
                </div>
              </div>
            )}

            {/* Video walkthrough feature */}
            <div className="bg-red-50/45 rounded-2xl p-4 border border-red-100 flex gap-3.5 items-start">
              <div className="p-2.5 bg-red-100/40 border border-red-100 text-red-650 rounded-xl shrink-0">
                <Video className="w-4 h-4 text-red-600" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono tracking-widest text-red-500 uppercase font-bold">
                  Walkaround video walkthrough
                </p>
                <p className="text-xs text-slate-650 text-left leading-normal">
                  Buyers are 3.5× more likely to purchase with video orientation. Direct link:
                </p>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-red-600 hover:text-red-750 underline pt-1 inline-block text-xs"
                >
                  Watch Walkaround Video &rarr;
                </a>
              </div>
            </div>

            {/* Key Brochure Premium Specs list */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-450">
                  Key Technical Features & Highlights
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {keyFeatures.map((feat, index) => (
                  <div
                    key={index}
                    className="flex gap-2.5 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-700"
                  >
                    <span className="text-slate-400 font-mono select-none font-semibold">{String(index + 1).padStart(2, "0")}</span>
                    <span className="leading-normal">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {note && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 text-xs space-y-1">
                <h5 className="font-semibold text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  Dealer Coordinator Note
                </h5>
                <p className="text-slate-700 italic">"{note}"</p>
              </div>
            )}

            {/* Dealer Footer */}
            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-xs font-bold text-slate-600 tracking-wide">
                📍 {DEALER.name}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">
                {DEALER.locations} • Tel: {DEALER.contact}
              </p>
              <p className="text-[9px] text-slate-400 font-mono mt-3">
                Valid for 7 business days from generation. Price subject to modifications on billing date.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* raw whatsapp message review box */
        <div className="bg-slate-50 border border-slate-250 rounded-2xl p-5 font-mono text-xs text-slate-650 space-y-2 relative overflow-hidden select-text">
          <div className="absolute right-3 top-3 text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full uppercase font-mono font-bold">
            plain text output
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 pb-2 mb-3">
            Simulated WhatsApp Plain Text Preview
          </p>
          <pre className="whitespace-pre-wrap max-h-[500px] overflow-y-auto pr-2 leading-relaxed text-slate-800 font-mono select-text">
            {generateRawWhatsAppText()}
          </pre>
        </div>
      )}

      {/* Primary Action Row Panels */}
      <div className="space-y-3">
        {customerPhone.replace(/\D/g, "").length >= 10 ? (
          <motion.a
            whileHover={{ scale: 1.015, boxShadow: "0 10px 20px -5px rgba(16, 185, 129, 0.3)" }}
            whileTap={{ scale: 0.985 }}
            href={whatsappDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#10B981] hover:bg-[#059669] text-white px-5 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-200 shadow-sm cursor-pointer no-underline select-none"
          >
            <Send className="w-5 h-5 animate-pulse" />
            <div className="text-left leading-tight">
              <span className="block text-sm font-semibold">Send to Customer WhatsApp</span>
              <span className="block text-[11px] font-normal text-emerald-100">
                Configured with Phone: +91 {customerPhone.replace(/\D/g, "").slice(-10)}
              </span>
            </div>
          </motion.a>
        ) : (
          <div className="bg-blue-50/50 rounded-2xl p-4.5 border border-blue-100 text-center text-xs text-slate-500 leading-normal font-medium">
            ℹ️ Add a 10-digit WhatsApp number on the configuration form to unlock direct message transmission.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3.5">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={whatsappGeneralUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-slate-50 border border-slate-200 py-3 rounded-2xl font-semibold text-xs text-slate-700 cursor-pointer flex items-center justify-center gap-2 transition-all text-center justify-center items-center no-underline select-none shadow-xs"
          >
            <Send className="w-3.5 h-3.5 text-slate-400" />
            Open Contact List
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={copyToClipboard}
            className={`py-3 rounded-2xl font-bold text-xs cursor-pointer flex items-center justify-center gap-2 transition-all shadow-xs ${
              copied
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                : "bg-white hover:bg-slate-50 border border-slate-200 text-slate-700"
            }`}
          >
            {copied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Copied Quote!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                Copy Plain Text
              </>
            )}
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50/60 transition-all font-semibold text-xs cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Create New Valuation Quote
        </motion.button>
      </div>
    </div>
  );
}
