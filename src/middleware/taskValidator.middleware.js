import { createTask, updateTask } from "../schema/task.schema.js";

export async function createTaskValidator(request, response, next) {
     const { error } = createTask.validate(request.body);
     if (error) return response.status(400).send(error.message);
     else next();
}

export async function updateTaskValidator(request, response, next) {
     const { error } = updateTask.validate(request.body);
     if (error) return response.status(400).send(error.message);
     else next();
}
