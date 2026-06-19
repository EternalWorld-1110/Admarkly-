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
    if (n.includes("ACCOMPLISHED PLUS") || n.includes("ACCOMPLISHED+") || n.includes("ACCOMPLISHED +")) return "https://www.youtube.com/results?search_query=2025+tata+curvv+accomplished+plus+adas+walkaround";
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

  // Altroz
  if (carKey === "ALTROZ") {
    return `https://www.youtube.com/results?search_query=2026+tata+altroz+${encodeURIComponent(variantName)}+walkaround`;
  }
  // Punch
  if (carKey === "PUNCH") {
    return `https://www.youtube.com/results?search_query=2026+tata+punch+${encodeURIComponent(variantName)}+walkaround`;
  }
  // Nexon
  if (carKey === "NEXON") {
    return `https://www.youtube.com/results?search_query=2026+tata+nexon+${encodeURIComponent(variantName)}+walkaround`;
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
    if (n.includes("ACCOMPLISHED PLUS") || n.includes("ACCOMPLISHED+") || n.includes("ACCOMPLISHED +")) return [
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

  // Tata Altroz features
  if (carKey === "ALTROZ") {
    if (n.includes("CREATIVE") || n.includes("ACCOMPLISHED")) return [
      "Voice-assisted electric sunroof with mood lighting",
      "17.78 cm (7\") Touchscreen Infotainment by Harman™",
      "7\" TFT Digital Instrument Cluster",
      "iRA Connected Car Technology suite",
      "Leather-Wrapped Flat-bottom Steering Wheel",
      "Auto Headlamps & Rain Sensing Wipers",
      "Projector Headlamps with LED DRLs",
      "R16 Laser-cut Alloy Wheels",
      "Automatic Climate Control with Rear AC Vents",
      "Cooled Glove Box",
      "Dual Front Airbags & ABS with EBD",
      "Reverse Parking Camera with Guidelines",
    ];
    return [
      "17.78 cm (7\") Touchscreen Infotainment by Harman™",
      "Voice-assisted electric sunroof (Select Trims)",
      "LED DRLs & Dual Chamber Projector Headlamps",
      "R16 Steel Wheels or Styled Wheels",
      "Reverse Parking Sensors",
      "Dual Front Airbags & ABS with EBD & CSC",
      "Tilt Adjustable Steering Menu",
      "Central Locking with Keyless Entry",
      "Follow-me-home Headlamps",
    ];
  }

  // Tata Punch features
  if (carKey === "PUNCH") {
    if (n.includes("ACCOMPLISHED") || n.includes("ADVENTURE")) return [
      "Voice-assisted Electric Sunroof",
      "17.78 cm (7\") Touchscreen Infotainment by Harman™",
      "7\" TFT Digital Cockpit Console",
      "iRA Connected Vehicle Suite with iRA 2.0",
      "R16 Diamond Cut Alloy Wheels",
      "Auto Folding ORVMs with Electric Adjust",
      "Reverse Parking Camera",
      "Push Button Start/Stop",
      "Dual Front Airbags & ABS with EBD",
      "Follow-me-home Headlamps",
      "Automatic Climate Control AC",
    ];
    return [
      "Floating 8.89 cm Infotainment Display",
      "Dual Front Airbags & ABS with EBD",
      "ISOFIX Child Seat Anchors",
      "Front Power Windows",
      "Rear Parking Sensors",
      "Traction Pro Mode (AMT only)",
      "Tilt Adjustable Steering",
      "Dynamic Swiping LED Indicators",
    ];
  }

  // Tata Nexon features
  if (carKey === "NEXON") {
    if (n.includes("FEARLESS") || n.includes("CREATIVE")) return [
      "26.03 cm (10.25\") Touchscreen Infotainment by Harman™",
      "26.03 cm (10.25\") High Definition Digital Cluster",
      "360° HD Surround View Camera with Blind View Monitor",
      "Ventilated Front Seats (Driver & Co-Driver)",
      "Voice-assisted Panoramic/Electric Sunroof",
      "6 Airbags Standard (Driver, Pass, Side, Curtain)",
      "Wireless Smart Phone Charger",
      "Sequential LED DRLs & Taillamps with Animation",
      "Electronic Stability Program (ESP) as Dragon Standard",
      "Air Purifier with AQI Display",
      "Multi-Drive Modes (Eco, City, Sport)",
    ];
    return [
      "17.78 cm Touchscreen Infotainment by Harman™",
      "6 Airbags Standard across variant stack",
      "Electronic Stability Program (ESP)",
      "LED Headlamps & Tail Lamps",
      "ABS with EBD & Brake Assist",
      "Reverse Parking Sensors",
      "Front Power Windows",
      "Multi-Drive Modes (Eco, City, Sport)",
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
        { name: "ADVENTURE X DK AT", ex: 1889990, ins: 90328, rto: 235485, tcs: 18900, onroad: 2234703 },
        { name: "ADVENTURE X PLUS AT", ex: 1874390, ins: 89679, rto: 233576, tcs: 18744, onroad: 2216389 },
        { name: "ADVENTURE X PLUS DK AT", ex: 1926390, ins: 91842, rto: 239941, tcs: 19264, onroad: 2277437 },
        { name: "FEARLESS X AT", ex: 2178890, ins: 102343, rto: 293071, tcs: 21789, onroad: 2596093 },
        { name: "FEARLESS X DK AT", ex: 2230890, ins: 104506, rto: 299967, tcs: 22309, onroad: 2657672 },
        { name: "FEARLESS X PLUS AT", ex: 2353890, ins: 109622, rto: 316276, tcs: 23539, onroad: 2803327 },
        { name: "FEARLESS X PLUS DK AT", ex: 2405890, ins: 111784, rto: 323172, tcs: 24059, onroad: 2864905 },
        { name: "FEARLESS UL AT", ex: 2413890, ins: 112117, rto: 324232, tcs: 24139, onroad: 2874378 },
        { name: "FEARLESS UL RDK AT", ex: 2468890, ins: 114405, rto: 331525, tcs: 24689, onroad: 2939509 },
      ],
      "Diesel MT": [
        { name: "SMART DIESEL", ex: 1399990, ins: 69948, rto: 204069, tcs: 14000, onroad: 1688007 },
        { name: "PURE X DIESEL", ex: 1714990, ins: 83049, rto: 249051, tcs: 17150, onroad: 2064240 },
        { name: "PURE X DIESEL DK", ex: 1779990, ins: 85753, rto: 258333, tcs: 17800, onroad: 2141875 },
        { name: "ADVENTURE X DIESEL", ex: 1814990, ins: 87208, rto: 263331, tcs: 18150, onroad: 2183679 },
        { name: "ADVENTURE X DIESEL DK", ex: 1869990, ins: 89496, rto: 271185, tcs: 18700, onroad: 2249370 },
        { name: "ADVENTURE X PLUS DIESEL", ex: 1844990, ins: 88456, rto: 267615, tcs: 18450, onroad: 2219510 },
        { name: "ADVENTURE X PLUS DIESEL DK", ex: 1894990, ins: 90535, rto: 274755, tcs: 18950, onroad: 2279230 },
        { name: "FEARLESS X DIESEL", ex: 2124990, ins: 100101, rto: 329273, tcs: 21250, onroad: 2575615 },
        { name: "FEARLESS X DIESEL DK", ex: 2179990, ins: 102389, rto: 337688, tcs: 21800, onroad: 2641867 },
        { name: "FEARLESS X PLUS DIESEL", ex: 2324990, ins: 108419, rto: 359873, tcs: 23250, onroad: 2816533 },
        { name: "FEARLESS X PLUS DIESEL DK", ex: 2379990, ins: 110707, rto: 368288, tcs: 23800, onroad: 2882785 },
        { name: "FEARLESS X PLUS DIESEL STEALTH", ex: 2394990, ins: 111330, rto: 370583, tcs: 23950, onroad: 2900854 },
        { name: "FEARLESS UL DIESEL", ex: 2384990, ins: 110915, rto: 369053, tcs: 23850, onroad: 2888808 },
        { name: "FEARLESS UL RDK DIESEL", ex: 2439990, ins: 113202, rto: 377468, tcs: 24400, onroad: 2955060 },
      ],
      "Diesel AT": [
        { name: "PURE X DIESEL AT", ex: 1864990, ins: 89288, rto: 270471, tcs: 18650, onroad: 2243398 },
        { name: "PURE X DIESEL DK AT", ex: 1909990, ins: 91159, rto: 276897, tcs: 19100, onroad: 2297146 },
        { name: "ADVENTURE X DIESEL AT", ex: 1964990, ins: 93447, rto: 284751, tcs: 19650, onroad: 2362837 },
        { name: "ADVENTURE X PLUS DIESEL AT", ex: 1999990, ins: 94902, rto: 289749, tcs: 20000, onroad: 2404641 },
        { name: "ADVENTURE X DIESEL DK AT", ex: 2019990, ins: 95734, rto: 313208, tcs: 20200, onroad: 2449133 },
        { name: "ADVENTURE X PLUS DIESEL DK AT", ex: 2054990, ins: 97190, rto: 318563, tcs: 20550, onroad: 2491293 },
        { name: "FEARLESS X DIESEL AT", ex: 2279990, ins: 106548, rto: 352988, tcs: 22800, onroad: 2762326 },
        { name: "FEARLESS X DIESEL DK AT", ex: 2339990, ins: 109043, rto: 362168, tcs: 23400, onroad: 2834601 },
        { name: "FEARLESS X PLUS DIESEL AT", ex: 2469990, ins: 114450, rto: 382058, tcs: 24700, onroad: 2991198 },
        { name: "FEARLESS X PLUS DIESEL DK AT", ex: 2519990, ins: 116529, rto: 389708, tcs: 25200, onroad: 3051428 },
        { name: "FEARLESS X PLUS DIESEL STEALTH AT", ex: 2534990, ins: 117153, rto: 392003, tcs: 25350, onroad: 3069496 },
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
        { name: "PURE X DK SAFARI", ex: 1701190, ins: 86643, rto: 212376, tcs: 17012, onroad: 2017221 },
        { name: "ADVENTURE X 1.5 PLUS SAFARI", ex: 1775090, ins: 89136, rto: 221422, tcs: 17751, onroad: 2103399 },
        { name: "ADVENTURE X PLUS DK SAFARI", ex: 1827190, ins: 90894, rto: 227799, tcs: 18272, onroad: 2164155 },
        { name: "ACCOMPLISHED X SAFARI", ex: 2084290, ins: 99569, rto: 259268, tcs: 20843, onroad: 2463970 },
        { name: "ACCOMPLISHED X DK SAFARI", ex: 2136290, ins: 101324, rto: 265632, tcs: 21363, onroad: 2524609 },
        { name: "ACCOMPLISHED X PLUS SAFARI", ex: 2273490, ins: 105953, rto: 282426, tcs: 22735, onroad: 2684604 },
        { name: "ACCOMPLISHED X PLUS DK SAFARI", ex: 2306590, ins: 107070, rto: 286477, tcs: 23066, onroad: 2723203 },
        { name: "ACCOMPLISHED X PLUS 6S SAFARI", ex: 2282990, ins: 106274, rto: 283588, tcs: 22830, onroad: 2695682 },
        { name: "ACCOMPLISHED X PLUS DK 6S SAFARI", ex: 2316090, ins: 107391, rto: 287640, tcs: 23161, onroad: 2734282 },
        { name: "ACCOMPLISHED UL SAFARI", ex: 2333490, ins: 107978, rto: 289770, tcs: 23335, onroad: 2754573 },
        { name: "ACCOMPLISHED UL 6S SAFARI", ex: 2342990, ins: 108298, rto: 290932, tcs: 23430, onroad: 2765650 },
        { name: "ACCOMPLISHED UL RDK SAFARI", ex: 2368490, ins: 109159, rto: 294054, tcs: 23685, onroad: 2795388 },
        { name: "ACCOMPLISHED UL RDK 6S SAFARI", ex: 2377990, ins: 109479, rto: 295216, tcs: 23780, onroad: 2806465 },
      ],
      "Petrol AT": [
        { name: "PURE X AT SAFARI", ex: 1791090, ins: 89676, rto: 223380, tcs: 17911, onroad: 2122057 },
        { name: "PURE X DK AT SAFARI", ex: 1852590, ins: 91751, rto: 230908, tcs: 18526, onroad: 2193775 },
        { name: "ADVENTURE X PLUS AT SAFARI", ex: 1935990, ins: 94565, rto: 241116, tcs: 19360, onroad: 2291031 },
        { name: "ADVENTURE X PLUS DK AT SAFARI", ex: 1988090, ins: 96323, rto: 247493, tcs: 19881, onroad: 2351787 },
        { name: "ACCOMPLISHED X AT SAFARI", ex: 2249890, ins: 105157, rto: 279537, tcs: 22499, onroad: 2657083 },
        { name: "ACCOMPLISHED X DK AT SAFARI", ex: 2301890, ins: 106912, rto: 285902, tcs: 23019, onroad: 2717723 },
        { name: "ACCOMPLISHED X PLUS AT SAFARI", ex: 2415390, ins: 110741, rto: 299794, tcs: 24154, onroad: 2850079 },
        { name: "ACCOMPLISHED X PLUS DK AT SAFARI", ex: 2448490, ins: 111123, rto: 303846, tcs: 24485, onroad: 2888679 },
        { name: "ACCOMPLISHED X PLUS AT 6S SAFARI", ex: 2424890, ins: 111062, rto: 300957, tcs: 24249, onroad: 2861158 },
        { name: "ACCOMPLISHED X PLUS DK AT 6S SAFARI", ex: 2457990, ins: 112179, rto: 305008, tcs: 24580, onroad: 2899757 },
        { name: "ACCOMPLISHED UL AT SAFARI", ex: 2475390, ins: 112766, rto: 307138, tcs: 24754, onroad: 2920048 },
        { name: "ACCOMPLISHED UL AT 6S SAFARI", ex: 2484890, ins: 113086, rto: 308301, tcs: 24849, onroad: 2931126 },
        { name: "ACCOMPLISHED UL RDK AT SAFARI", ex: 2510390, ins: 113947, rto: 311422, tcs: 25104, onroad: 2960863 },
        { name: "ACCOMPLISHED UL RDK AT 6S SAFARI", ex: 2519890, ins: 114267, rto: 312585, tcs: 25199, onroad: 2971941 },
      ],
      "Diesel MT": [
        { name: "SMART DIESEL SAFARI", ex: 1474990, ins: 73067, rto: 214779, tcs: 14750, onroad: 1777586 },
        { name: "PURE X DIESEL SAFARI", ex: 1764990, ins: 85129, rto: 256191, tcs: 17650, onroad: 2123959 },
        { name: "PURE X DIESEL DARK SAFARI", ex: 1819990, ins: 87416, rto: 264045, tcs: 18200, onroad: 2189651 },
        { name: "ADVENTURE X PLUS DIESEL SAFARI", ex: 1899990, ins: 90743, rto: 275469, tcs: 19000, onroad: 2285202 },
        { name: "ADVENTURE X PLUS DIESEL DARK SAFARI", ex: 1954990, ins: 93031, rto: 283323, tcs: 19550, onroad: 2350893 },
        { name: "ACCOMPLISHED X DIESEL SAFARI", ex: 2199990, ins: 103220, rto: 340748, tcs: 22000, onroad: 2665959 },
        { name: "ACCOMPLISHED X DIESEL DARK SAFARI", ex: 2254990, ins: 105508, rto: 349163, tcs: 22550, onroad: 2732211 },
        { name: "ACCOMPLISHED X PLUS DIESEL SAFARI", ex: 2389990, ins: 111123, rto: 369818, tcs: 23900, onroad: 2894831 },
        { name: "ACCOMPLISHED X PLUS 6S DIESEL SAFARI", ex: 2399990, ins: 111538, rto: 371348, tcs: 24000, onroad: 2906877 },
        { name: "ACCOMPLISHED X PLUS DIESEL DARK SAFARI", ex: 2424990, ins: 112578, rto: 375173, tcs: 24250, onroad: 2936992 },
        { name: "ACCOMPLISHED X PLUS DK 6S DIESEL SAFARI", ex: 2434990, ins: 112994, rto: 376703, tcs: 24350, onroad: 2949037 },
        { name: "ACCOMPLISHED X PLUS STEALTH DIESEL SAFARI", ex: 2459990, ins: 114034, rto: 380528, tcs: 24600, onroad: 2979152 },
        { name: "ACCOMPLISHED UL DIESEL SAFARI", ex: 2449990, ins: 113618, rto: 378998, tcs: 24500, onroad: 2967106 },
        { name: "ACCOMPLISHED UL 6S DIESEL SAFARI", ex: 2459990, ins: 114034, rto: 380528, tcs: 24600, onroad: 2979152 },
        { name: "ACCOMPLISHED UL RDK DIESEL SAFARI", ex: 2484990, ins: 115074, rto: 384353, tcs: 24850, onroad: 3009267 },
        { name: "ACCOMPLISHED UL RDK 6S DIESEL SAFARI", ex: 2494990, ins: 115490, rto: 385883, tcs: 24950, onroad: 3021313 },
      ],
      "Diesel AT": [
        { name: "PURE X DIESEL AT SAFARI", ex: 1909990, ins: 91159, rto: 276897, tcs: 19100, onroad: 2297146 },
        { name: "PURE X DIESEL DARK AT SAFARI", ex: 1969990, ins: 93655, rto: 285465, tcs: 19700, onroad: 2368809 },
        { name: "ADVENTURE X PLUS DIESEL AT SAFARI", ex: 2064990, ins: 97606, rto: 320093, tcs: 20650, onroad: 2503339 },
        { name: "ADVENTURE X PLUS DIESEL DARK AT SAFARI", ex: 2114990, ins: 99685, rto: 327743, tcs: 21150, onroad: 2563569 },
        { name: "ACCOMPLISHED X DIESEL AT SAFARI", ex: 2364990, ins: 110083, rto: 365993, tcs: 23650, onroad: 2864716 },
        { name: "ACCOMPLISHED X DIESEL DARK AT SAFARI", ex: 2419990, ins: 112370, rto: 374408, tcs: 24200, onroad: 2930969 },
        { name: "ACCOMPLISHED X PLUS DIESEL AT SAFARI", ex: 2534990, ins: 117153, rto: 392003, tcs: 25350, onroad: 3069496 },
        { name: "ACCOMPLISHED X PLUS 6S DIESEL AT SAFARI", ex: 2544990, ins: 117569, rto: 393533, tcs: 25450, onroad: 3081542 },
        { name: "ACCOMPLISHED X PLUS DIESEL DARK AT SAFARI", ex: 2569990, ins: 118609, rto: 375173, tcs: 25700, onroad: 3111657 },
        { name: "ACCOMPLISHED X PLUS DK 6S DIESEL AT SAFARI", ex: 2579990, ins: 119025, rto: 398888, tcs: 25800, onroad: 3123703 },
        { name: "ACCOMPLISHED X PLUS STEALTH DIESEL AT SAFARI", ex: 2604990, ins: 120064, rto: 402713, tcs: 26050, onroad: 3153818 },
        { name: "ACCOMPLISHED X PLUS STEALTH 6S DIESEL AT SAFARI", ex: 2614990, ins: 120480, rto: 404243, tcs: 26150, onroad: 3165864 },
        { name: "ACCOMPLISHED UL DIESEL AT SAFARI", ex: 2594990, ins: 119649, rto: 401183, tcs: 25950, onroad: 3141772 },
        { name: "ACCOMPLISHED UL 6S DIESEL AT SAFARI", ex: 2604990, ins: 120064, rto: 402713, tcs: 26050, onroad: 3153818 },
        { name: "ACCOMPLISHED UL RDK DIESEL AT SAFARI", ex: 2629990, ins: 121104, rto: 406538, tcs: 26300, onroad: 3183933 },
        { name: "ACCOMPLISHED UL RDK 6S DIESEL AT SAFARI", ex: 2639990, ins: 121520, rto: 408068, tcs: 26400, onroad: 3195978 },
      ],
    },
  },
  CURVV: {
    label: "Tata Curvv", emoji: "🏎️", color: "#d97706", // Amber
    variants: {
      "Petrol MT": [
        { name: "SMART 1.2 TC", ex: 969990, ins: 52064, rto: 122877, tcs: 0, onroad: 1144931 },
        { name: "PURE PLUS 1.2 TC", ex: 1099990, ins: 57471, rto: 138789, tcs: 11000, onroad: 1307250 },
        { name: "PURE PLUS (S) 1.2 TC", ex: 1164990, ins: 60175, rto: 146745, tcs: 11650, onroad: 1383559 },
        { name: "CREATIVE 1.2 TC", ex: 1219990, ins: 62462, rto: 153477, tcs: 12200, onroad: 1448129 },
        { name: "CREATIVE (S) 1.2 TC", ex: 1269990, ins: 64541, rto: 159597, tcs: 12700, onroad: 1506828 },
        { name: "CREATIVE PLUS (S) 1.2 TC", ex: 1369990, ins: 68701, rto: 171837, tcs: 13700, onroad: 1624227 },
        { name: "CREATIVE (S) 1.2 TC GDI", ex: 1384990, ins: 69324, rto: 173673, tcs: 13850, onroad: 1641837 },
        { name: "ACCOMPLISHED (S) 1.2 TC", ex: 1459990, ins: 72444, rto: 182853, tcs: 14600, onroad: 1729886 },
        { name: "CREATIVE PLUS (S) 1.2 TC GDI", ex: 1484990, ins: 73483, rto: 185913, tcs: 14850, onroad: 1759236 },
        { name: "ACCOMPLISHED (S) 1.2P GDI DARK", ex: 1579990, ins: 77434, rto: 197541, tcs: 15800, onroad: 1870765 },
        { name: "ACCOMPLISHED+ A GDI 1.2", ex: 1724990, ins: 83465, rto: 215289, tcs: 17250, onroad: 2040994 },
        { name: "ACCOMPLISHED+ A GDI 1.2 DARK", ex: 1744990, ins: 84297, rto: 217737, tcs: 17450, onroad: 2064474 },
      ],
      "Petrol DCA": [
        { name: "PURE PLUS DCA 1.2", ex: 1249990, ins: 63710, rto: 157149, tcs: 12500, onroad: 1483348 },
        { name: "PURE PLUS (S) DCA 1.2", ex: 1314990, ins: 66413, rto: 165105, tcs: 13150, onroad: 1559658 },
        { name: "CREATIVE DCA 1.2", ex: 1369990, ins: 68701, rto: 171837, tcs: 13700, onroad: 1624227 },
        { name: "CREATIVE (S) DCA 1.2", ex: 1419990, ins: 70780, rto: 177957, tcs: 14200, onroad: 1682927 },
        { name: "CREATIVE PLUS (S) DCA 1.2", ex: 1519990, ins: 74939, rto: 190197, tcs: 15200, onroad: 1800326 },
        { name: "ACCOMPLISHED (S) DCA 1.2", ex: 1614990, ins: 78890, rto: 201825, tcs: 16150, onroad: 1911855 },
        { name: "CREATIVE PLUS (S) DCA 1.2 GDI", ex: 1634990, ins: 79722, rto: 204273, tcs: 16350, onroad: 1935335 },
        { name: "ACCOMPLISHED (S) DCA 1.2 GDI", ex: 1664990, ins: 80970, rto: 207945, tcs: 16650, onroad: 1970554 },
        { name: "ACCOMPLISHED (S) DCA GDI DARK", ex: 1744990, ins: 84297, rto: 217737, tcs: 17450, onroad: 2064474 },
        { name: "ACCOMPLISHED+ A DCA GDI 1.2", ex: 1779990, ins: 85753, rto: 222021, tcs: 17800, onroad: 2105563 },
        { name: "ACCOMPLISHED+ A DCA GDI 1.2 DARK", ex: 1889990, ins: 90327, rto: 235485, tcs: 18900, onroad: 2234702 },
      ],
      "Diesel MT": [
        { name: "SMART 1.5 DIESEL", ex: 1119990, ins: 58303, rto: 141237, tcs: 11200, onroad: 1330730 },
        { name: "PURE PLUS 1.5 DIESEL", ex: 1249990, ins: 63710, rto: 157149, tcs: 12500, onroad: 1483348 },
        { name: "PURE PLUS (S) 1.5 DIESEL", ex: 1314990, ins: 66413, rto: 165105, tcs: 13150, onroad: 1559658 },
        { name: "CREATIVE 1.5 DIESEL", ex: 1369990, ins: 68701, rto: 171837, tcs: 13700, onroad: 1624227 },
        { name: "CREATIVE (S) 1.5 DIESEL", ex: 1419990, ins: 70780, rto: 177957, tcs: 14200, onroad: 1682927 },
        { name: "CREATIVE PLUS (S) 1.5 DIESEL", ex: 1519990, ins: 74939, rto: 190197, tcs: 15200, onroad: 1800326 },
        { name: "ACCOMPLISHED (S) 1.5 DIESEL", ex: 1599990, ins: 78266, rto: 199989, tcs: 16000, onroad: 1894245 },
        { name: "ACCOMPLISHED (S) 1.5D DARK", ex: 1614990, ins: 78890, rto: 201825, tcs: 16150, onroad: 1911855 },
        { name: "ACCOMPLISHED+ A 1.5 DIESEL", ex: 1729990, ins: 83673, rto: 215901, tcs: 17300, onroad: 2046864 },
        { name: "ACCOMPLISHED+ A 1.5D DIESEL DARK", ex: 1759990, ins: 84921, rto: 219573, tcs: 17600, onroad: 2082083 },
      ],
      "Diesel DCA": [
        { name: "PURE PLUS DCA 1.5", ex: 1394990, ins: 69740, rto: 174897, tcs: 13950, onroad: 1653577 },
        { name: "CREATIVE (S) DCA 1.5", ex: 1564990, ins: 76811, rto: 195705, tcs: 15650, onroad: 1853155 },
        { name: "CREATIVE PLUS (S) DCA 1.5 DIESEL", ex: 1634990, ins: 79722, rto: 204273, tcs: 16350, onroad: 1935335 },
        { name: "ACCOMPLISHED (S) DCA 1.5", ex: 1749990, ins: 84505, rto: 218349, tcs: 17500, onroad: 2070343 },
        { name: "ACCOMPLISHED (S) 1.5D DCA DARK", ex: 1764990, ins: 85129, rto: 220185, tcs: 17650, onroad: 2087953 },
        { name: "ACCOMPLISHED+ A DCA 1.5 DIESEL", ex: 1874990, ins: 89704, rto: 233649, tcs: 18750, onroad: 2217092 },
        { name: "ACCOMPLISHED+ A DCA 1.5D DIESEL DARK", ex: 1894990, ins: 90535, rto: 236097, tcs: 18950, onroad: 2240572 },
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
  ALTROZ: {
    label: "Tata Altroz", emoji: "🚗", color: "#eab308",
    variants: {
      "Petrol MT": [
        { name: "1.2P SMART", ex: 629990, ins: 37924, rto: 74835, tcs: 12200, onroad: 742749 },
        { name: "1.2P PURE", ex: 709990, ins: 41251, rto: 83811, tcs: 13267, onroad: 835052 },
        { name: "1.2P PURE (S)", ex: 741990, ins: 42582, rto: 87401, tcs: 13693, onroad: 871973 },
        { name: "1.2P CREATIVE", ex: 801990, ins: 45077, rto: 94133, tcs: 14493, onroad: 941201 },
        { name: "1.2P CREATIVE (S)", ex: 836990, ins: 46533, rto: 98060, tcs: 14960, onroad: 981583 },
        { name: "1.2P ACCOMPLISHED (S)", ex: 921990, ins: 50068, rto: 107597, tcs: 16093, onroad: 1079655 },
      ],
      "Petrol AT": [
        { name: "1.2P PURE AMT", ex: 764990, ins: 43538, rto: 89982, tcs: 14000, onroad: 898510 },
        { name: "1.2P PURE (S) AMT", ex: 796990, ins: 44869, rto: 93572, tcs: 14427, onroad: 935432 },
        { name: "1.2P CREATIVE AMT", ex: 856990, ins: 47365, rto: 100304, tcs: 15227, onroad: 1004659 },
        { name: "1.2P CREATIVE (S) AMT", ex: 891990, ins: 48820, rto: 104231, tcs: 15693, onroad: 1045042 },
        { name: "1.2P CREATIVE (S) DCA", ex: 951990, ins: 51316, rto: 110963, tcs: 16493, onroad: 1114269 },
        { name: "1.2P ACCOMPLISHED (S) DCA", ex: 1036990, ins: 54851, rto: 131078, tcs: 17627, onroad: 1233288 },
        { name: "1.2P ACCOMPLISHED PLUS (S) DCA", ex: 1061990, ins: 55891, rto: 134138, tcs: 17960, onroad: 1262637 },
      ],
      "Diesel MT": [
        { name: "1.5D PURE", ex: 814990, ins: 45618, rto: 112218, tcs: 14667, onroad: 972826 },
        { name: "1.5D CREATIVE (S)", ex: 941990, ins: 50900, rto: 129058, tcs: 16360, onroad: 1121948 },
        { name: "1.5D ACCOMPLISHED (S)", ex: 1026990, ins: 54435, rto: 149567, tcs: 17493, onroad: 1230992 },
      ],
      "CNG MT": [
        { name: "SMART iCNG", ex: 729990, ins: 42083, rto: 63717, tcs: 13533, onroad: 835790 },
        { name: "PURE iCNG", ex: 809990, ins: 45410, rto: 70245, tcs: 14600, onroad: 925645 },
        { name: "PURE (S) iCNG", ex: 841990, ins: 46741, rto: 72856, tcs: 15027, onroad: 961587 },
        { name: "CREATIVE iCNG", ex: 901990, ins: 49236, rto: 77752, tcs: 15827, onroad: 1028979 },
        { name: "CREATIVE (S) iCNG", ex: 926990, ins: 50276, rto: 79792, tcs: 16160, onroad: 1057058 },
        { name: "ACCOMPLISHED (S) iCNG", ex: 1021990, ins: 54227, rto: 87544, tcs: 17427, onroad: 1163762 },
      ],
    },
  },
  PUNCH: {
    label: "Tata Punch", emoji: "🚙", color: "#f97316",
    variants: {
      "Petrol MT": [
        { name: "2.0 SMART", ex: 564990, ins: 35220, rto: 67542, tcs: 11333, onroad: 667752 },
        { name: "2.0 PURE", ex: 654990, ins: 38964, rto: 77640, tcs: 12533, onroad: 771593 },
        { name: "2.0 PURE PLUS", ex: 704990, ins: 41043, rto: 83250, tcs: 13200, onroad: 829283 },
        { name: "2.0 PURE PLUS (S)", ex: 739990, ins: 42499, rto: 87177, tcs: 13667, onroad: 869666 },
        { name: "2.0 ADVENTURE", ex: 764990, ins: 43538, rto: 89982, tcs: 14000, onroad: 898510 },
        { name: "2.0 ADVENTURE (S)", ex: 799990, ins: 44994, rto: 93909, tcs: 14467, onroad: 938893 },
        { name: "2.0 ADVENTURE TC", ex: 834990, ins: 46450, rto: 97836, tcs: 14933, onroad: 979276 },
        { name: "2.0 ACCOMPLISHED", ex: 834990, ins: 46450, rto: 97836, tcs: 14933, onroad: 979276 },
        { name: "2.0 ACCOMPLISHED PLUS (S)", ex: 904990, ins: 49361, rto: 105690, tcs: 15867, onroad: 1060041 },
      ],
      "Petrol AT": [
        { name: "2.0 PURE PLUS AMT", ex: 759990, ins: 43330, rto: 89421, tcs: 13933, onroad: 892741 },
        { name: "2.0 PURE PLUS (S) AMT", ex: 794990, ins: 44786, rto: 93348, tcs: 14400, onroad: 933124 },
        { name: "2.0 ADVENTURE AMT", ex: 819990, ins: 45826, rto: 96153, tcs: 14733, onroad: 961969 },
        { name: "2.0 ACCOMPLISHED AMT", ex: 889990, ins: 48737, rto: 104007, tcs: 15667, onroad: 1042734 },
        { name: "2.0 ACCOMPLISHED PLUS (S) AMT", ex: 959990, ins: 51649, rto: 111861, tcs: 16600, onroad: 1123499 },
      ],
      "CNG MT": [
        { name: "2.0 SMART CNG", ex: 674990, ins: 39795, rto: 59229, tcs: 12800, onroad: 774014 },
        { name: "2.0 PURE CNG", ex: 754990, ins: 43123, rto: 65757, tcs: 13867, onroad: 863870 },
        { name: "2.0 PURE PLUS CNG", ex: 804990, ins: 45202, rto: 69837, tcs: 14533, onroad: 920029 },
        { name: "2.0 PURE PLUS (S) CNG", ex: 839990, ins: 46658, rto: 72693, tcs: 15000, onroad: 959341 },
        { name: "2.0 ADVENTURE CNG", ex: 864990, ins: 47697, rto: 74733, tcs: 15333, onroad: 987421 },
        { name: "2.0 ADVENTURE (S) CNG", ex: 899990, ins: 49153, rto: 77589, tcs: 15800, onroad: 1026732 },
        { name: "2.0 ACCOMPLISHED CNG", ex: 934990, ins: 50609, rto: 80445, tcs: 16267, onroad: 1066044 },
        { name: "2.0 ACCOMPLISHED PLUS (S) TC", ex: 984990, ins: 52688, rto: 114666, tcs: 16933, onroad: 1152344 },
      ],
      "CNG AT": [
        { name: "2.0 PURE PLUS CNG AMT", ex: 859990, ins: 47490, rto: 74325, tcs: 15267, onroad: 981805 },
        { name: "2.0 ADVENTURE CNG AMT", ex: 919990, ins: 49985, rto: 79221, tcs: 16067, onroad: 1049196 },
        { name: "2.0 ADVENTURE S CNG AMT", ex: 954990, ins: 51441, rto: 82077, tcs: 16533, onroad: 1088508 },
        { name: "2.0 ACCOMPLISHED PLUS (S) CNG AMT", ex: 1059990, ins: 55808, rto: 101457, tcs: 17933, onroad: 1227814 },
      ],
    },
  },
  NEXON: {
    label: "Tata Nexon", emoji: "🚙", color: "#8b5cf6",
    variants: {
      "Petrol MT": [
        { name: "1.2P SMART", ex: 736990, ins: 42374, rto: 86840, tcs: 13627, onroad: 866204 },
        { name: "1.2P SMART PLUS", ex: 806990, ins: 45285, rto: 94694, tcs: 14560, onroad: 946969 },
        { name: "1.2P SMART PLUS (S)", ex: 836990, ins: 46533, rto: 98060, tcs: 14960, onroad: 981583 },
        { name: "1.2P PURE PLUS", ex: 894990, ins: 48945, rto: 104568, tcs: 15733, onroad: 1048503 },
        { name: "1.2P PURE PLUS (S)", ex: 922990, ins: 50110, rto: 107709, tcs: 16107, onroad: 1080809 },
        { name: "1.2P CREATIVE", ex: 999990, ins: 53312, rto: 116349, tcs: 17133, onroad: 1169651 },
        { name: "1.2P CREATIVE PLUS (S)", ex: 1034990, ins: 54768, rto: 130833, tcs: 19325, onroad: 1230941 },
        { name: "1.2P CREATIVE PLUS (S) DARK", ex: 1076990, ins: 56515, rto: 135974, tcs: 19955, onroad: 1280249 },
        { name: "1.2P CREATIVE PLUS (PS) DT", ex: 1131990, ins: 58802, rto: 142706, tcs: 20780, onroad: 1344818 },
        { name: "1.2P CREATIVE PLUS (PS) DARK", ex: 1171990, ins: 60466, rto: 147602, tcs: 21380, onroad: 1391778 },
        { name: "1.2P FEARLESS PLUS (PS) DT", ex: 1226990, ins: 62753, rto: 154334, tcs: 22205, onroad: 1456347 },
        { name: "1.2P FEARLESS PLUS (PS) DARK", ex: 1246990, ins: 63584, rto: 156782, tcs: 22505, onroad: 1479827 },
        { name: "1.2P FEARLESS PLUS PS RDK", ex: 1256990, ins: 64001, rto: 158006, tcs: 22655, onroad: 1491567 },
      ],
      "Petrol AT": [
        { name: "1.2P SMART PLUS AMT", ex: 881990, ins: 48404, rto: 103109, tcs: 15560, onroad: 1033503 },
        { name: "1.2P PURE PLUS AMT", ex: 959990, ins: 51649, rto: 111861, tcs: 16600, onroad: 1123500 },
        { name: "1.2P PURE PLUS (S) AMT", ex: 987990, ins: 52813, rto: 115002, tcs: 16973, onroad: 1155805 },
        { name: "1.2P CREATIVE AMT", ex: 1074990, ins: 56431, rto: 135729, tcs: 19925, onroad: 1277900 },
        { name: "1.2P CREATIVE PLUS (S) AMT", ex: 1104990, ins: 57679, rto: 139401, tcs: 20375, onroad: 1313120 },
        { name: "1.2P CREATIVE PLUS (S) AMT DARK", ex: 1146990, ins: 59426, rto: 144542, tcs: 21005, onroad: 1362428 },
        { name: "1.2P CREATIVE DCA", ex: 1124990, ins: 58511, rto: 141849, tcs: 20675, onroad: 1336600 },
        { name: "1.2P CREATIVE PLUS (PS) DCA DT", ex: 1246990, ins: 63584, rto: 156782, tcs: 22505, onroad: 1479827 },
        { name: "1.2P CREATIVE PLUS (PS) DCA DARK", ex: 1281990, ins: 65041, rto: 161066, tcs: 23030, onroad: 1520917 },
        { name: "FEARLESS PLUS 1.2P (A) PS DCA DT", ex: 1361990, ins: 68368, rto: 170858, tcs: 24230, onroad: 1614836 },
        { name: "FEARLESS PLUS 1.2P (A) PS DCA DK", ex: 1381990, ins: 69200, rto: 173306, tcs: 24530, onroad: 1638316 },
        { name: "FEARLESS PLUS 1.2P (A) PS DCA RDK", ex: 1391990, ins: 69616, rto: 174530, tcs: 24680, onroad: 1650056 },
      ],
      "Diesel MT": [
        { name: "1.5D SMART PLUS", ex: 899990, ins: 49153, rto: 123489, tcs: 15800, onroad: 1072632 },
        { name: "1.5D SMART PLUS (S)", ex: 936990, ins: 50692, rto: 128395, tcs: 16293, onroad: 1116077 },
        { name: "1.5D PURE PLUS", ex: 999990, ins: 53312, rto: 136749, tcs: 17133, onroad: 1190051 },
        { name: "1.5D PURE PLUS (S)", ex: 1027990, ins: 54477, rto: 150947, tcs: 17507, onroad: 1243694 },
        { name: "1.5D CREATIVE", ex: 1124990, ins: 58511, rto: 164799, tcs: 18800, onroad: 1359550 },
        { name: "1.5D CREATIVE PLUS (S)", ex: 1149990, ins: 59551, rto: 168369, tcs: 19133, onroad: 1389410 },
        { name: "1.5D CREATIVE PLUS (S) DARK", ex: 1186990, ins: 61090, rto: 173652, tcs: 19627, onroad: 1433602 },
        { name: "1.5D CREATIVE PLUS (PS) DT", ex: 1241990, ins: 63377, rto: 181506, tcs: 20360, onroad: 1499293 },
        { name: "1.5D CREATIVE PLUS (PS) DARK", ex: 1281990, ins: 65041, rto: 187218, tcs: 20893, onroad: 1547069 },
        { name: "1.5D FEARLESS PLUS (PS) DT", ex: 1336990, ins: 67328, rto: 195072, tcs: 21627, onroad: 1612760 },
        { name: "1.5D FEARLESS PLUS (PS) DARK", ex: 1356990, ins: 68160, rto: 197928, tcs: 21893, onroad: 1636648 },
        { name: "1.5D FEARLESS PLUS PS RDK", ex: 1366990, ins: 68576, rto: 199356, tcs: 22027, onroad: 1648592 },
      ],
      "Diesel AT": [
        { name: "1.5D PURE PLUS AMT", ex: 1064990, ins: 56016, rto: 156231, tcs: 18000, onroad: 1287887 },
        { name: "1.5D CREATIVE AMT", ex: 1184990, ins: 61006, rto: 173367, tcs: 19600, onroad: 1431213 },
        { name: "1.5D CREATIVE PLUS (S) AMT", ex: 1214990, ins: 62254, rto: 177651, tcs: 20000, onroad: 1467045 },
        { name: "1.5D CREATIVE PLUS (S) AMT DARK", ex: 1251990, ins: 63793, rto: 182934, tcs: 20493, onroad: 1511237 },
        { name: "1.5D CREATIVE PLUS (PS) AMT DT", ex: 1306990, ins: 66080, rto: 190788, tcs: 21227, onroad: 1576928 },
        { name: "1.5D CREATIVE PLUS (PS) AMT DARK", ex: 1346990, ins: 67744, rto: 196500, tcs: 21760, onroad: 1624704 },
        { name: "1.5D FEARLESS PLUS (PS) AMT DT", ex: 1401990, ins: 70031, rto: 204354, tcs: 22493, onroad: 1690395 },
        { name: "1.5D FEARLESS PLUS (PS) AMT DARK", ex: 1421990, ins: 70863, rto: 207210, tcs: 22760, onroad: 1714283 },
      ],
      "CNG MT": [
        { name: "iCNG SMART", ex: 829990, ins: 46242, rto: 71877, tcs: 14867, onroad: 948109 },
        { name: "iCNG SMART PLUS", ex: 921990, ins: 50068, rto: 79384, tcs: 16093, onroad: 1051442 },
        { name: "iCNG SMART PLUS (S)", ex: 951990, ins: 51316, rto: 81832, tcs: 16493, onroad: 1085138 },
        { name: "iCNG PURE PLUS", ex: 984990, ins: 52688, rto: 84525, tcs: 16933, onroad: 1122203 },
        { name: "iCNG PURE PLUS (S)", ex: 999990, ins: 53312, rto: 85749, tcs: 17133, onroad: 1139051 },
        { name: "iCNG CREATIVE", ex: 1104990, ins: 57679, rto: 105588, tcs: 18533, onroad: 1279307 },
        { name: "iCNG CREATIVE PLUS (S)", ex: 1134990, ins: 58927, rto: 108342, tcs: 18933, onroad: 1313609 },
        { name: "iCNG CREATIVE PLUS (S) DARK", ex: 1171990, ins: 60466, rto: 111739, tcs: 19427, onroad: 1355915 },
        { name: "iCNG CREATIVE PLUS (PS) DT", ex: 1226990, ins: 62753, rto: 116788, tcs: 20160, onroad: 1418801 },
        { name: "iCNG CREATIVE PLUS (PS) DARK", ex: 1266990, ins: 64417, rto: 120460, tcs: 20693, onroad: 1464537 },
        { name: "iCNG FEARLESS PLUS (PS) DT", ex: 1321990, ins: 66704, rto: 125509, tcs: 21427, onroad: 1527423 },
        { name: "iCNG FEARLESS PLUS (PS) DARK", ex: 1341990, ins: 67536, rto: 127345, tcs: 21693, onroad: 1550291 },
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
    { name: "Oberon Black (Dark Edition)", hex: "#0f172a" },
    { name: "Fearless Red (Signature)", hex: "#dc2626" },
    { name: "Pristine White (High Gloss)", hex: "#fafafa" },
    { name: "Daytona Grey (Metropolitan)", hex: "#4b5563" },
    { name: "Seaweed Green (Adventure Special)", hex: "#14532d" },
    { name: "Sunlit Yellow (Dual-Tone)", hex: "#eab308" },
    { name: "Pure Grey (Steel Metallic)", hex: "#71717a" },
    { name: "Carnelian Red (Red #DARK)", hex: "#7f1d1d" },
    { name: "Nitro Crimson (Metallic)", hex: "#991b1b" },
  ],
  SAFARI: [
    { name: "Cosmic Gold (Signature)", hex: "#d97706" },
    { name: "Galactic Sapphire (Deep Blue)", hex: "#1e3a8a" },
    { name: "Oyster White (Pearl)", hex: "#f4f4f5" },
    { name: "Daytona Grey (Metropolitan)", hex: "#4b5563" },
    { name: "Supernova Copper (Adventure Special)", hex: "#78350f" },
    { name: "Frost White (Gloss)", hex: "#fafafa" },
    { name: "Pure Grey (Steel Metallic)", hex: "#71717a" },
    { name: "Oberon Black (Dark Edition)", hex: "#0f172a" },
    { name: "Carnelian Red (Red Dark)", hex: "#7f1d1d" },
  ],
  CURVV: [
    { name: "Oberon Black (Dark Edition)", hex: "#0f172a" },
    { name: "Gold Essence (Signature)", hex: "#b45309" },
    { name: "Flame Red (Sport)", hex: "#dc2626" },
    { name: "Opera Blue", hex: "#1d4ed8" },
    { name: "Pristine White", hex: "#fafafa" },
    { name: "Daytona Grey", hex: "#4b5563" },
    { name: "Pure Grey", hex: "#71717a" },
    { name: "Nitro Crimson", hex: "#991b1b" },
  ],
  SIERRA: [
    { name: "Coorg Cloud (Satin Slate)", hex: "#5f705a" },
    { name: "Munnar Mist (Satin Green)", hex: "#2e463a" },
    { name: "Pristine White (High Gloss)", hex: "#fafafa" },
    { name: "Pure Grey (Steel Metallic)", hex: "#71717a" },
    { name: "Bengal Rouge (Deep Red Metallic)", hex: "#881337" },
    { name: "Andaman Adventure (Sunset Orange)", hex: "#c2410c" },
    { name: "Oberon Black (Dark Edition)", hex: "#0f172a" },
  ],
  ALTROZ: [
    { name: "Cosmo Black (Dark Edition)", hex: "#0f172a" },
    { name: "High Street Gold (Signature)", hex: "#ca8a04" },
    { name: "Downtown Red", hex: "#dc2626" },
    { name: "Avenue White", hex: "#fafafa" },
    { name: "Harbour Blue", hex: "#0284c7" },
    { name: "Opera Blue", hex: "#1d4ed8" },
    { name: "Arcade Grey", hex: "#4b5563" },
  ],
  PUNCH: [
    { name: "Calypso Red", hex: "#b91c1c" },
    { name: "Tornado Blue", hex: "#0284c7" },
    { name: "Tropical Mist", hex: "#0d9488" },
    { name: "Meteor Bronze", hex: "#854d0e" },
    { name: "Atomic Orange", hex: "#ea580c" },
    { name: "Orcus White", hex: "#fafafa" },
    { name: "Daytona Grey", hex: "#4b5563" },
  ],
  NEXON: [
    { name: "Atlas Black (Dark Edition)", hex: "#0f172a" },
    { name: "Fearless Purple (Signature)", hex: "#581c87" },
    { name: "Creative Ocean", hex: "#0891b2" },
    { name: "Flame Red", hex: "#dc2626" },
    { name: "Pure Grey", hex: "#71717a" },
    { name: "Pristine White", hex: "#fafafa" },
    { name: "Daytona Grey", hex: "#4b5563" },
  ],
};

// Returns only the colors that apply to the given variant
export function getEligibleColors(carKey: CarKey, variantName: string): Array<{ name: string; hex: string }> {
  const vUpper = variantName.toUpperCase();
  const allColors = VEHICLE_COLORS[carKey] || [];
  
  // Specific check for Dark/DK/RDK/STEALTH versions across models
  const isDarkVariant = vUpper.includes("DK") || vUpper.includes("DARK") || vUpper.includes("RDK") || vUpper.includes("STEALTH");

  if (carKey === "HARRIER") {
    if (isDarkVariant) {
      if (vUpper.includes("RDK") || vUpper.includes("ULTRA")) {
        return allColors.filter(c => c.name.includes("Black") || c.name.includes("#DARK") || c.name.includes("Dark"));
      }
      return allColors.filter(c => c.name.includes("Black") || c.name.includes("Dark"));
    }
    
    if (vUpper.includes("SMART")) {
      return allColors.filter(c => ["Daytona Grey (Metropolitan)", "Fearless Red (Signature)", "Pristine White (High Gloss)", "Pure Grey (Steel Metallic)"].includes(c.name));
    }
    if (vUpper.includes("PURE")) {
      return allColors.filter(c => ["Daytona Grey (Metropolitan)", "Fearless Red (Signature)", "Pristine White (High Gloss)", "Oberon Black (Dark Edition)"].includes(c.name));
    }
    if (vUpper.includes("ADVENTURE")) {
      return allColors.filter(c => ["Daytona Grey (Metropolitan)", "Fearless Red (Signature)", "Pristine White (High Gloss)", "Seaweed Green (Adventure Special)", "Oberon Black (Dark Edition)"].includes(c.name));
    }
    if (vUpper.includes("ULTRA") || vUpper.includes("FEARLESS UL")) {
      return allColors.filter(c => ["Carnelian Red (Red #DARK)", "Nitro Crimson (Metallic)", "Oberon Black (Dark Edition)"].includes(c.name));
    }
    if (vUpper.includes("FEARLESS X PLUS")) {
      return allColors.filter(c => ["Pure Grey (Steel Metallic)", "Daytona Grey (Metropolitan)", "Fearless Red (Signature)", "Pristine White (High Gloss)", "Seaweed Green (Adventure Special)", "Sunlit Yellow (Dual-Tone)", "Oberon Black (Dark Edition)", "Nitro Crimson (Metallic)"].includes(c.name));
    }
    if (vUpper.includes("FEARLESS")) {
      return allColors.filter(c => ["Pure Grey (Steel Metallic)", "Daytona Grey (Metropolitan)", "Fearless Red (Signature)", "Pristine White (High Gloss)", "Seaweed Green (Adventure Special)", "Oberon Black (Dark Edition)"].includes(c.name));
    }
    return allColors.filter(c => !c.name.includes("RDK") && !c.name.includes("Red"));
  }

  if (carKey === "SAFARI") {
    if (isDarkVariant) {
      if (vUpper.includes("RDK") || vUpper.includes("ULTRA") || vUpper.includes("ACCOMPLISHED UL")) {
        return allColors.filter(c => c.name.includes("Black") || c.name.includes("Dark"));
      }
      return allColors.filter(c => c.name.includes("Black") || c.name.includes("Dark"));
    }

    if (vUpper.includes("SMART")) {
      return allColors.filter(c => ["Frost White (Gloss)", "Daytona Grey (Metropolitan)", "Oyster White (Pearl)", "Pure Grey (Steel Metallic)"].includes(c.name));
    }
    if (vUpper.includes("PURE")) {
      return allColors.filter(c => ["Frost White (Gloss)", "Daytona Grey (Metropolitan)", "Galactic Sapphire (Deep Blue)", "Oberon Black (Dark Edition)"].includes(c.name));
    }
    if (vUpper.includes("ADVENTURE")) {
      return allColors.filter(c => ["Pure Grey (Steel Metallic)", "Frost White (Gloss)", "Daytona Grey (Metropolitan)", "Galactic Sapphire (Deep Blue)", "Supernova Copper (Adventure Special)", "Oberon Black (Dark Edition)"].includes(c.name));
    }
    if (vUpper.includes("ACCOMPLISHED")) {
      return allColors; 
    }
    return allColors.filter(c => !c.name.includes("Gold") && !c.name.includes("Copper"));
  }

  if (carKey === "CURVV") {
    if (isDarkVariant) {
      return allColors.filter(c => c.name.includes("Black") || c.name.toUpperCase().includes("DARK"));
    }
    if (vUpper.includes("SMART")) {
      return allColors.filter(c => ["Pristine White", "Daytona Grey"].includes(c.name));
    }
    if (vUpper.includes("PURE")) {
      return allColors.filter(c => ["Pristine White", "Daytona Grey", "Flame Red", "Opera Blue", "Oberon Black (Dark Edition)"].includes(c.name));
    }
    if (vUpper.includes("CREATIVE S") || vUpper.includes("CREATIVE+")) {
      return allColors.filter(c => ["Pristine White", "Daytona Grey", "Flame Red", "Pure Grey", "Opera Blue", "Nitro Crimson", "Oberon Black (Dark Edition)"].includes(c.name));
    }
    if (vUpper.includes("CREATIVE")) {
      return allColors.filter(c => ["Pristine White", "Daytona Grey", "Flame Red", "Opera Blue", "Nitro Crimson"].includes(c.name));
    }
    if (vUpper.includes("ACCOMPLISHED")) {
      return allColors;
    }
    return allColors.filter(c => !c.name.includes("Gold"));
  }

  if (carKey === "SIERRA") {
    if (isDarkVariant) {
      return allColors.filter(c => c.name.includes("Black") || c.name.toUpperCase().includes("DARK"));
    }
    if (vUpper.includes("SMART")) {
      return allColors.filter(c => ["Pristine White (High Gloss)", "Pure Grey (Steel Metallic)"].includes(c.name));
    }
    if (vUpper.includes("PURE")) {
      return allColors.filter(c => ["Munnar Mist (Satin Green)", "Pristine White (High Gloss)", "Pure Grey (Steel Metallic)", "Coorg Cloud (Satin Slate)"].includes(c.name));
    }
    if (vUpper.includes("PURE+")) {
      return allColors.filter(c => ["Munnar Mist (Satin Green)", "Pristine White (High Gloss)", "Pure Grey (Steel Metallic)", "Coorg Cloud (Satin Slate)", "Bengal Rouge (Deep Red Metallic)"].includes(c.name));
    }
    if (vUpper.includes("ADVENTURE+")) {
      return allColors.filter(c => ["Munnar Mist (Satin Green)", "Pristine White (High Gloss)", "Pure Grey (Steel Metallic)", "Coorg Cloud (Satin Slate)", "Bengal Rouge (Deep Red Metallic)", "Andaman Adventure (Sunset Orange)"].includes(c.name));
    }
    if (vUpper.includes("ADVENTURE")) {
      return allColors.filter(c => ["Munnar Mist (Satin Green)", "Pristine White (High Gloss)", "Pure Grey (Steel Metallic)", "Coorg Cloud (Satin Slate)", "Bengal Rouge (Deep Red Metallic)"].includes(c.name));
    }
    if (vUpper.includes("ACCOMPLISHED")) {
      return allColors;
    }
  }

  if (carKey === "ALTROZ" || carKey === "PUNCH" || carKey === "NEXON") {
    if (isDarkVariant) {
      return allColors.filter(c => c.name.toLowerCase().includes("black") || c.name.toLowerCase().includes("dark"));
    }
    return allColors;
  }

  return allColors;
}

// Official TATA Premium Genuine Accessories Checklist Addons with Pricing
export const VEHICLE_ACCESSORIES = [
  { id: "mats", name: "Genuine 3D Premium Cabin Mats", price: 4500, desc: "Fitted, water-resistant all-weather premium protection" },
  { id: "scuff", name: "Illuminated Chrome Scuff Plates", price: 3800, desc: "Premium door entry accents on door sills" },
  { id: "mudflaps", name: "Front & Rear Heavy-Duty Mud Flaps", price: 1200, desc: "TATA genuine splash-guard impact protection" },
  { id: "moulding", name: "Satin Chrome Side Protection Mouldings", price: 5500, desc: "Protects siding with premium gloss highlights" },
  { id: "cover", name: "Weather-Resistant Custom Body Cover", price: 2800, desc: "Double-stitched premium safe dust & rain shield" },
  { id: "ceramic", name: "Showroom 9H Ceramic Polish Treatment", price: 12000, desc: "Showroom-quality protective paint treatment" },
  { id: "warranty", name: "Extended Official TATA 2-Year Warranty", price: 16500, desc: "Covers engine, electrical, and transmission safety mechanics" },
];

// DYNAMIC GLOBAL SANITIZER: Enforces and normalizes Indian tax mechanics on startup.
// 1. TCS (1% of Ex-Showroom) is EXCLUSIVELY applicable on vehicles exceeding ₹10,00,000 (10 Lakhs) Ex-Showroom price.
// 2. For vehicles with Ex-Showroom price ≤ ₹10,00,000, TCS is strictly ₹0.
// 3. Re-normalizes the pre-calculated standard `onroad` value for any variant to ensure exact mathematical agreement.
for (const carKey of Object.keys(CARS) as CarKey[]) {
  const car = CARS[carKey];
  for (const fuelType of Object.keys(car.variants)) {
    car.variants[fuelType] = car.variants[fuelType].map((variant) => {
      if (variant.ex <= 1000000) {
        return {
          ...variant,
          tcs: 0,
          onroad: variant.ex + variant.ins + variant.rto, // exactly ex + ins + rto (no TCS)
        };
      } else {
        // Exceeds 10 Lakhs: TCS is strictly required (1% rate)
        const calculatedTcs = variant.tcs > 0 ? variant.tcs : Math.round(variant.ex * 0.01);
        return {
          ...variant,
          tcs: calculatedTcs,
          onroad: variant.ex + variant.ins + variant.rto + calculatedTcs,
        };
      }
    });
  }
}

