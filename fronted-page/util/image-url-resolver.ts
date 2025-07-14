import { Config } from "@/shared/config";

export class ImageUrlResolver {
    static resolve(filename: string): string {
        return filename;
        if (!filename) filename = '/default/raffle-image.png'
        return `${Config.serverURL}/${filename}`;
    }
}