"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Zap, ShieldCheck, Star } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (Cookies.get("token")) {
      router.push("/events");
    }
  }, [router]);

  const handleSuccess = () => {
    router.push("/events");
    router.refresh();
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden flex flex-col pt-24 pb-12">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center flex-1">

        {/* Left Side: Hero Text */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col space-y-8 text-center xl:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary w-fit mx-auto xl:mx-0 font-bold text-xs uppercase tracking-widest border border-primary/20">
            <Star className="w-3.5 h-3.5 fill-current" />
            Élu plateforme préférée des organisateurs
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-foreground">
            <span className="text-primary italic">Gestion d'événements.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto xl:mx-0 leading-relaxed">
            Créez des moments inoubliables. Notre plateforme intuitive vous permet d'organiser, de suivre et de réussir tous vos rassemblements avec élégance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 max-w-3xl mx-auto xl:mx-0 w-full">
            {[
              { icon: Zap, label: "Rapide", desc: "Configuration en 2 min" },
              { icon: Users, label: "Collaboratif", desc: "Gestion des participants" },
              { icon: ShieldCheck, label: "Sécurisé", desc: "Données protégées" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center xl:items-start space-y-2 p-4 rounded-3xl bg-card border border-border/50 shadow-sm transition-all hover:border-primary/30 group">
                <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="font-bold text-sm tracking-tight">{item.label}</div>
                <div className="text-xs text-muted-foreground font-medium">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="lg:col-span-12 xl:col-span-5 flex justify-center xl:justify-end">
          <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[2.5rem] p-8 lg:p-12 pro-shadow relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-[2.5rem] -z-10 group-hover:opacity-60 transition-opacity" />
            <AuthForm onSuccess={handleSuccess} />
          </div>
        </div>

      </div>

      <footer className="container max-w-7xl mx-auto px-4 lg:px-8 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 py-8 border-t border-border/50 text-xs font-bold uppercase tracking-widest text-muted-foreground select-none">
        <div>© 2026 EVENTPRO PLATFORME</div>
        <div className="flex gap-6">
          <span className="hover:text-primary cursor-pointer transition-colors">Support</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Confidentialité</span>
        </div>
      </footer>
    </div>
  );
}
