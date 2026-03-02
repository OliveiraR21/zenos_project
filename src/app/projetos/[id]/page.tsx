import { ProjectDetailView } from '@/components/projetos/project-detail-view';

// This is now a Server Component that wraps the interactive client component.
export default function ProjetoDetalhePage({ params }: { params: { id: string } }) {
    // We get the timestamp on the server to pass to the client, avoiding
    // client-side clock skew issues for time-sensitive UI.
    return <ProjectDetailView projectId={params.id} now={Date.now()} />;
}
