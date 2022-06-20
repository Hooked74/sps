export const convertBlobToParsedJson = (blob: Blob) =>
  new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => resolve(JSON.parse(reader.result as string));
    reader.onerror = (error) => reject(error);
    reader.readAsText(blob);
  });
