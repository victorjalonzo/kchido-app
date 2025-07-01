import * as path from 'path'

const ASSETS_PATH = 'assets'

export class Asset {
    static getBanner(){
        return path.join(process.cwd(), ASSETS_PATH, 'banner.png')
    }
}