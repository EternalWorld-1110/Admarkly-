import { CarKey } from "../types";

interface VehicleLogoProps {
  carKey: CarKey | string;
  isSelected?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function VehicleLogo({
  carKey,
  isSelected = false,
  className = "",
  size = "md"
}: VehicleLogoProps) {
  const normalizedKey = carKey.toUpperCase() as CarKey;

  // Set sizing classes
  const sizeClasses = {
    sm: "w-16 h-8",
    md: "w-24 h-12",
    lg: "w-32 h-16"
  };

  const activeColor = {
    HARRIER: "#ea580c", // Orange
    SAFARI: "#0d9488",  // Teal
    CURVV: "#d97706",   // Amber
    SIERRA: "#3b82f6",  // Blue
    ALTROZ: "#eab308",  // Yellow
    PUNCH: "#f97316",   // Orange/Bronze
    NEXON: "#8b5cf6",   // Purple
    TIAGO: "#10b981"    // Emerald/Mint (EV)
  }[normalizedKey] || "#a1a1aa";

  const renderLogo = () => {
    switch (normalizedKey) {
      case "HARRIER":
        return (
          <svg
            viewBox="0 0 100 50"
            className="w-full h-full drop-shadow-[0_0_15px_rgba(234,88,12,0.15)] transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background dynamic ambient glow when selected */}
            {isSelected && (
              <circle cx="50" cy="25" r="20" fill="url(#harrierGlow)" opacity="0.4" />
            )}
            
            <defs>
              <radialGradient id="harrierGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ea580c" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Harrier Silhouette/Fascia artwork */}
            <g
              stroke={isSelected ? "#ea580c" : "rgba(100,116,139,0.35)"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Dynamic top dual razor DRL slits */}
              <path
                d="M 12 18 C 22 18, 35 17, 43 20"
                stroke="#ea580c"
                strokeWidth={isSelected ? "2.5" : "1.8"}
                className={`transition-all duration-300 ${isSelected ? "animate-pulse" : ""}`}
              />
              <path
                d="M 88 18 C 78 18, 65 17, 57 20"
                stroke="#ea580c"
                strokeWidth={isSelected ? "2.5" : "1.8"}
                className={`transition-all duration-300 ${isSelected ? "animate-pulse" : ""}`}
              />
              
              {/* Central connection grille design line */}
              <path d="M 43 20 L 57 20" stroke={isSelected ? "#ea580c" : "rgba(113,113,122,0.6)"} strokeWidth="1.5" />

              {/* Lower main multi-pod headlamp housings */}
              <path 
                d="M 16 24 L 26 24 L 23 33 L 15 30 Z" 
                fill={isSelected ? "rgba(234, 88, 12, 0.15)" : "rgba(226,232,240,0.6)"} 
                stroke="#ea580c" 
                strokeWidth="1.2" 
              />
              <path 
                d="M 84 24 L 74 24 L 77 33 L 85 30 Z" 
                fill={isSelected ? "rgba(234, 88, 12, 0.15)" : "rgba(226,232,240,0.6)"} 
                stroke="#ea580c" 
                strokeWidth="1.2" 
              />

              {/* Center parametric grill bounding box */}
              <polygon 
                points="34,22 66,22 62,32 38,32" 
                stroke={isSelected ? "rgba(234,88,12,0.5)" : "rgba(113,113,122,0.4)"} 
                strokeWidth="1" 
                fill={isSelected ? "rgba(234,88,12,0.05)" : "transparent"} 
              />
              {/* Grille mesh patterns */}
              <path d="M 37 25 Q 50 22 63 25" stroke="rgba(234,88,12,0.3)" strokeWidth="1" />
              <path d="M 39 29 Q 50 26 61 29" stroke="rgba(234,88,12,0.3)" strokeWidth="1" />

              {/* Outer powerful bumper outline & skidplate base */}
              <path 
                d="M 8 15 L 12 30 L 21 35 L 34 38 L 66 38 L 79 35 L 88 30 L 92 15" 
                stroke={isSelected ? "#ea580c" : "rgba(161,161,170,0.3)"} 
                strokeWidth="1.5" 
                strokeOpacity={isSelected ? "0.8" : "0.4"} 
              />
              <path d="M 38 38 L 42 43 L 58 43 L 62 38" stroke={isSelected ? "#ea580c" : "rgba(113,113,122,0.5)"} strokeWidth="1.5" />
            </g>
          </svg>
        );

      case "SAFARI":
        return (
          <svg
            viewBox="0 0 100 50"
            className="w-full h-full drop-shadow-[0_0_15px_rgba(13,148,136,0.15)] transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background glow when selected */}
            {isSelected && (
              <circle cx="50" cy="25" r="20" fill="url(#safariGlow)" opacity="0.4" />
            )}

            <defs>
              <radialGradient id="safariGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Majestic Safari Connected LED Bar & Parametric Grill */}
            <g
              stroke={isSelected ? "#0d9488" : "rgba(100,116,139,0.35)"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Seamless Full-width endless glowing top LED bar */}
              <path
                d="M 10 19 Q 50 14 90 19"
                stroke="#0d9488"
                strokeWidth={isSelected ? "2.5" : "1.8"}
                className={isSelected ? "animate-pulse" : ""}
              />
              <path d="M 21 21 L 79 21" stroke="rgba(13, 148, 136, 0.4)" strokeWidth="1" />

              {/* Distinctive Safari Parametric Grill outline */}
              <polygon
                points="31,23 69,23 65,32 35,32"
                stroke={isSelected ? "rgba(13,148,136,0.5)" : "rgba(113,113,122,0.4)"}
                strokeWidth="1"
                fill={isSelected ? "rgba(13,148,136,0.06)" : "transparent"}
              />
              {/* Tri-arrow luxury motifs indicators */}
              <path d="M 37 26 L 63 26 M 40 29 L 60 29" stroke="#0d9488" strokeDasharray="3,2" strokeWidth="1.2" />

              {/* Lower bumper majestic split headlights in contrast housings */}
              <path
                d="M 13 25 C 13 25, 18 25, 18 31 C 18 33, 14 35, 12 33 Z"
                fill={isSelected ? "rgba(13, 148, 136, 0.15)" : "rgba(226,232,240,0.6)"}
                stroke="#0d9488"
                strokeWidth="1.2"
              />
              <path
                d="M 87 25 C 87 25, 82 25, 82 31 C 82 33, 86 35, 88 33 Z"
                fill={isSelected ? "rgba(13, 148, 136, 0.15)" : "rgba(226,232,240,0.6)"}
                stroke="#0d9488"
                strokeWidth="1.2"
              />

              {/* Robust majestic bumper frame & luxury skid plate */}
              <path
                d="M 7 15 L 11 32 L 19 36 L 31 38 L 69 38 L 81 36 L 89 32 L 93 15"
                stroke={isSelected ? "#0d9488" : "rgba(161,161,170,0.3)"}
                strokeWidth="1.5"
                strokeOpacity={isSelected ? "0.8" : "0.4"}
              />
              <rect
                x="35"
                y="38"
                width="30"
                height="4"
                rx="1"
                fill={isSelected ? "rgba(13, 148, 136, 0.2)" : "rgba(39,39,42,0.5)"}
                stroke={isSelected ? "#0d9488" : "rgba(113,113,122,0.5)"}
                strokeWidth="1.2"
              />
            </g>
          </svg>
        );

      case "CURVV":
        return (
          <svg
            viewBox="0 0 100 50"
            className="w-full h-full drop-shadow-[0_0_15px_rgba(217,119,6,0.15)] transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background glow when selected */}
            {isSelected && (
              <circle cx="50" cy="25" r="20" fill="url(#curvvGlow)" opacity="0.4" />
            )}

            <defs>
              <radialGradient id="curvvGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d97706" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Futuristic Coupe Roofline Side Silhouette */}
            <g
              stroke={isSelected ? "#d97706" : "rgba(100,116,139,0.35)"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Dynamic sloping coupe roof outline from bonnet to fastback spoiler */}
              <path
                d="M 6 34 C 11 31, 18 30, 24 23 C 32 14, 52 9, 68 17 C 76 21, 85 26, 91 29 L 95 30"
                stroke="#d97706"
                strokeWidth={isSelected ? "3" : "2"}
                className="transition-all duration-300"
              />

              {/* Windshield & sleek modern window frames */}
              <path
                d="M 33 21 L 53 14 L 68 18 L 65 23 C 55 24, 40 24, 33 21 Z"
                fill={isSelected ? "rgba(217, 119, 6, 0.12)" : "rgba(226,232,240,0.5)"}
                stroke="#d97706"
                strokeWidth="1"
              />

              {/* Crisp body line creases */}
              <path d="M 5 34 L 95 34" stroke={isSelected ? "rgba(217, 119, 6, 0.4)" : "rgba(113,113,122,0.3)"} strokeWidth="1" />
              
              {/* Integrated active rear lip spoiler wing */}
              <path
                d="M 91 29 L 95 32 L 90 34 L 88 30 Z"
                fill={isSelected ? "rgba(217,119,6,0.3)" : "rgba(113,113,122,0.5)"}
                stroke="#d97706"
                strokeWidth="1"
              />

              {/* Massive stylish wheels & arches */}
              <circle cx="26" cy="34" r="7.5" fill="#ffffff" stroke="#d97706" strokeWidth="1.5" />
              <circle cx="74" cy="34" r="7.5" fill="#ffffff" stroke="#d97706" strokeWidth="1.5" />
              
              {/* Wheel visual geometric hub spokes */}
              <path d="M 26 26.5 L 26 41.5 M 18.5 34 L 33.5 34" stroke={isSelected ? "#d97706" : "rgba(113,113,122,0.6)"} strokeWidth="1" />
              <path d="M 74 26.5 L 74 41.5 M 66.5 34 L 81.5 34" stroke={isSelected ? "#d97706" : "rgba(113,113,122,0.6)"} strokeWidth="1" />
            </g>
          </svg>
        );

      case "SIERRA":
        return (
          <svg
            viewBox="0 0 100 50"
            className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background glow when selected */}
            {isSelected && (
              <circle cx="50" cy="25" r="20" fill="url(#sierraGlow)" opacity="0.4" />
            )}

            <defs>
              <radialGradient id="sierraGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Vintage Heritage Reborn Electric Sierra Silhouette */}
            <g
              stroke={isSelected ? "#3b82f6" : "rgba(100,116,139,0.35)"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Flat-top, rugged, boxy body profile */}
              <path
                d="M 5 31 L 8 24 C 10 20, 15 19, 22 19 L 78 19 C 86 19, 92 20, 93 27 L 94 33"
                stroke="#3b82f6"
                strokeWidth={isSelected ? "3" : "2"}
                className="transition-all duration-300"
              />

              {/* Large front executive glass window */}
              <path
                d="M 28 21 L 45 21 L 45 28 L 28 28 Z"
                fill={isSelected ? "rgba(59, 130, 246, 0.08)" : "rgba(226,232,240,0.5)"}
                stroke="#3b82f6"
                strokeWidth="1"
              />

              {/* Back wrapping signature Sierra Alpine Glass canopy */}
              <path
                d="M 53 21 L 88 21 C 90 21, 91 22, 91 25 L 89 28 L 53 28 Z"
                fill={isSelected ? "rgba(59, 130, 246, 0.22)" : "rgba(226,232,240,0.7)"}
                stroke="#3b82f6"
                strokeWidth="1.2"
                className="transition-all duration-300"
              />

              {/* Bold Sierra thick B-pillar accent split */}
              <rect 
                x="45" 
                y="20" 
                width="8" 
                height="9" 
                fill="#3b82f6" 
                fillOpacity={isSelected ? "1" : "0.5"} 
                className="transition-all duration-300"
              />

              {/* Sleek lower skid and futuristic rock protector profiles */}
              <path 
                d="M 4 32 L 95 32 C 95 32, 96 34, 93 35 L 5 35 Z" 
                fill={isSelected ? "rgba(59, 130, 246, 0.06)" : "transparent"} 
                stroke={isSelected ? "rgba(59, 130, 246, 0.3)" : "rgba(113,113,122,0.2)"} 
                strokeWidth="1" 
              />

              {/* Sturdy legendary offroad EV wheels */}
              <circle cx="22" cy="33" r="7.5" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.5" />
              <circle cx="76" cy="33" r="7.5" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.5" />
              <circle cx="22" cy="33" r="3.5" stroke={isSelected ? "#3b82f6" : "rgba(113,113,122,0.5)"} strokeWidth="1" />
              <circle cx="76" cy="33" r="3.5" stroke={isSelected ? "#3b82f6" : "rgba(113,113,122,0.5)"} strokeWidth="1" />
            </g>
          </svg>
        );

