import "dotenv/config";
import { createServer } from "http";
import express from "express";
import proxy from "express-http-proxy";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import { MEDIA_ROOT, configuration } from "./utils";
import { handleErrors } from "./middlewares";
import { default as programRoutes } from "./features/programs/route";

const app = express();
const httpServer = createServer(app);

// connect to database
mongoose
  .connect(configuration.db)
  .then((result) => {
    console.log(
      `[+]${configuration.name}:${configuration.version} connected to database Successfully`
    );
  })
  .catch((err) => {
    console.log("[x]Could not connect to database" + err);
    process.exit(1); // Exit the application on database connection error
  });

// middlewares
if (app.get("env") === "development") {
  app.use(morgan("combined"));
  console.log(
    `[+]${configuration.name}:${configuration.version} enable morgan`
  );
}
app.use(cors());
app.use(express.json());
app.use(express.static(MEDIA_ROOT));

// routes
app.get("/", (req, res) => {
  res.send({ data: "Hello, world!", headers: req.headers, query: req.query });
});
app.use("/programs", programRoutes);

// error handler
app.use(handleErrors);

const port = configuration.port ?? 0; // Use environment variable if available, otherwise use 0 for random port

httpServer.on("listening", () => {
  const address = httpServer.address();
  console.log(
    `[+]${configuration.name}:${configuration.version} listening on port ${
      (address as any).port
    }`
  );
});

httpServer.listen(0);
