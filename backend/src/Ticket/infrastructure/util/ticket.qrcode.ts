import { createCanvas, loadImage } from "canvas";
import * as fs from 'fs';
import * as path from "path";
import { FolderCreator } from "src/Shared/util/folder-creator";
import { QRGenerator } from "./qr-generator";
import { BarCodeGenerator } from "./barcode-generator";
import { Ticket } from "../../domain/ticket.entity";
import { DateFormater } from "./formate-date";

export class TicketQRCode {
    static generate = async (ticket: Ticket) => {
      const QRPath = path.join(process.cwd(), 'uploads', 'raffles', ticket.raffleId, 'qrcodes')
      FolderCreator.create(QRPath)
  
      const ticketPath = path.join(QRPath, `${ticket.serial}.png`)
  
      const orderShortId = ticket.order.shortId
      const raffleShortId = ticket.raffle.shortId
      const ticketShortId = ticket.shortId
      const endedAt = DateFormater.format(ticket.raffle.endsAt)
      const price = `$${ticket.price.toFixed(2)}`
      const numbers = `${ticket.serial.match(/.{1,2}/g)?.join(" ")}`
      const printDate = new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).replace(',', '')
  
      // Logo
      const logoPath = path.join(process.cwd(), 'public', 'default', 'logo.png')
      const logo = await loadImage(logoPath)
  
      // Generar QR
      const qrCodePath = await QRGenerator.generate(ticket.serial)
      const qrCodeImage = await loadImage(qrCodePath)

      // Generar Barcode
      const barCodePath = await BarCodeGenerator.generate(orderShortId)
      const barCode = await loadImage(barCodePath)
  
      // Crear canvas
      const canvas = createCanvas(1024, 1536)
      const ctx = canvas.getContext('2d')
  
      // Fondo blanco
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
  
      // Logo centrado
      const logoW = 900, logoH = 800
      const logoCenterX = (canvas.width - logoW) / 2
      ctx.drawImage(logo, logoCenterX, -60, logoW, logoH)
  
      // Números del ticket
      ctx.fillStyle = '#000'
      ctx.font = 'bold 80px sans-serif'
      ctx.fillText(`N. ${numbers}`, 190, 770)
  
      // Línea verde debajo del serial
      ctx.strokeStyle = '#00aa00'
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.moveTo(80, 820)
      ctx.lineTo(canvas.width - 80, 820)
      ctx.stroke()
  
      // Código QR
      ctx.drawImage(qrCodeImage, 665, 910, 300, 300)

      // Bar Code
      ctx.drawImage(barCode, 100, 1250, 800, 200)

      // Fecha de sorteo y precio
      ctx.fillStyle = '#000'
      ctx.font = 'bold 50px sans-serif'
      ctx.fillText(`${endedAt}`, 80, 920)
      ctx.fillStyle = '#f4a300'
      ctx.fillText(`${price}`, 700, 920)
  
      // IDs
      ctx.fillStyle = '#000'
      ctx.font = '35px monospace'
      ctx.fillText(`${orderShortId}`, 80, 1010)
      ctx.fillText(`${raffleShortId}`, 80, 1085)
      ctx.fillText(`${ticketShortId}`, 80, 1165)

      // Fecha impreso
      ctx.fillStyle = '#000'
      ctx.font = 'bold 24px sans-serif'
      ctx.fillText(`EMISION: ${printDate}`.toUpperCase(), (canvas.width-500)/2, 1500, 600)
  
  
      // Guardar imagen
      const out = fs.createWriteStream(ticketPath)
      const stream = canvas.createPNGStream()
      stream.pipe(out)
  
      return ticketPath
    }
  }
  