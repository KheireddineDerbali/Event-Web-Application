"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().email({ message: "Email invalide." }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
  name: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AuthFormProps {
  onSuccess: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // @ts-ignore
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      if (mode === "register") {
        if (!data.name || data.name.trim() === "") {
          toast.error("Le nom est requis pour l'inscription.");
          return;
        }
        const res = await api.post("/auth/register", {
          email: data.email,
          password: data.password,
          name: data.name,
        });
        login(res.data.accessToken);
        toast.success("Bienvenue ! Votre compte a été créé.");
      } else {
        const res = await api.post("/auth/login", {
          email: data.email,
          password: data.password,
        });
        login(res.data.accessToken);
        toast.success("Heureux de vous revoir !");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    form.reset();
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2 text-center lg:text-left">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          {mode === "login" ? "Connectez-vous" : "Créez votre compte"}
        </h2>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
          {mode === "login"
            ? "Accédez à tous vos événements préférés en quelques secondes."
            : "Rejoignez notre communauté et commencez à organiser dès aujourd'hui."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {mode === "register" && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-xs ml-1">Nom complet</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <Input 
                        placeholder="Jean Dupont" 
                        className="pl-10 h-12 rounded-xl bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary shadow-sm" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-xs ml-1">Adresse Email</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input 
                      type="email" 
                      placeholder="email@exemple.com" 
                      className="pl-10 h-12 rounded-xl bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary shadow-sm" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-xs ml-1">Mot de passe</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 h-12 rounded-xl bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary shadow-sm" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4 pt-2">
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Se connecter" : "S'inscrire"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
            
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm font-semibold text-primary hover:underline underline-offset-4 text-center"
            >
              {mode === "login" ? "Vous n'avez pas de compte ? S'inscrire" : "Déjà inscrit ? Connectez-vous"}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
