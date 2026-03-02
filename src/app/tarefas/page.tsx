import { MyTasksView } from "@/components/tasks/my-tasks-view";

// This is now a Server Component that wraps the interactive client component.
export default function TarefasPage() {
    return <MyTasksView />;
}
