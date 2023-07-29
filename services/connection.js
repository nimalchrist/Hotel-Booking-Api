const mongoose = require ('mongoose');

async function connection()
{
    try {
        await mongoose.connect("mongodb+srv://gceInterns:IcanioGCE@gcecluster1.hfhvmqk.mongodb.net/", {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("Connected to the MongoDB database");
      } catch (error) {
        console.error("Error connecting to the MongoDB database:", error);
        throw error;
      }
}

module.exports = connection;










