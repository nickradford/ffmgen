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

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const iconClasses = cn("group-hover:rotate-15 transition-transform will-change-transform");
  const Icon = {
    light: SunIcon,
    dark: MoonStarsIcon,
    system: DevicesIcon,
    null: () => <></>,
  }[theme ?? "null"];

  const checkIcon = <CheckIcon className="ml-auto h-4 w-4 text-primary" weight="bold" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full group">
          <Icon className={iconClasses} />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
          {theme === "light" && checkIcon}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
          {theme === "dark" && checkIcon}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
          {theme === "system" && checkIcon}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
