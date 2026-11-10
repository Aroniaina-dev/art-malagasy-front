import { DM_Sans, Playfair_Display } from "next/font/google";

const dmSans = DM_Sans({ variable: "--font-dm", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["600", "700", "800"] });

/** Classes à poser sur <html> (il y a deux gabarits racine : le site par langue et l'admin). */
export const fontClasses = `${dmSans.variable} ${playfair.variable} h-full antialiased`;
