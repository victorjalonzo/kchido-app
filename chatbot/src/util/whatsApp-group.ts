
import { WASocket } from '@builderbot/provider-baileys/dist/baileyWrapper';
import * as fs from 'fs';
import * as path from 'path'
import { Config } from '../shared/config.js';

const PAGE_URL = Config.pageURL

export class WhatsAppGroupSock {
    constructor(private readonly sock: WASocket) {}

    async create(participants: string[]){
        const subject = `KChido Sorteos 🏆`; 
        const waGroup = await this._create(subject, participants)
        
        await this.setProfilePicture(waGroup.id)
        
        const message = `*Bienvenido!*`
        + `\n\nPor medio de este grupo recibiras los resultados y actualizaciones de nuestros sorteos`
        + `\n\nRecuerda visitar nuestro sitio web: \n${PAGE_URL}`
        + `\n\nBuena suerte! ☺️`
        
        await this.sendMessage(waGroup.id, message)
        
        return waGroup
    }

    async sendMessage(groupJid: string, message: string){
        return await this.sock.sendMessage(groupJid, { text: message })
    }
    
    async get(groupJid: string) {
        const waGroup = await this.sock.groupMetadata(groupJid)
        return waGroup
    }

    async setProfilePicture(groupJid: string) {
        try {
          const imagePath = path.join(process.cwd(), 'assets', 'logo.png')
          const imageBuffer = fs.readFileSync(imagePath);

          return await this._setProfilePicture(groupJid, imageBuffer)
      
        } catch (error) {
          console.error('Something went wrong while trying to update WhatsApp Group image profile:', error)
        }
    }

    async addParticipants(groupJid: string, participantJids: string[]) {
        return await this.sock.groupParticipantsUpdate(groupJid, participantJids, 'add')
    }

    async isParticipant(groupJid: string, participantJid: string){
        const waGroup = await this.sock.groupMetadata(groupJid)
        const isParticipant = waGroup.participants.some(p => p.id === participantJid);

        return isParticipant;
    }

    async getInviteLink(groupJid: string) {
        const inviteCode = await this.sock.groupInviteCode(groupJid);
        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;
        
        return inviteLink;
    }

    async _create(subject: string, participants: string[]){
        const waGroup = await this.sock.groupCreate(subject, participants)
        await this.sock.groupSettingUpdate(waGroup.id, 'locked');
        await this.sock.groupSettingUpdate(waGroup.id, 'announcement');
        
        return waGroup;
    }

    async _setProfilePicture(groupJid: string, image: Buffer){
        return await this.sock.updateProfilePicture(groupJid, image);
    }
}