      case "TIAGO":
        return (
          <svg
            viewBox="0 0 100 50"
            className="w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background glow when selected */}
            {isSelected && (
              <circle cx="50" cy="25" r="20" fill="url(#tiagoGlow)" opacity="0.4" />
            )}

            <defs>
              <radialGradient id="tiagoGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Smart Hatchback Silhouette */}
            <g
              stroke={isSelected ? "#10b981" : "rgba(113,113,122,0.5)"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Sleek hatchback sloping outline */}
              <path
                d="M 6 32 C 12 30, 18 28, 25 21 C 31 16, 48 14, 64 20 C 72 23, 80 27, 85 30 L 89 31.5"
                stroke="#10b981"
                strokeWidth={isSelected ? "3" : "2"}
                className="transition-all duration-300"
              />

              {/* Connected tail-lamp/hatch visual or rear spoiler */}
              <path d="M 85 30 L 88 35 L 85 40 L 78 40" stroke="#10b981" strokeWidth="1" />

              {/* Windows layout */}
              <path
                d="M 30 19 L 48 16 L 62 19 L 59 23 C 51 24, 38 24, 30 19 Z"
                fill={isSelected ? "rgba(16, 185, 129, 0.12)" : "rgba(226,232,240,0.5)"}
                stroke="#10b981"
                strokeWidth="1"
              />

              {/* Lower baseline */}
              <path d="M 4 33 L 89 33" stroke={isSelected ? "rgba(16, 185, 129, 0.4)" : "rgba(113,113,122,0.3)"} strokeWidth="1" />

              {/* Sporty R14 hyperstyle wheels */}
              <circle cx="24" cy="33" r="7.4" fill="#ffffff" stroke="#10b981" strokeWidth="1.8" />
              <circle cx="68" cy="33" r="7.4" fill="#ffffff" stroke="#10b981" strokeWidth="1.8" />

              {/* Diamond cut internal styling */}
              <circle cx="24" cy="33" r="2.8" stroke={isSelected ? "#10b981" : "rgba(113,113,122,0.5)"} strokeWidth="1" />
              <circle cx="68" cy="33" r="2.8" stroke={isSelected ? "#10b981" : "rgba(113,113,122,0.5)"} strokeWidth="1" />
            </g>
          </svg>
        );

