'use client';

import JSZip from 'jszip';

export interface ExportBatchFile {
  name: string;
  dataUrl: string;
}

export async function exportBatchAsZip(
  files: ExportBatchFile[],
  zipFilename: string = 'clearcut-batch-export.zip'
): Promise<void> {
  const zip = new JSZip();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    // Strip data:image/png;base64,
    const base64Data = file.dataUrl.split(',')[1];
    const safeName = file.name.replace(/\.[^/.]+$/, '') + '-cutout.png';
    zip.file(safeName, base64Data, { base64: true });
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = zipFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}
