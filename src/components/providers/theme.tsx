import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import ClickSpark from "@/components/global/cursor-sparklin";
import Navbar from "@/components/providers/navbar/index";
import ManagementBar from "../global/management-bar";
import Footer from "./footer/footer";

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return (
      <NextThemesProvider {...props}>
        <Navbar />
        <ClickSpark />
        {children}
        <Footer />
        <ManagementBar/>
      </NextThemesProvider>

  );
};
