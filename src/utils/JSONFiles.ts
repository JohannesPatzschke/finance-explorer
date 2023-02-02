export function downloadJSON(fileName: string, data: any) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = href;
  link.download = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(href);
}

export async function readJSONFile(file: File) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = ({ target }) => {
      resolve(JSON.parse(target?.result?.toString() ?? ''));
    };

    reader.readAsText(file);
  });
}
