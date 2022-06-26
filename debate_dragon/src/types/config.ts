export interface IConfig {
   token: string;
   clientID: string;
   guildID: string;
   carmenRambles: {
      subscribers: Array<string>;
      // the channel id to send notifications too.
      channelId: string;
      // user id of carmen her self
      carmenId: string;
      // the guild id of the server to keep track of carmen messages
      guildID: "755477320864890890";
   };
   logLevel: "debug" | "info" | "warn" | "error";
   development: boolean;
}
