export class Base64 {
  static decode(base64String: string) {
    const matches = base64String.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) throw new Error('Inválid format base64');

    const ext  = matches[1].split('/')[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    return { buffer, ext }
  }
}