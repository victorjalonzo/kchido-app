import * as fs from 'fs';
import * as pathModule from 'path';

export class FolderCreator {
  static create = (path: string): void => {
    const fullPath = pathModule.resolve(path);

    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  };
}
