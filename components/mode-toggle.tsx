"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DevicesIcon, CheckIcon, MoonStarsIcon, SunIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const iconClasses = cn("group-hover:rotate-15 transition-transform will-change-transform");
  const iconMap = {
    light: SunIcon,
    dark: MoonStarsIcon,
    system: DevicesIcon,
  };
  const Icon = mounted ? iconMap[(theme as keyof typeof iconMap) ?? "system"] : DevicesIcon;

  const checkIcon = (
    <CheckIcon
      className="ml-auto h-4 w-4 text-primary group-hover:text-primary-foreground group-focus:text-primary-foreground transition-colors"
      weight="bold"
    />
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full group">
          <Icon className={iconClasses} />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className="group">
          Light
          {theme === "light" && checkIcon}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="group">
          Dark
          {theme === "dark" && checkIcon}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="group">
          System
          {theme === "system" && checkIcon}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
