import * as fs from 'fs';
import * as path from 'path';
import { Base64 } from './base64';

export class ImageUploader {
  static save = (base64String: string, filePath: string): string => {
    const { buffer, ext } = Base64.decode(base64String);

    let finalFilePath = filePath;
    if (path.extname(filePath) !== `.${ext}`) {
      finalFilePath = `${filePath}.${ext}`;
    }

    const pathDir = path.dirname(finalFilePath);
    if (!fs.existsSync(pathDir)) fs.mkdirSync(pathDir, { recursive: true });

    fs.writeFileSync(finalFilePath, buffer);

    return finalFilePath;
  };
}