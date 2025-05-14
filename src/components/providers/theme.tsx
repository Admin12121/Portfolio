import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import ClickSpark from "@/components/global/cursor-sparklin";
// import Navbar from "../Navbar/Navbar";
import { ReactLenis } from "lenis/react";
// import Footer from "../Navbar/footer";

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <ReactLenis root>
      <NextThemesProvider {...props}>
        {/* <Navbar /> */}
        <ClickSpark />
        {children}
        {/* <Footer /> */}
      </NextThemesProvider>
    </ReactLenis>
  );
};
