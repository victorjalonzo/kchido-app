interface Options {
    validIncludes: string[],
    validFilters: string[]
}

export class QueryRequestExtractor {
    static extract = (
    query: Record<string, any>,
    options: Options
) => {
        const {validIncludes, validFilters } = options
        
        const filterQueries = {}
        const includeQueries = {}

        validFilters.forEach(filter => 
            query[filter] ? filterQueries[filter] = query[filter] : null
        )

        if (query.include){
            query.include.forEach(key => {
                validIncludes.includes(key) ? includeQueries[key] = true: null
            })
        }

        return { filterQueries, includeQueries, }
    }
}