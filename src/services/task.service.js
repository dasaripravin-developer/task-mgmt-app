import Joi from "joi";
import { logger } from "../logger/logger.js";
import { TaskSchema } from "../models/task.model.js";
import { get, set, del, getKeys, mget } from "./redis.service.js";

async function addTask(taskData) {
   return new Promise(async (resolve, reject) => {
      try {
         logger.info(`services - task - addTask - ${JSON.stringify(taskData)}`);
         const task = new TaskSchema(taskData); // need to check task id
         logger.info(`services - task - addTask - task added - ${JSON.stringify(task)}`);
         const insertedTask = await task.save();
         await set(`user:${insertedTask.userId}`, `task:${insertedTask.taskId}`, task);
         resolve();
      } catch (err) {
         logger.error(`services - task - addTask - Exception - ${err}`);
         reject(err);
      }
   });
}

async function getTaskById(id, userData) {
   return new Promise(async (resolve, reject) => {
      try {
         logger.info(`services - task - getTaskById - id - ${id}`);
         let task;
         task = await get(`user:${userData.userId}`, `task:${id}`);
         if (!task) {
            task = TaskSchema.findOne({ taskId: id }).exec();
            await set(`user:${userData.userId}`, `task:${id}`, task);
         }
         resolve(task);
      } catch (err) {
         logger.error(`services - task - addTask - Exception - ${err}`);
         reject(err);
      }
   });
}

async function updateTaskById(id, data) {
   return new Promise(async (resolve, reject) => {
      try {
         logger.info(`services - task - updateTaskById - id - ${id}`);
         const task = await TaskSchema.findOneAndUpdate({ taskId: id }, { $set: data }, { new: true }).exec();
         if (!task) return resolve();
         await set(`user:${task.userId}`, `task:${task.taskId}`, task);
         logger.info(`services - task - updateTaskById - id - ${id} task updated`);
         resolve(task);
      } catch (err) {
         logger.error(`services - task - updateTaskById - Exception - ${err}`);
         reject(err);
      }
   });
}

async function deleteTaskById(id) {
   return new Promise(async (resolve, reject) => {
      try {
         logger.info(`services - task - deleteTaskById - id - ${id}`);
         const task = await TaskSchema.findOneAndDelete({ taskId: id }).exec();
         console.log("deleted task => ", task);
         if (!task) return resolve();
         await del(`user:${task.userId}`, `task:${task.taskId}`);
         logger.info(`services - task - deleteTaskById - id - ${id} - task deleted`);
         resolve(task);
      } catch (err) {
         logger.error(`services - task - deleteTaskById - Exception - ${err}`);
         reject(err);
      }
   });
}

async function getTask(userData, query) {
   return new Promise(async (resolve, reject) => {
      try {
         logger.info(`services - task - getTask - ${JSON.stringify(userData)}`);
         //     let tasks = await getAllFieldByKey(`user:${userData.userId}`);
         let keys = await getKeys(`user:${userData.userId}:*`);
         let tasks = await mget(keys);
         if (tasks) {
            logger.info(`services - task - getTask - got task from redis - ${JSON.stringify(tasks)}`);
            //   const taskArray = Object.values(tasks).map((task) => JSON.parse(task));
            //   tasks = await tasks.map((val) => JSON.parse(val));
            resolve(tasks.slice((query.page - 1) * query.limit, query.page * query.limit));
         } else {
            logger.info(`services - task - getTask - task not found in redis`);
            const taskArray = await TaskSchema.find()
               .skip((query.page - 1) * query.limit)
               .limit(query.limit)
               .exec();
            if (taskArray) {
               logger.info(`services - task - getTask - tasks found in db`);
               taskArray.forEach((task) => {
                  hset(`user:${task.userId}`, `task:${task.taskId}`, JSON.stringify(task));
               });
               resolve(taskArray);
            } else {
               logger.info(`services - task - getTask - tasks not found in db`);
               resolve();
            }
         }
      } catch (err) {
         logger.error(`services - task - getTask - Exception - ${err}`);
         reject(err);
      }
   });
}

/* // Get all tasks with pagination
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  // Get tasks from Redis cache
  redisClient.hgetall('tasks', (err, tasks) => {
    if (err) {
      console.error('Redis HGETALL error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (tasks) {
      // Convert tasks to an array and paginate
      const taskArray = Object.values(tasks).map(task => JSON.parse(task));
      const paginatedTasks = taskArray.slice((page - 1) * limit, page * limit);

      return res.json(paginatedTasks);
    } else {
      // Fetch tasks from MongoDB if not found in Redis
      Task.find()
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .exec((err, tasks) => {
          if (err) {
            return res.status(500).json({ message: 'Internal server error' });
          }
          
          // Cache tasks in Redis
          tasks.forEach(task => {
            redisClient.hset('tasks', task._id.toString(), JSON.stringify(task), (err, reply) => {
              if (err) {
                console.error('Redis HSET error:', err);
              } else {
                console.log('Cached task in Redis:', reply);
              }
            });
          });

          res.json(tasks);
        });
    }
  });
}); */

export default { addTask, getTaskById, updateTaskById, deleteTaskById, getTask };
