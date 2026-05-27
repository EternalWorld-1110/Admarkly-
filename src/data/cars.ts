import { CarKey, CarDetails, Dealer, Variant } from "../types";

export const DEALER: Dealer = {
  name: "MAC VEHICLES PVT LTD",
  locations: "Nagpur",
  contact: "Akshay D | 9689811509",
};

// Formatting helpers
export const fmt = (n: number) => "₹" + Number(n).toLocaleString("en-IN");
export const fmtShort = (n: number) => n >= 100000 ? "₹" + (n / 100000).toFixed(2) + "L" : fmt(n);

// Walkaround Video URLs per variant
export function getVideo(carKey: CarKey, variantName: string): string {
  const n = variantName.toUpperCase();

  // Harrier
  if (carKey === "HARRIER") {
    if (n.includes("FEARLESS UL"))      return "https://www.youtube.com/results?search_query=2025+tata+harrier+fearless+ul+rdk+walkaround";
    if (n.includes("FEARLESS X PLUS"))  return "https://www.youtube.com/results?search_query=2025+tata+harrier+fearless+x+plus+walkaround";
    if (n.includes("FEARLESS X"))       return "https://www.youtube.com/results?search_query=2025+tata+harrier+fearless+x+walkaround";
    if (n.includes("ADVENTURE X PLUS")) return "https://www.youtube.com/results?search_query=2025+tata+harrier+adventure+x+plus+walkaround";
    if (n.includes("ADVENTURE X"))      return "https://www.youtube.com/results?search_query=2025+tata+harrier+adventure+x+walkaround";
    if (n.includes("PURE X"))           return "https://www.youtube.com/results?search_query=2025+tata+harrier+pure+x+walkaround";
    return "https://www.youtube.com/results?search_query=2025+tata+harrier+smart+petrol+mt+walkaround";
  }

  // Safari
  if (carKey === "SAFARI") {
    if (n.includes("ACCOMPLISHED UL"))     return "https://www.youtube.com/results?search_query=2025+tata+safari+accomplished+ul+rdk+walkaround";
    if (n.includes("ACCOMPLISHED X PLUS")) return "https://www.youtube.com/results?search_query=2025+tata+safari+accomplished+x+plus+walkaround";
    if (n.includes("ACCOMPLISHED X"))      return "https://www.youtube.com/results?search_query=2025+tata+safari+accomplished+x+walkaround";
    if (n.includes("ADVENTURE X PLUS"))    return "https://www.youtube.com/results?search_query=2025+tata+safari+adventure+x+plus+walkaround";
    if (n.includes("PURE X"))              return "https://www.youtube.com/results?search_query=2025+tata+safari+pure+x+walkaround";
    return "https://www.youtube.com/results?search_query=2025+tata+safari+smart+walkaround";
  }

  // Curvv
  if (carKey === "CURVV") {
    if (n.includes("ACCOMPLISHED PLUS")) return "https://www.youtube.com/results?search_query=2025+tata+curvv+accomplished+plus+adas+walkaround";
    if (n.includes("ACCOMPLISHED"))      return "https://www.youtube.com/results?search_query=2025+tata+curvv+accomplished+s+walkaround";
    if (n.includes("CREATIVE"))          return "https://www.youtube.com/results?search_query=2025+tata+curvv+creative+walkaround";
    if (n.includes("PURE PLUS") || n.includes("PURE+")) return "https://www.youtube.com/results?search_query=2025+tata+curvv+pure+plus+walkaround";
    return "https://www.youtube.com/results?search_query=2025+tata+curvv+smart+1.2+tc+walkaround";
  }

  // Sierra
  if (carKey === "SIERRA") {
    if (n.includes("ACCOMPLISHED PLUS")) return "https://www.youtube.com/results?search_query=2025+tata+sierra+accomplished+plus+tgdi+at+walkaround";
    if (n.includes("ACCOMPLISHED"))      return "https://www.youtube.com/results?search_query=2025+tata+sierra+accomplished+plus+tgdi+at+walkaround";
    if (n.includes("ADVENTURE PLUS"))    return "https://www.youtube.com/results?search_query=2025+tata+sierra+adventure+plus+walkaround";
    if (n.includes("ADVENTURE"))         return "https://www.youtube.com/results?search_query=2025+tata+sierra+adventure+walkaround";
    if (n.includes("PURE PLUS"))         return "https://www.youtube.com/results?search_query=2025+tata+sierra+pure+plus+walkaround";
    if (n.includes("PURE"))              return "https://www.youtube.com/results?search_query=2025+tata+sierra+pure+walkaround";
    return "https://www.youtube.com/results?search_query=2025+tata+sierra+smart+plus+walkaround";
  }

  return "https://www.youtube.com/results?search_query=2025+tata+car+walkaround";
}

