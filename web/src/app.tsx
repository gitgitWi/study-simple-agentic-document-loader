import { Documents } from './features/documents';

export function App() {
  return (
    <main class="flex flex-col justify-start items-center p-4">
      <h1 class="font-bold text-3xl">Documents Loader</h1>

      <Documents.Root>
        <Documents.Upload />
        <Documents.Table />
      </Documents.Root>
    </main>
  );
}
