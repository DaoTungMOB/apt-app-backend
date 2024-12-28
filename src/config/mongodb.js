const { MongoClient, ServerApiVersion } = require("mongodb");
const { env } = require("./environment");

// khởi tạo đối tượng trelloDbInstance
let trelloDbInstance = null;

// khởi tạo đối tượng clientInstance để connect tới MongoDB
const clientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectDB = async () => {
  try {
    await clientInstance.connect();

    trelloDbInstance = clientInstance.db(env.DATABASE_NAME);
  } catch (error) {
    console.log("Connect database fail: ");
    throw error;
  }
};

const closeDB = async () => {
  await clientInstance.close();
};

// export database instance
/**
 *
 * @returns {import('mongodb').Db}
 */
const getDB = () => {
  if (!trelloDbInstance) {
    throw new Error("Must connect to database first!");
  }
  return trelloDbInstance;
};

module.exports = {
  connectDB,
  closeDB,
  getDB,
};
