import * as JsBarcode from 'jsbarcode'
import { createCanvas } from 'canvas'
import * as fs from 'fs'
import { join } from 'path'

export class BarCodeGenerator {
  static generate = async (text: string, outputPath?: string) => {
    if (!outputPath) outputPath = join(process.cwd(), 'barcode.png')

    // @ts-ignore
    const canvas = createCanvas()
    
    JsBarcode(canvas, text, {
      format: "CODE128",
      lineColor: "#00b7dd",
      width: 20,
      height: 100,
      displayValue: false,
    })

    const buffer = canvas.toBuffer("image/png")
    fs.writeFileSync(outputPath, buffer)

    return outputPath
  }
}