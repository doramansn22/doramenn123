const dotenv = require("dotenv");
const connectDatabase = require("./database");

dotenv.config();

const testDatabase = async () => {
  await connectDatabase();
  console.log("HomeAI database test completed successfully.");
  process.exit(0);
};

testDatabase();