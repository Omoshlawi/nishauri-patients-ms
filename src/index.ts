import "dotenv/config";
import { createServer } from "http";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import { MEDIA_ROOT, configuration } from "./utils";
import { handleErrors } from "./middlewares";
import { default as programRoutes } from "./features/programs/routes";
import { registry } from "./utils/helpers";
import { toNumber } from "lodash";

const app = express();
const httpServer = createServer(app);

// connect to database
mongoose
  .connect(configuration.db)
  .then((result) => {
    console.info(
      `[+]${configuration.name}:${configuration.version} connected to database Successfully`
    );
  })
  .catch((err) => {
    console.error("[x]Could not connect to database" + err);
    process.exit(1); // Exit the application on database connection error
  });

// middlewares
if (app.get("env") === "development") {
  app.use(morgan("combined"));
  console.info(
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
  const address: any = httpServer.address();
  const bind =
    typeof address === "string" ? `pipe ${address}` : `port ${address?.port}`;
  const { register, unregister } = registry(
    configuration.registry.url,
    configuration.name,
    configuration.version,
    toNumber(address.port)
  );
  register();
  const interval = setInterval(register, 10000);
  const cleanupAndExit = async () => {
    clearInterval(interval);
    await unregister();
    process.exit(0);
  };

  process.on("exit", cleanupAndExit);
  process.on("uncaughtException", cleanupAndExit);
  process.on("SIGTERM", cleanupAndExit);
  process.on("SIGINT", cleanupAndExit);

  console.info(
    `[+]${configuration.name}:${configuration.version} listening on ${bind}`
  );
});

httpServer.listen(port);
