"use client";

import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  ListTodo,
} from "lucide-react";
import { ZenosLogo } from "@/components/icons";
import { cn } from "@/lib/utils";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar
        className="border-r border-sidebar-border"
        collapsible="icon"
        variant="sidebar"
      >
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <ZenosLogo className="size-8 text-volt" />
            <span
              className={cn(
                "font-bold text-xl font-headline transition-opacity duration-200",
                "group-data-[collapsible=icon]:opacity-0"
              )}
            >
              Zenos
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="#"
                isActive
                tooltip={{ children: "Dashboard" }}
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip={{ children: "Projetos" }}>
                <FolderKanban />
                <span>Projetos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip={{ children: "Minhas Tarefas" }}>
                <ListTodo />
                <span>Minhas Tarefas</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip={{ children: "Configurações" }}>
                <Settings />
                <span>Configurações</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
