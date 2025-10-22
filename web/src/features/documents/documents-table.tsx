import { documentsStore } from './use-documents';

export function DocumentsTable() {
  const { documents } = documentsStore.getState();

  return (
    <div class="flex flex-col gap-2 w-full">
      <h2 class="font-bold text-2xl">Files</h2>

      <table class="w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr>
              <td>{document.name}</td>
              <td>{document.sizeDisplay}</td>
              <td>{document.type}</td>
              <td>
                <button type="button">Show Markdown</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
