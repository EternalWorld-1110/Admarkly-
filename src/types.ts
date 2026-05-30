export type CarKey = "HARRIER" | "SAFARI" | "CURVV" | "SIERRA" | "ALTROZ" | "PUNCH" | "NEXON";

export interface Variant {
  name: string;
  ex: number;
  ins: number;
  rto: number;
  tcs: number;
  onroad: number;
}

export interface CarDetails {
  label: string;
  emoji: string;
  color: string;
  variants: Record<string, Variant[]>;
}

export interface Dealer {
  name: string;
  locations: string;
  contact: string;
}

export type FinanceStatus = "Documents Pending" | "Bank Processing" | "Approved" | "Rejected" | "Disbursed";

export interface FinanceLead {
  id?: string;
  customerName: string;
  mobile: string;
  vehicle: string;
  variant: string;
  emi: number;
  downPayment: number;
  status: FinanceStatus;
  followupDate: string;
  createdAt: string;
}