      case "ALTROZ":
        return (
          <svg
            viewBox="0 0 100 50"
            className="w-full h-full drop-shadow-[0_0_15px_rgba(234,179,8,0.15)] transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background glow when selected */}
            {isSelected && (
              <circle cx="50" cy="25" r="20" fill="url(#altrozGlow)" opacity="0.4" />
            )}

            <defs>
              <radialGradient id="altrozGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#eab308" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Premium Hatchback Silhouette */}
            <g
              stroke={isSelected ? "#eab308" : "rgba(100,116,139,0.35)"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Sleek hot-hatch side lines & rear integrated spoiler */}
              <path
                d="M 6 32 C 14 31, 21 28, 28 23 C 35 15, 54 13, 72 20 C 78 22, 85 24, 88 28 L 91 32"
                stroke="#eab308"
                strokeWidth={isSelected ? "3" : "2"}
                className="transition-all duration-300"
              />

              {/* Passenger cabin glass house */}
              <path
                d="M 32 21 L 52 15 L 70 19 L 69 24 C 57 25, 41 24, 32 21 Z"
                fill={isSelected ? "rgba(234, 179, 8, 0.12)" : "rgba(226,232,240,0.5)"}
                stroke="#eab308"
                strokeWidth="1"
              />

              {/* Sweeping black-accented bottom feature crease */}
              <path d="M 6 32 L 91 32" stroke={isSelected ? "rgba(234, 179, 8, 0.4)" : "rgba(113,113,122,0.3)"} strokeWidth="1" />

