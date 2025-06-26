interface Options {
    validIncludes?: string[],
    validFilters?: string[]
}

function toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

export class QueryRequestExtractor {
    static extract = (
    query: Record<string, any>,
    options: Options = {}
) => {
        if (!query) throw Error('query was not provided')
            
        const validFilters = options.validFilters ?? []
        const validIncludes = options.validIncludes ?? []
        
        const filterQueries = {}
        const includeQueries = {}

        if (validFilters.length) {
            validFilters.forEach(filter => 
                query[filter] ? filterQueries[filter] = query[filter] : null
            )
        }

        if (validIncludes.length) {
            query.include?.forEach((key: string) => {
                if (key.includes('-')) key = toCamelCase(key)

                validIncludes?.includes(key) ? includeQueries[key] = true: null
            })
        }

        return { filterQueries, includeQueries }
    }
}