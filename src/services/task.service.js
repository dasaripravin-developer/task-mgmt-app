import { logger } from "../logger/logger.js";
import { TaskSchema } from "../models/task.model.js";
import { hget, hset, hdel } from "./redis.service.js";

async function addTask(taskData) {
     return new Promise(async (resolve, reject) => {
          try {
               logger.info(`services - task - addTask - ${JSON.stringify(taskData)}`);
               taskData.userId = 1;
               const task = new TaskSchema(taskData); // need to check task id
               logger.info(`services - task - addTask - task added - ${JSON.stringify(task)}`);
               await hset(`user:${task.userId}`, `task:${task.id}`, task);
               await task.save();
               resolve();
          } catch (err) {
               logger.error(`services - task - addTask - Exception - ${err}`);
               reject(err);
          }
     });
}

async function getTaskById(id) {
     return new Promise(async (resolve, reject) => {
          try {
               logger.info(`services - task - getTaskById - id - ${id}`);
               const task = TaskSchema.findOne({ id });
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
               const task = TaskSchema.findOneAndUpdate({ id }, { data }, { new: true }).exec();
               //    const task = TaskSchema..({ id }, { data }).exec();
               console.log("updated taskuser id => ", task.userId);
               console.log("updated id => ", task.id);
               //    await hset(`user:${task.userId}`, `task:${task.id}`, task);
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
               const task = TaskSchema.findOneAndDelete({ id });
               await hdel(`user:${task.userId}`, `task:${task.id}`);
               logger.info(`services - task - deleteTaskById - id - ${id} - task deleted`);
               resolve(task);
          } catch (err) {
               logger.error(`services - task - deleteTaskById - Exception - ${err}`);
               reject(err);
          }
     });
}

/* 

// Get all tasks with pagination
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
});

*/

export default { addTask, getTaskById, updateTaskById, deleteTaskById };
