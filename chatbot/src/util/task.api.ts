import { fetchAPI } from "./api.js"
import { Task } from "./tasks.type.js"

const endpoint = `/tasks`

export class TaskAPI {
    static getAll = async (query?: Record<string, any> | Record<string, boolean>) => {
        const tasks = <Task[]>await fetchAPI(endpoint, {}, query)
        return tasks;
    }

    static get = async (id: string, query?: Record<string, any> | Record<string, boolean>) => {
        const task = <Task>await fetchAPI(`${endpoint}/${id}`, {}, query)
        return task;
    }

    static update = async (payload: {}) => {
        const task = <Task>await fetchAPI(`${endpoint}`, {
             method: 'PUT',
             body: JSON.stringify(payload)
        })

        return task; 
    }
}