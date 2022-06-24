import pino from "pino";
import config from "../config.json";

const logger = pino({
   transport: { target: "pino-pretty" },
   options: { colorize: true },
   level: config.logLevel || "info",
});

export default logger;