              {/* Rear sporty roof spoiler tail */}
              <path
                d="M 72 20 L 76 21 L 75 23 L 71 22 Z"
                fill={isSelected ? "#eab308" : "rgba(113,113,122,0.5)"}
                stroke="#eab308"
                strokeWidth="1"
              />

              {/* R16 Laser-cut style Alloys */}
              <circle cx="26" cy="32" r="7.2" fill="#ffffff" stroke="#eab308" strokeWidth="1.5" />
              <circle cx="71" cy="32" r="7.2" fill="#ffffff" stroke="#eab308" strokeWidth="1.5" />

              {/* Spoke detailing */}
              <path d="M 26 24.8 L 26 39.2 M 18.8 32 L 33.2 32" stroke={isSelected ? "#eab308" : "rgba(113,113,122,0.6)"} strokeWidth="1" />
              <path d="M 71 24.8 L 71 39.2 M 63.8 32 L 78.2 32" stroke={isSelected ? "#eab308" : "rgba(113,113,122,0.6)"} strokeWidth="1" />
            </g>
          </svg>
        );

      case "PUNCH":
        return (
          <svg
            viewBox="0 0 100 50"
            className="w-full h-full drop-shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background glow when selected */}
            {isSelected && (
              <circle cx="50" cy="25" r="20" fill="url(#punchGlow)" opacity="0.4" />
            )}

            <defs>
              <radialGradient id="punchGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Upright Rugged Micro-SUV Silhouette */}
            <g
              stroke={isSelected ? "#f97316" : "rgba(100,116,139,0.35)"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Bold square flat-bonnet and straight roof profile */}
              <path
                d="M 6 31 C 12 30, 15 28, 22 24 L 74 24 C 80 24, 83 25, 86 29 L 88 33"
                stroke="#f97316"
                strokeWidth={isSelected ? "3" : "2"}
                className="transition-all duration-300"
              />

              {/* Roof Rails */}
              <path
                d="M 33 21 L 66 21"
                stroke={isSelected ? "#f97316" : "rgba(113,113,122,0.5)"}
                strokeWidth="1.5"
              />

              {/* Glass House & upright windshield */}
              <path
                d="M 28 24 L 46 24 L 46 29 L 28 29 Z"
                fill={isSelected ? "rgba(249, 115, 22, 0.08)" : "rgba(226,232,240,0.5)"}
                stroke="#f97316"
                strokeWidth="1"
              />
              <path
                d="M 52 24 L 72 24 C 74 24, 75 25, 75 27 L 74 29 L 52 29 Z"
                fill={isSelected ? "rgba(249, 115, 22, 0.15)" : "rgba(226,232,240,0.7)"}
                stroke="#f97316"
                strokeWidth="1"
              />

              {/* Ground-clearance guard base line */}
              <path d="M 5 33 L 90 33" stroke={isSelected ? "rgba(249, 115, 22, 0.4)" : "rgba(113,113,122,0.3)"} strokeWidth="1.2" />

              {/* Strong bold cladding wheel arches */}
              <circle cx="24" cy="33" r="7.5" fill="#ffffff" stroke="#f97316" strokeWidth="2.2" />
              <circle cx="68" cy="33" r="7.5" fill="#ffffff" stroke="#f97316" strokeWidth="2.2" />
              <circle cx="24" cy="33" r="3.5" stroke={isSelected ? "#f97316" : "rgba(113,113,122,0.5)"} strokeWidth="1" />
              <circle cx="68" cy="33" r="3.5" stroke={isSelected ? "#f97316" : "rgba(113,113,122,0.5)"} strokeWidth="1" />
            </g>
          </svg>
        );

      case "NEXON":
        return (
          <svg
            viewBox="0 0 100 50"
            className="w-full h-full drop-shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background glow when selected */}
            {isSelected && (
              <circle cx="50" cy="25" r="20" fill="url(#nexonGlow)" opacity="0.4" />
            )}

            <defs>
              <radialGradient id="nexonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Futuristic Compact Crossover Silhouette */}
            <g
              stroke={isSelected ? "#8b5cf6" : "rgba(100,116,139,0.35)"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Sweeping sporty sloping coupe crossover roofline */}
              <path
                d="M 5 32 C 10 29, 18 28, 24 22 C 32 13, 53 10, 70 17 C 78 20, 86 24, 91 28 L 94 30"
                stroke="#8b5cf6"
                strokeWidth={isSelected ? "3" : "2"}
                className="transition-all duration-300"
              />

              {/* Dynamic glass windows with stylized wrap around C-pillar */}
              <path
                d="M 30 20 L 51 14 L 67 18 L 64 23 C 54 24, 38 24, 30 20 Z"
                fill={isSelected ? "rgba(139, 92, 246, 0.12)" : "rgba(226,232,240,0.5)"}
                stroke="#8b5cf6"
                strokeWidth="1"
              />

              {/* Sleek lower body styling panels */}
              <path d="M 4 33 L 94 33" stroke={isSelected ? "rgba(139, 92, 246, 0.4)" : "rgba(113,113,122,0.3)"} strokeWidth="1" />

              {/* Dual-tone roof integrated contrast line */}
              <path d="M 24 22 Q 53 15 70 17" stroke="rgba(139, 92, 246, 0.6)" strokeWidth="1.2" />

              {/* R16 Diamond-cut Alloys inside defined chunky arches */}
              <circle cx="24" cy="33" r="7.4" fill="#ffffff" stroke="#8b5cf6" strokeWidth="1.8" />
              <circle cx="70" cy="33" r="7.4" fill="#ffffff" stroke="#8b5cf6" strokeWidth="1.8" />

              {/* Hub Detail */}
              <circle cx="24" cy="33" r="2.8" stroke={isSelected ? "#8b5cf6" : "rgba(113,113,122,0.5)"} strokeWidth="1" />
              <circle cx="70" cy="33" r="2.8" stroke={isSelected ? "#8b5cf6" : "rgba(113,113,122,0.5)"} strokeWidth="1" />
            </g>
          </svg>
        );

      default:
        // Fallback classic car outline if not found
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full transition-all"
            fill="none"
            stroke={isSelected ? activeColor : "#a1a1aa"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3C13 6.8 11.8 6 10.5 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h1" />
            <circle cx="7.5" cy="16.5" r="2.5" />
            <circle cx="16.5" cy="16.5" r="2.5" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative select-none flex items-center justify-center transition-all ${sizeClasses[size]} ${className}`}
      style={{
        filter: isSelected ? `drop-shadow(0 0 6px ${activeColor}30)` : undefined
      }}
    >
      {renderLogo()}
    </div>
  );
}
