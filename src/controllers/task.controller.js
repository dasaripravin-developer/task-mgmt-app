import { logger } from "../logger/logger.js";
import taskService from "../services/task.service.js";

export async function insertTask(request, response) {
     try {
          logger.info(`controller - task - addTask - `);
          await taskService.addTask(request.body);
          response.status(200).json({ message: "Task inserted" });
     } catch (error) {
          logger.error(`controller - user - register - Exception - ${error}`);
          response.status(500).json({ message: error.message });
     }
}

export async function getTaskById(request, response) {
     try {
          logger.info(`controller - task - getTaskById - `);
          const task = await taskService.getTaskById(request.params.id);
          response.status(200).send(task);
     } catch (error) {
          logger.error(`controller - user - getTaskById - Exception - ${error}`);
          response.status(500).json({ message: error.message });
     }
}

export async function updateTaskById(request, response) {
     try {
          logger.info(`controller - task - updateTaskById - `);
          const task = await taskService.updateTaskById(request.params.id, request.body);
          response.status(200).send(task);
          logger.info(`controller - task - updateTaskById - task - ${request.params.id} updated`);
     } catch (error) {
          logger.error(`controller - user - updateTaskById - Exception - ${error}`);
          response.status(500).json({ message: error.message });
     }
}

export async function deleteTaskById(request, response) {
     try {
          logger.info(`controller - task - deleteTaskById - `);
          const task = await taskService.deleteTaskById(request.params.id);
          console.log('user id => ', task.userId)
          console.log('task id => ', task.id)
          response.status(200).send(task);
          logger.info(`controller - task - deleteTaskById - task - ${request.params.id} deleted`);
     } catch (error) {
          logger.error(`controller - user - deleteTaskById - Exception - ${error}`);
          response.status(500).json({ message: error.message });
     }
}
