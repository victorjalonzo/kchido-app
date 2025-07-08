import { sharedConfig } from "../shared.config"

describe('Config test', () => {
    it('should return values', () => {
        expect(sharedConfig.databaseURL).toBeDefined()
        expect(sharedConfig.apiURL).toBeDefined()
        expect(sharedConfig.chatbotServerURL).toBeDefined()
        expect(sharedConfig.jwtSecret).toBeDefined()
        expect(sharedConfig.jwtExpiresIn).toBeDefined()
    })
})