// Key feature extraction based on brochure specifications
export function getFeatures(carKey: CarKey, variantName: string): string[] {
  const n = variantName.toUpperCase();

  // Tata Harrier features
  if (carKey === "HARRIER") {
    if (n.includes("FEARLESS UL")) return [
      "36.9 cm Cinematic Infotainment by Harman™ (Samsung Neo QLED)",
      "ADAS Level 2+ with Intelligent Speed Assist & 20 functionalities",
      "7 Airbags incl. Driver Knee Airbag",
      "Dolby Atmos™ with 13 JBL™ Audio Modes",
      "VisioneX E-IRVM (Electronic Inside Rear View Mirror)",
      "Built-in DashCam & DVR",
      "Alexa™ Home2Car & Car2Home Connectivity",
      "VisionSync Memory ORVM with Auto Reverse Dip",
      "ClearView Dual Camera Washer",
      "Fast Charge USB Type-C 65W",
      "Arcade App Suite (Amazon Prime, JioHotstar etc.)",
      "Built-in Navigation with Mappls™ Auto",
      "Sliding Armrest",
      "Connected Vehicle Tech with iRA 2.0",
    ];
    if (n.includes("FEARLESS X PLUS")) return [
      "ADAS Level 2 with Lane Keep Assist, AEB, FCW & 17 functionalities",
      "10 JBL™ Speakers with Central Speaker & Subwoofer",
      "7 Airbags (incl. Driver Knee Airbag)",
      "Gesture Controlled Powered Tailgate",
      "4-Way Powered Co-Driver Seat",
      "Connected Vehicle Tech with iRA 2.0",
      "Alexa™ Voice Commands with Car-to-Home",
      "Voice-Assisted Panoramic Sunroof with Mood Lighting",
      "Air Purifier with AQI Display",
      "Bejeweled Terrain Response Mode Selector with Display",
      "Harman™ AudioworX Advanced with 13 JBL™ Audio Modes",
      "Front LED Fog Lamps with Cornering Function",
      "Hill Descent Control",
      "Front Armrest with Cooled Storage",
    ];
    if (n.includes("FEARLESS X")) return [
      "31.24 cm Ultra View HD Harman™ Infotainment Touchscreen",
      "31.24 cm HD Digital Cluster",
      "9 JBL™ Speakers with Subwoofer",
      "Ventilated Front Row Seats (Driver & Co-Driver)",
      "Ergo Lux Powered Driver Seat with Memory & Welcome",
      "Voice-Assisted Dual Zone Fully Automatic Air Conditioning",
      "Winged Comfort Headrest on 2nd Row Seats",
      "R18 Alloy Wheels",
      "Wireless Charger",
      "Smart Key Entry",
      "Multi Mood Lights on Dashboard",
      "Tyre Pressure Monitoring System (TPMS)",
      "2nd Row Roll-up Sun Blinds",
      "Auto-Dimming IRVM",
    ];
    if (n.includes("ADVENTURE X PLUS")) return [
      "ADAS with Adaptive Cruise Control (AT) & 12 other functionalities",
      "Quad Disc Braking",
      "Advanced ESP with Driver Doze-off Alert",
      "Trail Hold Electronic Park Brake (EPB) with Auto Hold",
      "Onyx Trail Leatherette Interiors",
      "Ergo Lux Powered Driver Seat",
      "Multi Drive Modes (City, Sports & Eco)",
      "Trail Response Modes (Normal, Rough, Wet)",
      "6 Speakers (4 Speakers + 2 Tweeters)",
      "Front 45W C-Type Charger Slot & A-Type Docking Module",
      "Rear Defogger",
      "One Touch Auto-up Driver Door Window with Anti-Pinch",
    ];
    if (n.includes("ADVENTURE X")) return [
      "Onyx Trail Leatherette Interiors",
      "Ergo Lux Powered Driver Seat",
      "Multi Drive Modes (City, Sports & Eco)",
      "Trail Response Modes (Normal, Rough, Wet)",
      "6 Speakers (4 + 2 Tweeters)",
      "Front 45W C-Type Charger Slot",
      "Rear Defogger",
      "One Touch Auto-up Driver Window with Anti-Pinch",
      "Rear Parcel Shelf",
      "Voice-Assisted Panoramic Sunroof (from Pure X)",
      "360° HD Surround View System",
      "26.03 cm HD Harman™ Infotainment Touchscreen",
    ];
    if (n.includes("PURE X")) return [
      "Voice-Assisted Panoramic Sunroof",
      "360° HD Surround View System",
      "26.03 cm HD Harman™ Infotainment Touchscreen",
      "26.03 cm HD Digital Cluster",
      "Cruise Control",
      "Electrically Adjustable ORVMs with Autofold",
      "Auto Headlamps & Rain Sensing Wipers",
      "Wireless Android Auto™ & Apple CarPlay™",
      "Push Button Start with Remote Key",
      "Paddle Shifters (AT) / Command Shifter (AT)",
      "250+ Native Voice Commands",
      "Leather Wrapped Steering Wheel",
    ];
    return [
      "17.78 cm Digital Cockpit",
      "R17 Alloy Wheels",
      "6 Airbags (Driver, Co-Driver, Curtain & Side)",
      "Fully Automatic Temperature Control",
      "Bi-LED Projector Head Lamp",
      "Tilt & Telescopic Steering Wheel with Illuminated Logo",
      "Front LED DRLs & LED Tail Lamps",
      "ABS with EBD & Electronic Stability Program (ESP)",
      "Hill Assist (Hill Ascent)",
      "Traction Control",
      "ISOFIX Child Seat Anchors",
      "Rear Parking Sensor",
    ];
  }

  // Tata Safari features
  if (carKey === "SAFARI") {
    if (n.includes("ACCOMPLISHED UL")) return [
      "36.9 cm Cinematic Infotainment by Harman™ (Samsung Neo QLED)",
      "ADAS Level 2+ with Intelligent Speed Assist & 20 functionalities",
      "VisioneX E-IRVM (Electronic Inside Rear View Mirror)",
      "Dolby Atmos™",
      "Built-in DashCam & DVR",
      "Alexa™ Home2Car & Car2Home Connectivity",
      "Oyster White & Gold Interior Theme",
      "Arcade App Suite (Amazon Prime, JioHotstar etc.)",
      "Built-in Navigation with Mappls™ Auto",
      "Sliding Armrest",
      "ClearView Dual Camera Washer",
      "Fast Charge USB Type-C 65W",
      "VisionSync Memory ORVM with Auto Reverse Dip",
    ];
    if (n.includes("ACCOMPLISHED X PLUS")) return [
      "ADAS Level 2 with Lane Keep Assist, AEB, FCW & 17 functionalities",
      "10 JBL™ Speakers with Central Speaker & Subwoofer",
      "7 Airbags (incl. Driver Knee Airbag)",
      "R19 Dual-Tone Diamond Cut Spider Alloy Wheels",
      "4-Way Powered Co-Driver Seat with Electric Boss Mode",
      "2nd Row Ventilated Captain Seats (6-seater)",
      "Connected Vehicle Tech with iRA 2.0",
      "Alexa™ Voice Commands with Car-to-Home",
      "Voice-Assisted Panoramic Sunroof with Mood Lighting",
      "Air Purifier with AQI Display",
      "Bejeweled Terrain Response Mode Selector with Display",
      "Harman™ AudioworX Advanced with 13 JBL™ Audio Modes",
      "Hill Descent Control",
      "Front Armrest with Cooled Storage",
    ];
    if (n.includes("ACCOMPLISHED X")) return [
      "31.24 cm Ultra View HD Harman™ Infotainment Touchscreen",
      "9 JBL™ Speakers with Subwoofer",
      "Ventilated Front Row Seats (Driver & Co-Driver)",
      "Gesture Controlled Powered Tailgate",
      "Voice-Assisted Dual Zone Fully Automatic AC",
      "Oyster White & Titan Brown Interior Theme",
      "Winged Comfort Headrest on 2nd Row Seats",
      "Wireless Charger",
      "Smart Key Entry",
      "Mood Lights on Dashboard & Door",
      "Tyre Pressure Monitoring System (TPMS)",
      "2nd Row Roll-up Sun Blinds",
      "3rd Row AC Unit with Speed Control",
      "Follow Me Headlamps",
    ];
    if (n.includes("ADVENTURE X PLUS")) return [
      "ADAS with Adaptive Cruise Control (AT) & 12 other functionalities",
      "R18 Apex Forged Alloys",
      "Adventure Oak Leatherette Interiors",
      "Ergo Lux Powered Driver Seat with Memory & Welcome",
      "Trail Response Modes (Normal, Rough, Wet)",
      "Trail Hold Electronic Park Brake (EPB) with Auto Hold",
      "Advanced ESP with Driver Doze-off Alert",
      "Multi Drive Modes (City, Sports & Eco)",
      "6 Speakers (4 + 2 Tweeters)",
      "Boss Mode",
      "Rear Defogger",
      "One Touch Auto-up Driver Window with Anti-Pinch",
    ];
    if (n.includes("PURE X")) return [
      "Voice-Assisted Panoramic Sunroof",
      "360° HD Surround View System",
      "26.03 cm HD Harman™ Infotainment Touchscreen",
      "26.03 cm HD Digital Cluster",
      "Cruise Control",
      "Electrically Adjustable ORVMs with Autofold",
      "Auto Headlamps & Rain Sensing Wipers",
      "Wireless Android Auto™ & Apple CarPlay™",
      "Push Button Start with Remote Key",
      "250+ Native Voice Commands",
      "Leather Wrapped Steering Wheel",
      "Paddle Shifters (AT)",
    ];
    return [
      "17.78 cm Digital Cockpit",
      "R17 Alloy Wheels",
      "6 Airbags (Driver, Co-Driver, Curtain & Side)",
      "All Wheel Disc Brakes",
      "Fully Automatic Temperature Control",
      "Bi-LED Projector Head Lamp",
      "3-Row Seating (7 Seater)",
      "ABS with EBD & Electronic Stability Program (ESP)",
      "Hill Assist (Hill Ascent)",
      "Traction Control",
      "ISOFIX Child Seat Anchors",
      "Front Row Umbrella Holders",
    ];
  }

  // Tata Curvv features
  if (carKey === "CURVV") {
    if (n.includes("ACCOMPLISHED PLUS")) return [
      "31.24 cm (12.3\") Touchscreen Infotainment by Harman™",
      "ADAS Level 2 with Adaptive Cruise Control & more",
      "Voice-Assisted Panoramic Sunroof with Mood Lighting",
      "9 JBL™ Speakers including Subwoofer",
      "Multiple Voice Assistants (Native, Alexa, Siri, Google)",
      "Wireless Android Auto™ & Apple CarPlay™",
      "Ventilated Front Seats",
      "Wireless Smartphone Charger",
      "R18 Diamond Cut Alloy Wheels",
      "Persona Themed Interiors with Mood Lighting",
      "500L Boot Space",
      "Twin Zone Climate Concierge AC",
    ];
    if (n.includes("ACCOMPLISHED")) return [
      "31.24 cm (12.3\") Touchscreen Infotainment by Harman™",
      "Voice-Assisted Panoramic Sunroof with Mood Lighting",
      "9 JBL™ Speakers including Subwoofer",
      "Multiple Voice Assistants (Native, Alexa, Siri, Google)",
      "Wireless Android Auto™ & Apple CarPlay™",
      "Ventilated Front Seats",
      "Wireless Smartphone Charger",
      "R18 Diamond Cut Alloy Wheels",
      "Persona Themed Interiors",
      "4-Spoke Illuminated Digital Steering Wheel",
      "Themed Dashboard with Mood Lighting",
      "Serenity Screen Rear Sunshade",
    ];
    if (n.includes("CREATIVE")) return [
      "Panoramic Sunroof",
      "26.03 cm Harman™ Infotainment Touchscreen",
      "Wireless Android Auto™ & Apple CarPlay™",
      "JBL Sound System",
      "Wireless Smartphone Charger",
      "R17 Alloy Wheels",
      "Push Button Start with Remote Key",
      "Auto Climate Control",
      "Multi Drive Modes (Eco, City, Sport)",
      "Paddle Shifters (DCA)",
      "6 Airbags",
      "Rear Camera",
    ];
    if (n.includes("PURE")) return [
      "Voice-Assisted Panoramic Sunroof",
      "26.03 cm Harman™ Infotainment Touchscreen",
      "Wireless Android Auto™ & Apple CarPlay™",
      "6 Airbags",
      "Push Button Start with Remote Key",
      "Auto Climate Control",
      "Rear Parking Camera",
      "Electrically Adjustable ORVMs with Autofold",
      "Cruise Control",
      "Smart A-Type & C-Type Chargers",
      "Flush Door Handles with Welcome Light",
      "Sequential LED DRLs with Welcome & Goodbye Animation",
    ];
    return [
      "17.78 cm Digital Cockpit",
      "Sequential LED DRLs with Welcome & Goodbye Animation",
      "Bi-Function LED Head Lamps",
      "LED Fog Lamps with Cornering",
      "R17 Alloy Wheels",
      "6 Airbags",
      "ABS with EBD",
      "Fully Automatic Temperature Control",
      "Rear Parking Sensors",
      "Flush Door Handles with Welcome Light",
      "Shark Fin Antenna with GPS",
    ];
  }

  // Tata Sierra features
  if (carKey === "SIERRA") {
    if (n.includes("ACCOMPLISHED PLUS")) return [
      "Horizon View Triple Screen Infotainment Experience",
      "ADAS Level 2+ with Advanced Driver Assistance",
      "Dolby Atmos™ with 10-Speaker JBL™ Music System + Subwoofer",
      "Arcade App Suite (Amazon Prime, JioHotstar etc.)",
      "Alexa™ Home2Car & Car2Home Connectivity",
      "Connected Vehicle Tech with iRA 2.0",
      "Built-in Navigation with Mappls™ Auto",
      "Drive Modes (City, Sports, Eco)",
      "Front Parking Sensors",
      "Ventilated Front Seats",
      "Panoramic Sunroof",
      "7 Airbags",
    ];
    if (n.includes("ACCOMPLISHED")) return [
      "36.9 cm Cinematic Infotainment by Harman™",
      "ADAS Level 2+ with 22 Functionalities",
      "10-Speaker JBL™ System with Subwoofer",
      "Connected Vehicle Tech with iRA 2.0",
      "Alexa™ Voice Commands",
      "Panoramic Sunroof",
      "Ventilated Front Seats",
      "7 Airbags",
      "Wireless Android Auto™ & Apple CarPlay™",
      "Drive Modes (City, Sports, Eco)",
      "Built-in Navigation with Mappls™ Auto",
      "R18 Alloy Wheels",
    ];
    if (n.includes("ADVENTURE PLUS")) return [
      "26.03 cm HD Harman™ Infotainment Touchscreen",
      "4-Way Powered Co-Driver Seat with Electric Boss Mode",
      "Voice-Assisted Dual Zone Fully Automatic AC",
      "ADAS with Adaptive Cruise Control (AT)",
      "6 Airbags",
      "Panoramic Sunroof",
      "Wireless Android Auto™ & Apple CarPlay™",
      "Push Button Start",
      "360° Surround View Camera",
      "Multi Drive Modes (Eco, City, Sport)",
      "R18 Alloy Wheels",
      "Wireless Charger",
    ];
    if (n.includes("ADVENTURE")) return [
      "26.03 cm HD Harman™ Infotainment Touchscreen",
      "Panoramic Sunroof",
      "6 Airbags",
      "Wireless Android Auto™ & Apple CarPlay™",
      "Push Button Start",
      "Auto Climate Control",
      "360° Surround View Camera",
      "Multi Drive Modes",
      "R17 Alloy Wheels",
      "Rear Defogger",
      "Electrically Adjustable ORVMs with Autofold",
    ];
    if (n.includes("PURE PLUS")) return [
      "20.32 cm Harman™ Infotainment Touchscreen",
      "6 Airbags",
      "Panoramic Sunroof",
      "Wireless Android Auto™ & Apple CarPlay™",
      "Push Button Start with Remote Key",
      "Auto Climate Control",
      "Rear Camera",
      "Rain Sensing Wipers",
      "Auto Headlamps",
      "Electrically Adjustable ORVMs with Autofold",
      "R16 Alloy Wheels",
    ];
    if (n.includes("PURE")) return [
      "20.32 cm Harman™ Infotainment Touchscreen",
      "6 Airbags",
      "Wireless Android Auto™ & Apple CarPlay™",
      "Push Button Start with Remote Key",
      "Auto Climate Control",
      "Rear Camera",
      "Electrically Adjustable ORVMs",
      "ABS with EBD",
      "ESP with Traction Control",
      "Hill Assist",
      "Rear Parking Sensors",
    ];
    return [
      "17.78 cm Digital Cockpit",
      "R16 Steel Wheels",
      "6 Airbags",
      "ABS with EBD",
      "Electronic Stability Program (ESP)",
      "Hill Assist (Ascent)",
      "Fully Automatic Temperature Control",
      "Rear Parking Sensors",
      "Traction Control",
      "ISOFIX Child Seat Anchors",
      "LED DRLs",
    ];
  }

  return ["Please refer to the official vehicle brochure for active features."];
}

