import { Documents } from './features/documents';

export function App() {
  return (
    <main class="flex flex-col justify-start items-center p-4">
      <h1 class="mb-4 font-bold text-3xl">Documents Loader</h1>

      <Documents.Root classNames="max-w-2xl ">
        <Documents.Upload />
        <Documents.Table />
      </Documents.Root>
    </main>
  );
}
