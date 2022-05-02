import { removeCommandPrefix, constructCommandArgs } from "./utils";
import { Interaction } from "discord.js";

test("should remove command from message", () => {
   let result = removeCommandPrefix("$dd", "$dd hello world");
   expect(result).toMatch(/hello world/);
});
