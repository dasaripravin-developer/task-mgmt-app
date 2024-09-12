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
      const task = await taskService.getTaskById(request.params.id, request.userData);
      if(task)
         response.status(200).send(task);
      else
         response.status(200).send({message: "task not found"});
   } catch (error) {
      logger.error(`controller - user - getTaskById - Exception - ${error}`);
      response.status(500).json({ message: error.message });
   }
}

export async function updateTaskById(request, response) {
   try {
      logger.info(`controller - task - updateTaskById - `);
      const task = await taskService.updateTaskById(request.params.id, request.body);
      if (task) {
         response.status(200).send(task);
         logger.info(`controller - task - updateTaskById - task - ${request.params.id} updated`);
      } else {
         logger.info(`controller - task - updateTaskById - task - task not present - ${request.params.id}`);
         response.status(200).json({ message: "task not found" });
      }
   } catch (error) {
      logger.error(`controller - user - updateTaskById - Exception - ${error}`);
      response.status(500).json({ message: error.message });
   }
}

export async function deleteTaskById(request, response) {
   try {
      logger.info(`controller - task - deleteTaskById - `);
      const task = await taskService.deleteTaskById(request.params.id);
      if (task) {
         logger.info(`controller - task - deleteTaskById - task - ${request.params.id} deleted`);
         response.status(200).send(task);
      } else response.status(400).json({ message: `task not present for task id ${request.params.id}` });
   } catch (error) {
      logger.error(`controller - user - deleteTaskById - Exception - ${error}`);
      response.status(500).json({ message: error.message });
   }
}

export async function getTask(request, response) {
   try {
      logger.info(`controller - user - getTask - `);
      let query = {
         page: request.query.page ? parseInt(request.query.page) : 1,
         limit: request.query.limit ? parseInt(request.query.limit) : 2,
      };
      let taskArr = await taskService.getTask(request.userData, query);
      if (taskArr) {
         logger.info(`controller - user - getTask - tasks found `);
         response.json(taskArr);
      } else {
         logger.info(`controller - user - getTask - tasks not found`);
         response.json({ message: "Tasks not found" });
      }
   } catch (err) {
      logger.error(`controller - user - getTask - Exception - ${err}`);
      response.status(500).json({ message: err.message });
   }
}
