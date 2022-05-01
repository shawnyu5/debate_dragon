const Utils = require("./utils");

test("should remove command from message", () => {
  let result = Utils.removeCommand("$dd", "$dd hello world");
  expect(result).toMatch(/hello world/);
});
