'use client';
import { useState, useEffect } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export function BrandingSettings() {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();

    // Fetch user profile to get tenantId
    const userProfileRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);
    const { data: userProfile } = useDoc(userProfileRef);

    // Fetch organization details using tenantId
    const organizationRef = useMemoFirebase(() => {
        if (!userProfile?.tenantId) return null;
        return doc(firestore, 'organizations', userProfile.tenantId);
    }, [firestore, userProfile]);
    const { data: organization, isLoading: isOrgLoading } = useDoc(organizationRef);

    // State for form fields
    const [logoUrl, setLogoUrl] = useState('');
    const [primaryColor, setPrimaryColor] = useState('');

    // Populate form fields when organization data loads
    useEffect(() => {
        if (organization) {
            setLogoUrl(organization.brandingLogoUrl || '');
            setPrimaryColor(organization.brandingPrimaryColor || '#2A89D4');
        }
    }, [organization]);

    const handleSaveChanges = () => {
        if (!organizationRef) return;

        updateDocumentNonBlocking(organizationRef, {
            brandingLogoUrl: logoUrl,
            brandingPrimaryColor: primaryColor,
        });

        toast({
            title: "Marca atualizada!",
            description: "Suas alterações foram salvas. Pode ser necessário recarregar a página para ver todas as mudanças de cor.",
        });
    };
    
    if (isOrgLoading || !organization) {
         return (
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
                <CardFooter>
                     <Skeleton className="h-10 w-24" />
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Marca da Empresa</CardTitle>
                <CardDescription>Personalize a aparência da Zenos com a identidade visual da sua marca.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label htmlFor="logoUrl">URL do Logo</Label>
                    <div className="mt-2 flex items-center gap-4">
                         <Image src={logoUrl || `https://placehold.co/64x64/161a1d/ffffff?text=${organization.name.charAt(0)}`} alt="Logo" width={64} height={64} className="rounded-md object-contain bg-white p-1"/>
                         <Input id="logoUrl" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://suaempresa.com/logo.png" />
                    </div>
                </div>

                <div>
                    <Label htmlFor="primaryColor">Cor Primária (Hex)</Label>
                    <div className="mt-2 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: primaryColor }} />
                        <Input id="primaryColor" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="max-w-xs" />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSaveChanges}>Salvar Alterações de Marca</Button>
            </CardFooter>
        </Card>
    );
}
