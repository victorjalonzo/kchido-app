export interface Repository <T>{
    get(filters: Record<string, any>): Promise<T | null>
}