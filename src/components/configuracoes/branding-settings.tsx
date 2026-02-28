'use client';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '../ui/skeleton';
import { Upload } from 'lucide-react';
import Image from 'next/image';

export function BrandingSettings() {
     const firestore = useFirestore();
    const { user } = useUser();

    const userProfileRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);
    const { data: userProfile } = useDoc(userProfileRef);

    const organizationRef = useMemoFirebase(() => {
        if (!userProfile?.tenantId) return null;
        return doc(firestore, 'organizations', userProfile.tenantId);
    }, [firestore, userProfile]);
    const { data: organization, isLoading: isOrgLoading } = useDoc(organizationRef);
    
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
                        <Skeleton className="h-24 w-full" />
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
                    <Label>Logo da Empresa</Label>
                    <div className="mt-2 flex items-center gap-4">
                         <Image src={organization.brandingLogoUrl} alt="Logo" width={64} height={64} className="rounded-md object-contain bg-white p-1"/>
                         <div className="flex-1 flex justify-center items-center w-full h-24 border-2 border-dashed border-muted rounded-lg hover:border-primary transition-colors cursor-pointer">
                            <div className="text-center">
                                <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                                <p className="mt-1 text-xs text-muted-foreground">Arraste e solte ou clique para enviar um novo logo</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <Label>Cor Primária</Label>
                    <div className="mt-2 flex items-center gap-4">
                        <div className="relative">
                            <input type="color" defaultValue={organization.brandingPrimaryColor} className="w-12 h-12 p-0 border-none cursor-pointer appearance-none rounded-md bg-transparent" style={{backgroundColor: organization.brandingPrimaryColor}} />
                        </div>
                        <Input defaultValue={organization.brandingPrimaryColor} className="max-w-xs" />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button>Salvar Alterações de Marca</Button>
            </CardFooter>
        </Card>
    );
}
