import { MainLayout } from "@/components/layout/main-layout";
import { UserNav } from "@/components/layout/user-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const plans = [
    {
        name: "Zenos Solo",
        audience: "Autónomos e Pequenos Negócios",
        price: "€X",
        pricePeriod: "/ mês",
        description: "Foco em organização pessoal e entregas pontuais.",
        features: [
            "Até 3 projetos ativos",
            "Marca Zenos visível",
            "Dashboard de Executor",
            "Niko Coach de Performance",
        ],
        cta: "Começar Agora",
        isFeatured: false,
    },
    {
        name: "Zenos Business",
        audience: "PMEs em crescimento",
        price: "€Y",
        pricePeriod: "/ mês",
        description: "A ferramenta de crescimento para equipes que buscam resultados.",
        features: [
            "Projetos ilimitados",
            "Customização de Logo/Cores",
            "Sponsor Dashboard",
            "Alertas de ROI do Niko",
            "Timeline de Decisões e Histórico",
        ],
        cta: "Escolher Business",
        isFeatured: true,
    },
    {
        name: "Zenos Partner",
        audience: "Consultorias e Agências",
        price: "Variável",
        pricePeriod: "+ €Z / mês",
        description: "Gerencie os projetos dos seus clientes em uma plataforma white-label.",
        features: [
            "Tudo do plano Business",
            "Domínio próprio (white-label)",
            "Multi-tenancy para clientes",
            "API de integração",
        ],
        cta: "Fale Conosco",
        isFeatured: false,
    },
    {
        name: "Zenos Enterprise",
        audience: "Grandes Corporações",
        price: "Custom",
        pricePeriod: "Sob Consulta",
        description: "Segurança, escala e suporte para as operações mais críticas.",
        features: [
            "Tudo do plano Partner",
            "SSO (Single Sign-On)",
            "Logs de Auditoria Avançados",
            "Infraestrutura dedicada",
            "Suporte Premium 24/7",
        ],
        cta: "Agendar Demo",
        isFeatured: false,
    },
];

export default function PrecosPage() {
    return (
        <MainLayout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight font-headline">
                        Planos e Preços
                    </h1>
                    <div className="flex items-center space-x-2">
                        <UserNav />
                    </div>
                </div>
                <div className="text-center max-w-2xl mx-auto">
                    <p className="text-lg text-muted-foreground mt-4">
                        Preço baseado em valor, não em features. Escolha o plano que acompanha a escala do seu impacto.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
                    {plans.map((plan) => (
                        <Card key={plan.name} className={cn("flex flex-col", plan.isFeatured && "border-volt border-2 shadow-volt/20 shadow-lg")}>
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                                <CardDescription>{plan.audience}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-6">
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground ml-2">{plan.pricePeriod}</span>
                                </div>
                                <p className="text-sm min-h-[40px]">{plan.description}</p>
                                <ul className="space-y-3 text-sm">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <Check className="w-4 h-4 mr-2 mt-1 shrink-0 text-volt" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className={cn("w-full", plan.isFeatured ? "bg-volt text-black hover:bg-volt/90" : "bg-primary")}>
                                    {plan.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
