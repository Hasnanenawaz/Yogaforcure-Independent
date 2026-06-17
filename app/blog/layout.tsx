import type { ReactNode } from "react";
import { Merriweather, Source_Sans_3 } from "next/font/google";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-merriweather",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-source-sans",
  display: "swap",
});

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${merriweather.variable} ${sourceSans.variable}`}>
      {children}
    </div>
  );
}
