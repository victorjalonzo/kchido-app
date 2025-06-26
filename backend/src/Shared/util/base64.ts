// src/Shared/util/base64.ts
import * as fs from 'fs';
import * as path from 'path';

export class Base64 {
  static decode(base64String: string, filename: string) {
    const matches = base64String.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) throw new Error('Formato base64 inválido');

    const ext  = matches[1].split('/')[1]; // png, jpeg…
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    // usa una ruta absoluta para evitar sorpresas con el cwd
    const uploadDir = path.resolve(process.cwd(), 'public');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, `${filename}.${ext}`);
    fs.writeFileSync(filePath, buffer);

    return `${filename}.${ext}`;
  }
}
