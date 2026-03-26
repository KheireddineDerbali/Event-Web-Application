"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { EventCard, EventType } from "@/components/events/EventCard";
import { CreateEventDialog } from "@/components/events/CreateEventDialog";
import { Loader2, Calendar, LayoutGrid, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des événements.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
      return;
    }
    fetchEvents();
  }, [fetchEvents, router]);

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-8">
      {/* Grid Background Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-widest border border-primary/20">
              <Calendar className="w-3 h-3" />
              Exploration
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Découvrez les <br />
              <span className="text-primary italic">Prochains Événements.</span>
            </h1>
            <p className="text-base font-medium text-muted-foreground leading-relaxed">
              Parcourez notre catalogue d'événements exclusifs et réservez votre place en un clic. 
              Gérez vos participations depuis votre espace personnel.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <CreateEventDialog onCreated={fetchEvents} />
          </div>
        </div>

        {/* Filters/Search Bar Mockup */}
        <div className="flex flex-col sm:flex-row gap-4 p-2 rounded-[2rem] bg-card border border-border/50 shadow-sm">
           <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Rechercher un événement, une ville..." 
                className="pl-12 h-12 rounded-[1.5rem] border-transparent bg-muted/50 focus-visible:ring-primary/20 shadow-none"
              />
           </div>
           <div className="flex gap-2">
              <div className="h-12 w-12 rounded-[1.5rem] bg-muted/50 flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-primary/10 hover:text-primary transition-all">
                 <LayoutGrid className="w-5 h-5" />
              </div>
           </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center min-h-[40vh] space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Calendar className="w-6 h-6 text-primary/50" />
              </div>
            </div>
            <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground animate-pulse">Initialisation...</span>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-32 rounded-[3rem] border-2 border-dashed border-border/50 bg-card/50 flex flex-col items-center space-y-6">
            <div className="w-20 h-20 rounded-[2rem] bg-muted/50 flex items-center justify-center text-muted-foreground/30">
               <Calendar className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-black text-foreground">Aucun événement trouvé.</p>
              <p className="text-sm font-medium text-muted-foreground">La liste est actuellement vide. Pourquoi ne pas commencer ?</p>
            </div>
            <CreateEventDialog onCreated={fetchEvents} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} onRefresh={fetchEvents} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
