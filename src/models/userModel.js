const { getDB } = require('../config/mongodb')
const USER_COLLECTION_NAME = 'users'
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const userModel = {
  createNew: async (data) => {
    try {
      return await getDB().collection(USER_COLLECTION_NAME).insertOne(data)
    } catch (error) {
      throw error
    }
  }
}

module.exports = userModel