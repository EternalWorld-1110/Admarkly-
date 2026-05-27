export type CarKey = "HARRIER" | "SAFARI" | "CURVV" | "SIERRA";

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
