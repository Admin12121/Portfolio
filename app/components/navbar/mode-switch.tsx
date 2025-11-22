import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
export function ModeSwitcher({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <Button
      variant="secondary"
      className={cn("group/toggle h-8 w-8 px-0", className)}
      onClick={toggleTheme}
    >
      <Sun className="hidden [html.dark_&]:block h-4 w-4" />
      <Moon className="hidden [html.light_&]:block h-4 w-4" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ModeSwitcher;
