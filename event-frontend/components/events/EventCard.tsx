"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  MapPin, 
  Trash2, 
  UserPlus, 
  Users, 
  Clock, 
  ChevronRight,
  MoreVertical,
  Edit3
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import api from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { ViewClientsDialog } from "./ViewClientsDialog";
import { UpdateEventDialog } from "./UpdateEventDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type EventType = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
};

interface EventCardProps {
  event: EventType;
  onRefresh: () => void;
}

export function EventCard({ event, onRefresh }: EventCardProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRegister = async () => {
    try {
      setIsRegistering(true);
      await api.post(`/events/${event.id}/register`);
      toast.success("Inscription validée avec succès !");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur d'inscription.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/events/${event.id}`);
      toast.success("Événement supprimé.");
      onRefresh();
    } catch (error) {
      toast.error("Échec de la suppression.");
    } finally {
      setIsDeleting(false);
    }
  };

  const dateObject = new Date(event.date);

  return (
    <Card className="group overflow-hidden rounded-[2rem] border-border/50 bg-card hover-lift pro-shadow relative">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <CardHeader className="p-6 pb-0">
        <div className="flex justify-between items-start gap-2">
          <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
             <CalendarDays className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <UpdateEventDialog event={event} onUpdated={onRefresh} renderTrigger={
              <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5">
                <Edit3 className="w-4 h-4" />
              </Button>
            } />
            <AlertDialog>
              <AlertDialogTrigger render={
                <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5">
                  <Trash2 className="w-4 h-4" />
                </Button>
              } />
            <AlertDialogContent className="rounded-[2rem] p-8 border-none shadow-2xl bg-card">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-black">Supprimer cet événement ?</AlertDialogTitle>
                <AlertDialogDescription className="text-base font-medium text-muted-foreground mt-2">
                  Cette action est irréversible. Toutes les données liées à cet événement seront définitivement effacées de nos systèmes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-8 gap-4">
                <AlertDialogCancel className="rounded-xl h-12 font-bold px-8 border-muted-foreground/20 hover:bg-muted">Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="rounded-xl h-12 font-bold px-8 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-transform active:scale-95">
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors line-clamp-1">{event.title}</h3>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 w-fit px-2 py-0.5 rounded-lg">
             <Clock className="w-3.5 h-3.5" />
             {format(dateObject, "HH:mm", { locale: fr })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-4 space-y-4">
        <p className="text-sm font-medium text-muted-foreground line-clamp-2 leading-relaxed h-10">
          {event.description}
        </p>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3 text-sm font-bold text-foreground/80 group-hover:text-foreground transition-colors">
            <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center border border-border/50">
              <CalendarDays className="w-3.5 h-3.5" />
            </div>
            {format(dateObject, "PPP", { locale: fr })}
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-foreground/80 group-hover:text-foreground transition-colors">
            <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center border border-border/50">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            {event.location}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 grid grid-cols-2 gap-3 bg-muted/30 border-t border-border/40">
        <ViewClientsDialog eventId={event.id} renderTrigger={
          <Button variant="outline" className="rounded-xl font-bold h-11 border-muted-foreground/20 hover:bg-white dark:hover:bg-zinc-800 transition-all flex gap-2">
            <Users className="w-4 h-4" />
            <span className="sm:hidden lg:inline">Clients</span>
          </Button>
        } />
        <Button 
          onClick={handleRegister} 
          disabled={isRegistering}
          className="rounded-xl font-black h-11 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex gap-2"
        >
          <UserPlus className="w-4 h-4" />
          S'inscrire
        </Button>
      </CardFooter>
    </Card>
  );
}