// Vehicle Prices & Variants Dictionary matching dealership logs
export const CARS: Record<CarKey, CarDetails> = {
  HARRIER: {
    label: "Tata Harrier", emoji: "🚙", color: "#ea580c", // Orange
    variants: {
      "Petrol MT": [
        { name: "SMART", ex: 1289000, ins: 65333, rto: 161924, tcs: 12890, onroad: 1529147 },
        { name: "PURE X", ex: 1599990, ins: 78267, rto: 199989, tcs: 16000, onroad: 1894246 },
        { name: "PURE X DK", ex: 1663390, ins: 80904, rto: 207749, tcs: 16634, onroad: 1968677 },
        { name: "ADVENTURE X", ex: 1686490, ins: 81864, rto: 210577, tcs: 16865, onroad: 1995796 },
        { name: "ADVENTURE X DK", ex: 1738490, ins: 84027, rto: 216942, tcs: 17385, onroad: 2056844 },
        { name: "ADVENTURE X PLUS", ex: 1713590, ins: 82991, rto: 213894, tcs: 17136, onroad: 2027611 },
        { name: "ADVENTURE X PLUS DK", ex: 1765590, ins: 85154, rto: 220259, tcs: 17656, onroad: 2088659 },
        { name: "FEARLESS X", ex: 1999990, ins: 94903, rto: 248949, tcs: 20000, onroad: 2363842 },
        { name: "FEARLESS X DK", ex: 2065390, ins: 97623, rto: 278021, tcs: 20654, onroad: 2461688 },
        { name: "FEARLESS X PLUS", ex: 2211990, ins: 103720, rto: 297460, tcs: 22120, onroad: 2635290 },
        { name: "FEARLESS X PLUS DK", ex: 2263990, ins: 105883, rto: 304356, tcs: 22640, onroad: 2696869 },
        { name: "FEARLESS UL", ex: 2271990, ins: 106215, rto: 305416, tcs: 22720, onroad: 2706341 },
        { name: "FEARLESS UL RDK", ex: 2326990, ins: 108503, rto: 312709, tcs: 23270, onroad: 2771472 },
      ],
      "Petrol AT": [
        { name: "PURE X AT", ex: 1753190, ins: 84638, rto: 218741, tcs: 17532, onroad: 2074101 },
        { name: "PURE X DK AT", ex: 1791090, ins: 86215, rto: 223380, tcs: 17911, onroad: 2118596 },
        { name: "ADVENTURE X AT", ex: 1847290, ins: 88552, rto: 230259, tcs: 18473, onroad: 2184574 },
        { name: "ADVENTURE X PLUS AT", ex: 1874390, ins: 89679, rto: 233576, tcs: 18744, onroad: 2216389 },
        { name: "FEARLESS X AT", ex: 2178890, ins: 102343, rto: 293071, tcs: 21789, onroad: 2596093 },
        { name: "FEARLESS X PLUS AT", ex: 2353890, ins: 109622, rto: 316276, tcs: 23539, onroad: 2803327 },
        { name: "FEARLESS UL AT", ex: 2413890, ins: 112117, rto: 324232, tcs: 24139, onroad: 2874378 },
        { name: "FEARLESS UL RDK AT", ex: 2468890, ins: 114405, rto: 331525, tcs: 24689, onroad: 2939509 },
      ],
      "Diesel MT": [
        { name: "SMART DIESEL", ex: 1399990, ins: 69948, rto: 204069, tcs: 14000, onroad: 1688007 },
        { name: "PURE X DIESEL", ex: 1714990, ins: 83049, rto: 249051, tcs: 17150, onroad: 2064240 },
        { name: "ADVENTURE X DIESEL", ex: 1814990, ins: 87208, rto: 263331, tcs: 18150, onroad: 2183679 },
        { name: "ADVENTURE X PLUS DIESEL", ex: 1844990, ins: 88456, rto: 267615, tcs: 18450, onroad: 2219510 },
        { name: "FEARLESS X DIESEL", ex: 2124990, ins: 100101, rto: 329273, tcs: 21250, onroad: 2575615 },
        { name: "FEARLESS X PLUS DIESEL", ex: 2324990, ins: 108419, rto: 359873, tcs: 23250, onroad: 2816533 },
        { name: "FEARLESS UL DIESEL", ex: 2384990, ins: 110915, rto: 369053, tcs: 23850, onroad: 2888808 },
        { name: "FEARLESS UL RDK DIESEL", ex: 2439990, ins: 113202, rto: 377468, tcs: 24400, onroad: 2955060 },
      ],
      "Diesel AT": [
        { name: "PURE X DIESEL AT", ex: 1864990, ins: 89288, rto: 270471, tcs: 18650, onroad: 2243398 },
        { name: "ADVENTURE X DIESEL AT", ex: 1964990, ins: 93447, rto: 284751, tcs: 19650, onroad: 2362837 },
        { name: "FEARLESS X DIESEL AT", ex: 2279990, ins: 106548, rto: 352988, tcs: 22800, onroad: 2762326 },
        { name: "FEARLESS UL DIESEL AT", ex: 2529990, ins: 116945, rto: 391238, tcs: 25300, onroad: 3063474 },
        { name: "FEARLESS UL RDK DIESEL AT", ex: 2584990, ins: 119233, rto: 399653, tcs: 25850, onroad: 3129726 },
      ],
    },
  },
  SAFARI: {
    label: "Tata Safari", emoji: "🚙", color: "#0d9488", // Teal/emerald
    variants: {
      "Petrol MT": [
        { name: "SMART SAFARI", ex: 1329000, ins: 74084, rto: 166820, tcs: 13290, onroad: 1583194 },
        { name: "PURE X SAFARI", ex: 1649190, ins: 84888, rto: 206011, tcs: 16492, onroad: 1956581 },
        { name: "ADVENTURE X PLUS SAFARI", ex: 1775090, ins: 89136, rto: 221422, tcs: 17751, onroad: 2103399 },
        { name: "ACCOMPLISHED X SAFARI", ex: 2084290, ins: 99569, rto: 259268, tcs: 20843, onroad: 2463970 },
        { name: "ACCOMPLISHED X PLUS SAFARI", ex: 2273490, ins: 105953, rto: 282426, tcs: 22735, onroad: 2684604 },
        { name: "ACCOMPLISHED UL SAFARI", ex: 2333490, ins: 107978, rto: 289770, tcs: 23335, onroad: 2754573 },
        { name: "ACCOMPLISHED UL RDK SAFARI", ex: 2368490, ins: 109159, rto: 294054, tcs: 23685, onroad: 2795388 },
      ],
      "Petrol AT": [
        { name: "PURE X AT SAFARI", ex: 1791090, ins: 89676, rto: 223380, tcs: 17911, onroad: 2122057 },
        { name: "ADVENTURE X PLUS AT SAFARI", ex: 1935990, ins: 94565, rto: 241116, tcs: 19360, onroad: 2291031 },
        { name: "ACCOMPLISHED X AT SAFARI", ex: 2249890, ins: 105157, rto: 279537, tcs: 22499, onroad: 2657083 },
        { name: "ACCOMPLISHED X PLUS AT SAFARI", ex: 2415390, ins: 110741, rto: 299794, tcs: 24154, onroad: 2850079 },
        { name: "ACCOMPLISHED UL AT SAFARI", ex: 2475390, ins: 112766, rto: 307138, tcs: 24754, onroad: 2920048 },
        { name: "ACCOMPLISHED UL RDK AT SAFARI", ex: 2510390, ins: 113947, rto: 311422, tcs: 25104, onroad: 2960863 },
      ],
      "Diesel MT": [
        { name: "SMART DIESEL SAFARI", ex: 1474990, ins: 73067, rto: 214779, tcs: 14750, onroad: 1777586 },
        { name: "PURE X DIESEL SAFARI", ex: 1764990, ins: 85129, rto: 256191, tcs: 17650, onroad: 2123959 },
        { name: "ADVENTURE X PLUS DIESEL SAFARI", ex: 1899990, ins: 90743, rto: 275469, tcs: 19000, onroad: 2285202 },
        { name: "ACCOMPLISHED X DIESEL SAFARI", ex: 2199990, ins: 103220, rto: 340748, tcs: 22000, onroad: 2665959 },
        { name: "ACCOMPLISHED X PLUS DIESEL SAFARI", ex: 2389990, ins: 111123, rto: 369818, tcs: 23900, onroad: 2894831 },
        { name: "ACCOMPLISHED UL DIESEL SAFARI", ex: 2449990, ins: 113618, rto: 378998, tcs: 24500, onroad: 2967106 },
        { name: "ACCOMPLISHED UL RDK DIESEL SAFARI", ex: 2484990, ins: 115074, rto: 384353, tcs: 24850, onroad: 3009267 },
      ],
      "Diesel AT": [
        { name: "PURE X DIESEL AT SAFARI", ex: 1909990, ins: 91159, rto: 276897, tcs: 19100, onroad: 2297146 },
        { name: "ADVENTURE X PLUS DIESEL AT SAFARI", ex: 2064990, ins: 97606, rto: 320093, tcs: 20650, onroad: 2503339 },
        { name: "ACCOMPLISHED X DIESEL AT SAFARI", ex: 2364990, ins: 110083, rto: 365993, tcs: 23650, onroad: 2864716 },
        { name: "ACCOMPLISHED X PLUS DIESEL AT SAFARI", ex: 2534990, ins: 117153, rto: 392003, tcs: 25350, onroad: 3069496 },
        { name: "ACCOMPLISHED UL DIESEL AT SAFARI", ex: 2594990, ins: 119649, rto: 401183, tcs: 25950, onroad: 3141772 },
        { name: "ACCOMPLISHED UL RDK DIESEL AT SAFARI", ex: 2629990, ins: 121104, rto: 406538, tcs: 26300, onroad: 3183933 },
      ],
    },
  },
  CURVV: {
    label: "Tata Curvv", emoji: "🏎️", color: "#d97706", // Amber
    variants: {
      "Petrol MT": [
        { name: "SMART 1.2 TC", ex: 969990, ins: 52064, rto: 122877, tcs: 0, onroad: 1144931 },
        { name: "PURE PLUS 1.2 TC", ex: 1099990, ins: 57471, rto: 138789, tcs: 11000, onroad: 1307250 },
        { name: "CREATIVE 1.2 TC", ex: 1219990, ins: 62462, rto: 153477, tcs: 12200, onroad: 1448129 },
        { name: "ACCOMPLISHED S 1.2 TC", ex: 1459990, ins: 72444, rto: 182853, tcs: 14600, onroad: 1729886 },
        { name: "ACCOMPLISHED PLUS ADAS 1.2 GDI", ex: 1724990, ins: 83465, rto: 215289, tcs: 17250, onroad: 2040994 },
      ],
      "Petrol DCA": [
        { name: "PURE PLUS DCA 1.2", ex: 1249990, ins: 63710, rto: 157149, tcs: 12500, onroad: 1483348 },
        { name: "CREATIVE DCA 1.2", ex: 1369990, ins: 68701, rto: 171837, tcs: 13700, onroad: 1624227 },
        { name: "ACCOMPLISHED S DCA 1.2", ex: 1614990, ins: 78890, rto: 201825, tcs: 16150, onroad: 1911855 },
        { name: "ACCOMPLISHED PLUS DCA GDI", ex: 1779990, ins: 85753, rto: 222021, tcs: 17800, onroad: 2105563 },
      ],
      "Diesel MT": [
        { name: "SMART 1.5 DIESEL", ex: 1119990, ins: 58303, rto: 141237, tcs: 11200, onroad: 1330730 },
        { name: "PURE PLUS 1.5 DIESEL", ex: 1249990, ins: 63710, rto: 157149, tcs: 12500, onroad: 1483348 },
        { name: "CREATIVE 1.5 DIESEL", ex: 1369990, ins: 68701, rto: 171837, tcs: 13700, onroad: 1624227 },
        { name: "ACCOMPLISHED S 1.5 DIESEL", ex: 1599990, ins: 78266, rto: 199989, tcs: 16000, onroad: 1894245 },
        { name: "ACCOMPLISHED PLUS ADAS 1.5", ex: 1729990, ins: 83673, rto: 215901, tcs: 17300, onroad: 2046864 },
      ],
      "Diesel DCA": [
        { name: "PURE PLUS DCA 1.5", ex: 1394990, ins: 69740, rto: 174897, tcs: 13950, onroad: 1653577 },
        { name: "CREATIVE S DCA 1.5", ex: 1564990, ins: 76811, rto: 195705, tcs: 15650, onroad: 1853155 },
        { name: "ACCOMPLISHED S DCA 1.5", ex: 1749990, ins: 84505, rto: 218349, tcs: 17500, onroad: 2070343 },
        { name: "ACCOMPLISHED PLUS DCA 1.5", ex: 1874990, ins: 89704, rto: 233649, tcs: 18750, onroad: 2217092 },
      ],
    },
  },
  SIERRA: {
    label: "Tata Sierra", emoji: "🚙", color: "#3b82f6", // Blue
    variants: {
      "Petrol MT": [
        { name: "SMART PLUS 1.5P", ex: 1149000, ins: 59509, rto: 144768, tcs: 11490, onroad: 1364787 },
        { name: "PURE 1.5P", ex: 1299000, ins: 65748, rto: 163148, tcs: 12990, onroad: 1540886 },
        { name: "PURE PLUS 1.5P", ex: 1449000, ins: 71987, rto: 181508, tcs: 14490, onroad: 1716984 },
        { name: "ADVENTURE 1.5P", ex: 1529000, ins: 75314, rto: 191300, tcs: 15290, onroad: 1810903 },
        { name: "ADVENTURE PLUS 1.5P", ex: 1599000, ins: 78225, rto: 199868, tcs: 15990, onroad: 1893083 },
        { name: "ACCOMPLISHED 1.5P", ex: 1799000, ins: 86543, rto: 224348, tcs: 17990, onroad: 2127881 },
      ],
      "Petrol AT": [
        { name: "ADVENTURE TGDI AT", ex: 1799000, ins: 86543, rto: 224348, tcs: 17990, onroad: 2127881 },
        { name: "ACCOMPLISHED TGDI AT", ex: 1998000, ins: 94861, rto: 248828, tcs: 19990, onroad: 2362679 },
        { name: "ACCOMPLISHED PLUS TGDI AT", ex: 2099000, ins: 99020, rto: 282477, tcs: 20990, onroad: 2501488 },
      ],
      "Diesel MT": [
        { name: "SMART PLUS 1.5D", ex: 1299000, ins: 65748, rto: 169647, tcs: 12990, onroad: 1567385 },
        { name: "PURE 1.5D", ex: 1449000, ins: 71987, rto: 211067, tcs: 14490, onroad: 1746544 },
        { name: "PURE PLUS 1.5D", ex: 1599000, ins: 78225, rto: 232487, tcs: 15990, onroad: 1926702 },
        { name: "ADVENTURE 1.5D", ex: 1649000, ins: 80305, rto: 239627, tcs: 16490, onroad: 1985422 },
        { name: "ADVENTURE PLUS 1.5D", ex: 1719000, ins: 83216, rto: 249623, tcs: 17190, onroad: 2069029 },
        { name: "ACCOMPLISHED 1.5D MT", ex: 1899000, ins: 90702, rto: 275327, tcs: 18990, onroad: 2284019 },
        { name: "ACCOMPLISHED PLUS 1.5D MT", ex: 2029000, ins: 96109, rto: 314567, tcs: 20290, onroad: 2459986 },
      ],
      "Diesel AT": [
        { name: "PURE AT 1.5D", ex: 1599000, ins: 78225, rto: 232487, tcs: 15990, onroad: 1926702 },
        { name: "ADVENTURE PLUS AT 1.5D", ex: 1849000, ins: 88623, rto: 268187, tcs: 18490, onroad: 2224300 },
        { name: "ACCOMPLISHED AT 1.5D", ex: 1999000, ins: 94861, rto: 289217, tcs: 19990, onroad: 2383069 },
        { name: "ACCOMPLISHED PLUS AT 1.5D", ex: 2129000, ins: 100268, rto: 329887, tcs: 21290, onroad: 2580445 },
      ],
    },
  },
};

