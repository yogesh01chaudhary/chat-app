import express from "express";
const app = express();
app.use(express.json());
import "dotenv/config";
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
