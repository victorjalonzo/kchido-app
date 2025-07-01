import { fetchAPI } from "./api.js";
import { SubTask, UpdateSubTaskPayload } from "./tasks.type.js";

const endpoint = `/subtasks`

export class SubTaskAPI {
    static getAll = async (query?: Record<string, any> | Record<string, boolean>) => {
        const tasks = <SubTask[]>await fetchAPI(endpoint, {}, query)
        return tasks;
    }

    static get = async (id: string, query?: Record<string, any> | Record<string, boolean>) => {
        const task = <SubTask>await fetchAPI(`${endpoint}/${id}`, {}, query)
        return task;
    }

    static update = async (payload: UpdateSubTaskPayload) => {
        const task = <SubTask>await fetchAPI(`${endpoint}`, {
             method: 'PUT',
             body: JSON.stringify(payload)
        })

        return task; 
    }
}