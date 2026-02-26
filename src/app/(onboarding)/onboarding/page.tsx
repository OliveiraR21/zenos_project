'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Sparkles } from 'lucide-react';

export default function Step1Identity() {
    const router = useRouter();
    const [companyName, setCompanyName] = useState('');

    return (
        <div className="w-full animate-fade-in">
            <h1 className="text-4xl font-bold font-headline mb-4">Dê um rosto à sua operação.</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                <Sparkles className="inline-block w-4 h-4 mr-2 text-volt" />
                Configuraremos seu ambiente exclusivo em <span className="font-bold text-black">{companyName.toLowerCase().replace(/\s/g, '') || 'suaempresa'}.zenos.tech</span>. Profissionalismo é a base da confiança B2B.
            </p>

            <div className="space-y-6 text-left">
                <div>
                    <Label htmlFor="companyName" className="text-lg">Nome da Empresa</Label>
                    <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Ex: Acme Inc." className="mt-2 text-base !ring-offset-0 focus-visible:!ring-2 focus-visible:!ring-black" />
                </div>

                <div>
                    <Label className="text-lg">Logo da Empresa</Label>
                    <div className="mt-2 flex justify-center items-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer">
                        <div className="text-center">
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Arraste e solte ou clique para enviar</p>
                        </div>
                    </div>
                </div>

                <div>
                    <Label className="text-lg">Cor Primária (Opcional)</Label>
                    <div className="mt-2 flex items-center gap-4">
                        <div className="relative">
                            <input type="color" defaultValue="#000000" className="w-12 h-12 p-0 border-none cursor-pointer appearance-none rounded-md" />
                        </div>
                        <p className="text-sm text-gray-600">O padrão é o Preto Zenos.</p>
                    </div>
                </div>
            </div>

            <Button onClick={() => router.push('/onboarding/project')} className="mt-12 w-full max-w-xs text-lg py-6 bg-black text-white hover:bg-gray-800">
                Avançar
            </Button>
        </div>
    );
}
