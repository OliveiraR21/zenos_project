'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name,
        });
      }

      router.push('/onboarding');

    } catch (error: any) {
      let description = "Ocorreu um erro. Por favor, tente novamente.";
      if (error.code === 'auth/email-already-in-use') {
        description = "Este email já está em uso. Tente fazer login.";
      } else if (error.code === 'auth/weak-password') {
        description = "Sua senha é muito fraca. Ela deve ter pelo menos 6 caracteres.";
      }
      
      toast({
        variant: "destructive",
        title: "Erro no Cadastro",
        description: description,
      });
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center gap-2 mb-8">
        <Image src="/zenos_sem_fundo_escuro.png" alt="Zenos" width={48} height={48} />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Crie sua conta</CardTitle>
          <CardDescription>Comece a transformar seus projetos em lucro.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="underline font-medium text-primary">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
    