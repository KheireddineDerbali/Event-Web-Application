"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { Calendar, LogOut, LayoutDashboard, Sparkles } from "lucide-react";

export function Navbar() {
  const { isAuthenticated, logout, checkAuth } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      checkAuth();
    }
  }, [mounted, pathname, checkAuth]);

  if (!mounted) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 max-w-7xl mx-auto">
      <nav className="glass border rounded-2xl px-4 h-16 flex items-center justify-between shadow-lg">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
             <Calendar className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight leading-none text-foreground">
              EVENT<span className="text-primary">PRO</span>
            </span>
            <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase opacity-80">
              Platform
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link 
                href="/events" 
                className={buttonVariants({ 
                  variant: "ghost", 
                  className: "hidden md:flex gap-2 font-semibold text-sm rounded-xl px-4" 
                })}
              >
                <LayoutDashboard className="w-4 h-4" />
                Tableau de bord
              </Link>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={logout} 
                className="rounded-xl flex gap-2 font-bold shadow-lg shadow-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Quitter</span>
              </Button>
            </>
          ) : (
             <Link 
               href="/" 
               className={buttonVariants({ 
                 className: "rounded-xl bg-primary text-primary-foreground flex gap-2 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all" 
               })}
             >
                <Sparkles className="w-4 h-4" />
                Commencer
             </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
