"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
test("should remove command from message", () => {
    let result = (0, utils_1.removeCommandPrefix)("$dd", "$dd hello world");
    expect(result).toMatch(/hello world/);
});
