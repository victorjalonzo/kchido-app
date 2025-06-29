import * as QRCode from 'qrcode'

export class QRGenerator {
    static generate = async (data: string): Promise<string> => {
      const qrCodeDataUri = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        rendererOpts: { quality: 0.3 }
      })

      return qrCodeDataUri
    }
}