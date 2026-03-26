"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Calendar, MapPin, AlignLeft, Sparkles } from "lucide-react";

const eventSchema = z.object({
  title: z.string().min(2, { message: "Le titre doit faire au moins 2 caractères." }),
  description: z.string().min(10, { message: "La description doit faire au moins 10 caractères." }),
  date: z.string().min(1, { message: "La date est requise." }),
  location: z.string().min(2, { message: "Le lieu est requis." }),
});

type EventFormData = z.infer<typeof eventSchema>;

interface CreateEventDialogProps {
  onCreated: () => void;
}

export function CreateEventDialog({ onCreated }: CreateEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EventFormData>({
    // @ts-ignore
    resolver: zodResolver(eventSchema as any),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
    },
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      setIsLoading(true);
      await api.post("/events", data);
      toast.success("Événement créé avec succès !");
      setOpen(false);
      form.reset();
      onCreated();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la création.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="rounded-2xl h-14 px-8 bg-primary text-primary-foreground font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex gap-3">
          <Plus className="w-5 h-5" />
          Créer un événement
        </Button>
      }/>
      <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-none shadow-2xl bg-card p-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/10 to-transparent -z-10" />
        
        <div className="p-8 lg:p-10 space-y-8">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-3xl font-black tracking-tight">Nouvel Événement</DialogTitle>
            <DialogDescription className="text-base font-medium text-muted-foreground mt-2">
              Remplissez les détails pour officialiser votre prochain grand rassemblement.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs ml-1 flex gap-2 items-center">
                       <Sparkles className="w-3 h-3 text-primary" /> Titre
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Conférence Tech 2026" 
                        className="rounded-xl h-12 bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs ml-1 flex gap-2 items-center">
                        <Calendar className="w-3 h-3 text-primary" /> Date & Heure
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          className="rounded-xl h-12 bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs ml-1 flex gap-2 items-center">
                        <MapPin className="w-3 h-3 text-primary" /> Lieu
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Paris, France" 
                          className="rounded-xl h-12 bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs ml-1 flex gap-2 items-center">
                      <AlignLeft className="w-3 h-3 text-primary" /> Description
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Décrivez votre événement ici..." 
                        className="min-h-[120px] rounded-xl bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/20 resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Publier l'événement"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