// Simple voice command parser for automatic configurations
export function parseVoice(
  text: string,
  setCustomerName: (name: string) => void,
  setCarKey: (key: CarKey) => void,
  setFuelType: (fuel: string) => void,
  setVariant: (v: Variant) => void,
  setDiscount: (discount: string) => void,
  setDiscountLabel: (label: string) => void,
  setSelectedColor: (color: { name: string; hex: string } | null) => void,
  setRtoType: (type: "standard" | "bh") => void
): string[] {
  const t = text.toLowerCase();
  const found: string[] = [];

  // Custom keyword set to prevent eating technical terms or vehicle models
  const CAR_KEYWORDS = new Set([
    "harrier", "safari", "curvv", "curv", "sierra",
    "petrol", "diesel", "electric", "ev",
    "manual", "mt", "automatic", "at", "dca", "dct",
    "black", "dark", "dk", "rdk", "oberon", "gold", "flame", "opera", "dayton", "horizon", "forest", "nebula",
    "bh", "bharat", "rto", "standard", "tax", "mh",
    "discount", "off", "k", "thousand", "lakh", "lakhs",
    "corporate", "corp", "bonus",
    "quote", "quotation", "configure", "for", "to", "customer", "name", "client", "and", "is", "car", "model", "with", "a", "of", "the"
  ]);

  let name = "";

  // 1. Prefix Match (e.g. quote for Amit, name Rahul Kumar)
  const nameMatch = t.match(/(?:for|to|customer|client|name is|name)\s+([a-z]+(?:\s+[a-z]+){0,2})/i);
  if (nameMatch) {
    const rawNameWords = nameMatch[1].toLowerCase().split(/\s+/);
    const cleanedWords = rawNameWords.filter(w => !CAR_KEYWORDS.has(w));
    if (cleanedWords.length > 0) {
      name = cleanedWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }
  }

  // 2. Fallback: If no name found via prefix, look at the first 1-3 words of the transcript
  // If they are not keywords, they must be the name!
  if (!name) {
    const allWords = t.split(/\s+/).filter(w => w.length > 0);
    const firstNonKeywords: string[] = [];
    for (const w of allWords) {
      if (!CAR_KEYWORDS.has(w) && /^[a-z]+$/.test(w)) {
        firstNonKeywords.push(w);
      } else {
        break; // stop at first keyword or symbol
      }
      if (firstNonKeywords.length >= 2) break; // limit to 2 words like "Rahul Sharma"
    }
    if (firstNonKeywords.length > 0) {
      name = firstNonKeywords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }
  }

  if (name) {
    setCustomerName(name);
    found.push("👤 " + name);
  }

  // Find the absolute best variant across all cars globally by comparing matching tokens
  let bestVariant: Variant | null = null;
  let bestFuel: string | null = null;
  let bestCarKey: CarKey | null = null;
  let bestScore = 0;

  const hasBlackWord = t.includes("black") || t.includes("dark") || t.includes("dk") || t.includes("rdk") || t.includes("oberon");

  // Loop through all cars in CARS
  for (const [ckey, carData] of Object.entries(CARS)) {
    const carKeyTyped = ckey as CarKey;
    const carKeyLower = carKeyTyped.toLowerCase();
    
    // Check if the car name is explicitly in our voice transcript
    let carMatchBonus = 0;
    if (t.includes(carKeyLower)) {
      carMatchBonus = 20; // Major priority if model matches exactly
    } else if (carKeyTyped === "CURVV" && t.includes("curv")) {
      carMatchBonus = 20;
    }

    // Now loop over each fuel type in this car
    for (const [fuel, list] of Object.entries(carData.variants)) {
      const fuelLower = fuel.toLowerCase();
      
      // Compute fuel and transmission bonuses
      let fuelBonus = 0;
      if (t.includes("diesel") && fuelLower.includes("diesel")) fuelBonus += 6;
      if (t.includes("petrol") && fuelLower.includes("petrol")) fuelBonus += 6;
      if (t.includes("manual") && (fuelLower.includes("mt") || fuelLower.includes("manual"))) fuelBonus += 4;
      if ((t.includes("automatic") || t.includes("at") || t.includes("dca") || t.includes("dct")) && (fuelLower.includes("at") || fuelLower.includes("dca") || fuelLower.includes("dct"))) fuelBonus += 4;

      for (const v of list) {
        const vName = v.name.toLowerCase();
        let score = carMatchBonus + fuelBonus;

        // Split the variant name into tokens to check word-by-word matches
        const words = vName.split(/\s+/).filter(w => w.length >= 2);
        for (const w of words) {
          if (t.includes(w)) {
            score += 5; // strong match for each token
            
            // Highlight combinations (such as "pure x", "adventure x plus", "fearless x plus") Matching bonus
            if (t.includes(w + " x") || t.includes(w + " plus") || t.includes(w + " s")) {
              score += 3;
            }
          }
        }

        // Special specific word boosts to distinguish core lines
        if (t.includes("smart") && vName.includes("smart")) score += 10;
        if (t.includes("pure") && vName.includes("pure")) score += 10;
        if (t.includes("adventure") && vName.includes("adventure")) score += 10;
        if (t.includes("creative") && vName.includes("creative")) score += 10;
        if (t.includes("fearless") && vName.includes("fearless")) score += 10;
        if (t.includes("accomplished") && vName.includes("accomplished")) score += 10;

        // Dark Edition variant matches
        const isDarkVariant = vName.includes("dk") || vName.includes("dark") || vName.includes("rdk") || vName.includes("oberon");
        if (hasBlackWord) {
          if (isDarkVariant) {
            score += 30; // Massive push for dark variants
          } else {
            score -= 10;  // Penalize standard variants
          }
        } else {
          if (isDarkVariant) {
            score -= 10;  // Penalize dark editions
          }
        }

        // If this score beats the current record, save it!
        if (score > bestScore) {
          bestScore = score;
          bestVariant = v;
          bestFuel = fuel;
          bestCarKey = carKeyTyped;
        }
      }
    }
  }

  // Update selection if we got a high confidence match
  if (bestCarKey && bestVariant && bestFuel && bestScore > 4) {
    setCarKey(bestCarKey);
    found.push("🚗 " + CARS[bestCarKey].label);
    setFuelType(bestFuel);
    setVariant(bestVariant);
    found.push("📋 " + bestVariant.name + ` (${bestFuel})`);

    // Auto-select color shade!
    const keyColors = VEHICLE_COLORS[bestCarKey] || [];
    if (hasBlackWord) {
      const blackShade = keyColors.find(c => c.name.toLowerCase().includes("black") || c.name.toLowerCase().includes("dark"));
      if (blackShade) {
        setSelectedColor(blackShade);
        found.push("🎨 " + blackShade.name);
      }
    } else {
      if (keyColors.length > 0) {
        setSelectedColor(keyColors[0]);
      }
    }
  }

  // Match BH Series RTO Registration
  if (t.includes("bh") || t.includes("bharat")) {
    setRtoType("bh");
    found.push("🗺️ BH Series RTO");
  } else {
    // defaults to standard
    setRtoType("standard");
  }

  // Match Corporate Category / Discount
  if (t.includes("corporate") || t.includes("corp")) {
    setDiscountLabel("Corporate Discount");
    found.push("🏢 Corporate Discount");
    
    // Auto-apply corporate discount amount if a number is not already specified
    const hasExplicitDiscount = t.match(/discount|off|k/);
    if (!hasExplicitDiscount) {
      setDiscount("18000"); // default corporate bonus amount
      found.push("🎁 ₹18,000");
    }
  }

  // Match Discount (e.g. discount of 50000, discount 50k, 50,000 off)
  const discMatch = t.match(/discount\s+(?:of\s+)?(\d[\d,]*)/i);
  if (discMatch) {
    const rawDisc = discMatch[1].replace(/,/g, "");
    setDiscount(rawDisc);
    found.push("🎁 ₹" + Number(rawDisc).toLocaleString("en-IN"));
  } else {
    // Check for k notation like "50k discount"
    const kMatch = t.match(/(\d+)\s*k\s+(?:discount|off)/i);
    if (kMatch) {
      const parsedVal = String(Number(kMatch[1]) * 1000);
      setDiscount(parsedVal);
      found.push("🎁 ₹" + Number(parsedVal).toLocaleString("en-IN"));
    }
  }

  return found;
}

