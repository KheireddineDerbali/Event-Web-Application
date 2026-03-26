"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Users, Mail, User, Sparkles, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface Client {
  name: string;
  email: string;
}

interface ViewClientsDialogProps {
  eventId: string;
  renderTrigger?: React.ReactElement;
}

export function ViewClientsDialog({ eventId, renderTrigger }: ViewClientsDialogProps) {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/events/${eventId}/clients`);
      setClients(res.data);
    } catch (error) {
      toast.error("Impossible de récupérer la liste des participants.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      fetchClients();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={renderTrigger || (
        <Button variant="outline" className="rounded-xl font-bold border-muted-foreground/20 flex gap-2">
          <Users className="w-4 h-4" />
          Participants
        </Button>
      )} />
      <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-2xl bg-card p-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/10 to-transparent -z-10" />
        
        <div className="p-8 lg:p-10 space-y-8">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-3xl font-black tracking-tight">Liste des participants</DialogTitle>
            <DialogDescription className="text-base font-medium text-muted-foreground mt-2">
               Consultez les inscrits pour cet événement en temps réel.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                 <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                 <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Chargement de la liste...</span>
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-12 px-6 rounded-3xl bg-muted/30 border-2 border-dashed border-border/50">
                <p className="text-sm font-bold text-muted-foreground">
                  Aucun participant inscrit pour le moment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {clients.map((client, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/20 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black truncate text-foreground">{client.name}</p>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                         <Mail className="w-3 h-3 text-primary/40" />
                         {client.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button onClick={() => setOpen(false)} variant="outline" className="w-full h-12 rounded-2xl font-bold border-muted-foreground/20 hover:bg-muted transition-all">
             Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
