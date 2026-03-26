"use client";

import { useState, useEffect } from "react";
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
import { Edit3, Loader2, Calendar, MapPin, AlignLeft, Sparkles } from "lucide-react";

const eventSchema = z.object({
  title: z.string().min(2, { message: "Le titre doit faire au moins 2 caractères." }),
  description: z.string().min(10, { message: "La description doit faire au moins 10 caractères." }),
  date: z.string().min(1, { message: "La date est requise." }),
  location: z.string().min(2, { message: "Le lieu est requis." }),
});

type EventFormData = z.infer<typeof eventSchema>;

interface UpdateEventDialogProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
  };
  onUpdated: () => void;
  renderTrigger?: React.ReactElement;
}

export function UpdateEventDialog({ event, onUpdated, renderTrigger }: UpdateEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
  const formatForInput = (dateStr: string) => {
    const d = new Date(dateStr);
    const z = (n: number) => (n < 10 ? '0' : '') + n;
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}`;
  };

  const form = useForm<EventFormData>({
    // @ts-ignore
    resolver: zodResolver(eventSchema as any),
    defaultValues: {
      title: event.title,
      description: event.description,
      date: formatForInput(event.date),
      location: event.location,
    },
  });

  // Reset form when event changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        title: event.title,
        description: event.description,
        date: formatForInput(event.date),
        location: event.location,
      });
    }
  }, [open, event, form]);

  const onSubmit = async (data: EventFormData) => {
    try {
      setIsLoading(true);
      await api.patch(`/events/${event.id}`, data);
      toast.success("Événement mis à jour !");
      setOpen(false);
      onUpdated();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={renderTrigger || (
        <Button variant="outline" size="sm" className="rounded-xl flex gap-2 font-bold">
          <Edit3 className="w-4 h-4" />
          Modifier
        </Button>
      )}/>
      <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-none shadow-2xl bg-card p-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/10 to-transparent -z-10" />
        
        <div className="p-8 lg:p-10 space-y-8">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Edit3 className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-3xl font-black tracking-tight">Modifier l'événement</DialogTitle>
            <DialogDescription className="text-base font-medium text-muted-foreground mt-2">
              Ajustez les détails de votre événement. Les modifications seront visibles immédiatement.
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
                    "Enregistrer les modifications"
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
