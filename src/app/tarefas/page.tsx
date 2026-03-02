import { MyTasksView } from "@/components/tasks/my-tasks-view";

// This is now a Server Component that wraps the interactive client component.
export default function TarefasPage() {
    // We get the timestamp on the server to pass to the client, avoiding
    // client-side clock skew issues for time-sensitive UI.
    return <MyTasksView now={Date.now()} />;
}
