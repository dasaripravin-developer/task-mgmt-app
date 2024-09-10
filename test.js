import redis from 'redis'
const client = redis.createClient({
     host: "127.0.0.1",
     port: 6379,
});

// Handle Redis errors
client.on("error", (err) => {
     console.error("Redis error:", err);
});

client.on("connect", async(err) => {
    console.error("connected");
    await client.hSet('friend', 'sumit' , 'shrikhande')
});
await client.connect()

// Function to create or update an entry
 const createOrUpdate = async (hash, field, value) => {
    await client.set(hash, value ) 
    /* client.hSet(hash, field, value, (err, reply) => {
          if (err) {
               console.error("Error in hset:", err);
          } else {
               console.log("hset reply:", reply);
          }
     }); */
};

// Function to read an entry
const read = (hash, field) => {
     client.hGet(hash, field, (err, reply) => {
          if (err) {
               console.error("Error in hget:", err);
          } else {
               console.log("hget reply:", reply);
          }
     });
};

// Function to delete an entry
const deleteEntry = (hash, field) => {
     client.hDel(hash, field, (err, reply) => {
          if (err) {
               console.error("Error in hdel:", err);
          } else {
               console.log("hdel reply:", reply);
          }
     });
};

// Function to get all entries in a hash
const getAll = (hash) => {
     client.hGetAll(hash, (err, reply) => {
          if (err) {
               console.error("Error in hgetall:", err);
          } else {
               console.log("hgetall reply:", reply);
          }
     });
};

// Example usage
const hash = "user:1000"; // Example hash key
const field = "name"; // Field in the hash
const value = "John Doe"; // Value to set

// Create or Update


// Read
// read(hash, field);

// Get all
// getAll(hash);

// Delete
// deleteEntry(hash, field);

// Close the Redis client connection
// client.quit();
