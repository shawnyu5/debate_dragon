"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const config_json_1 = __importDefault(require("../config.json"));
const logger = (0, pino_1.default)({
    transport: { target: "pino-pretty" },
    options: { colorize: true },
    level: config_json_1.default.logLevel || "info",
});
exports.default = logger;
