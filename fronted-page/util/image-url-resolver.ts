import { Config } from "@/shared/config";

export class ImageUrlResolver {
    static resolve(filename?: string | null): string {
        if (!filename) filename = '/default/raffle-image.png'
        return `${Config.serverURL}/${filename}`;
    }
}