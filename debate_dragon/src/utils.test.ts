import { writeToConfig } from "./utils";
import fs from "fs";
import path from "path";
test("should write a key value pair to config.json", () => {
   const oldConfig = require("../config.json");
   const key = "test";
   const value = "test";
   // TODO: resolve back to old config after test
   // writeToConfig(key, value);
   // const config = require("../config.json");
   // expect(config[key]).toBe(value);
   // fs.writeFileSync(
   // path.resolve(__dirname + "/../config.json"),
   // JSON.stringify(oldConfig, null, 2)
   // );
});
