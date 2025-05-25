import { promises as fs } from 'fs';

export default async function deleteFile(path: string) {
  try {
    await fs.unlink(path);
    console.log(`Archivo eliminado: ${path}`);
  } catch (err) {
    console.error(`Error al eliminar ${path}:`, err);
  }
}