// Calculate BH Series (Bharat Series) RTO Tax for 2 Years
export function calculateBhRto(exShowroom: number, fuelType: string): number {
  let rate = 0.10; // default for 10 Lakhs - 20 Lakhs Ex-Showroom
  if (exShowroom < 1000000) {
    rate = 0.08;
  } else if (exShowroom > 2000000) {
    rate = 0.12;
  }

  const isDiesel = fuelType.toLowerCase().includes("diesel");
  const isEv = fuelType.toLowerCase().includes("ev") || fuelType.toLowerCase().includes("electric");
  
  if (isDiesel) {
    rate += 0.02; // diesel surcharge
  } else if (isEv) {
    rate -= 0.02; // EV discount
  }

  // BH Tax Formula = (Invoice Price * Rate * 1.25 * 2) / 15
  return Math.round((exShowroom * rate * 1.25 * 2) / 15);
}

// Official TATA Colors list for each luxury vehicle model
export const VEHICLE_COLORS: Record<CarKey, Array<{ name: string; hex: string }>> = {
  HARRIER: [
    { name: "Oberon Black (Dark Edition)", hex: "#111827" },
    { name: "Coral Red (Metallic)", hex: "#dc2626" },
    { name: "Pebble Grey (Signature)", hex: "#71717a" },
    { name: "Sunlit Yellow (Dual-Tone)", hex: "#eab308" },
    { name: "Ash Grey (Classic)", hex: "#3f3f46" },
  ],
  SAFARI: [
    { name: "Cosmic Gold (Prestige)", hex: "#d97706" },
    { name: "Galactic Sapphire (Deep Blue)", hex: "#1e3a8a" },
    { name: "Oyster White (Pearl)", hex: "#f4f4f5" },
    { name: "Stardust Ash (Metallic)", hex: "#4b5563" },
    { name: "Oberon Black (Dark Edition)", hex: "#111827" },
  ],
  CURVV: [
    { name: "Oberon Black (Dark Edition)", hex: "#111827" },
    { name: "Gold Essence (Exclusive)", hex: "#b45309" },
    { name: "Flame Red (Sport)", hex: "#dc2626" },
    { name: "Opera Blue (Ocean Dark)", hex: "#1d4ed8" },
    { name: "Pristine White (Gloss)", hex: "#fafafa" },
    { name: "Dayton Grey (Charcoal)", hex: "#52525b" },
  ],
  SIERRA: [
    { name: "Oberon Black (Dark Edition)", hex: "#111827" },
    { name: "Horizon Grey (Premium)", hex: "#6b7280" },
    { name: "Forest Green (Adventurer)", hex: "#064e3b" },
    { name: "Nebula Blue (Cosmic)", hex: "#0284c7" },
    { name: "Snowy Peak White", hex: "#f8fafc" },
    { name: "Stardust Silver (Satin)", hex: "#cbd5e1" },
  ],
};

// Official TATA Premium Genuine Accessories Checklist Addons with Pricing
export const VEHICLE_ACCESSORIES = [
  { id: "mats", name: "Genuine 3D Premium Cabin Mats", price: 4500, desc: "Fitted, water-resistant all-weather premium protection" },
  { id: "scuff", name: "Illuminated Chrome Scuff Plates", price: 3800, desc: "Premium door entry accents on door sills" },
  { id: "mudflaps", name: "Front & Rear Heavy-Duty Mud Flaps", price: 1200, desc: "TATA genuine splash-guard impact protection" },
  { id: "moulding", name: "Satin Chrome Side Protection Mouldings", price: 5500, desc: "Protects siding with premium gloss highlights" },
  { id: "cover", name: "Weather-Resistant Custom Body Cover", price: 2800, desc: "Double-stitched premium safe dust & rain shield" },
  { id: "ceramic", name: "Showroom 9H Ceramic Polish Treatment", price: 12000, desc: "Long-lasting high-gloss protective showroom coat" },
  { id: "warranty", name: "Extended Official TATA 2-Year Warranty", price: 16500, desc: "Covers engine, electrical, and transmission safety mechanics" },
];

