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
   };
   logLevel: "debug" | "info" | "warn" | "error";
   development: boolean;
}
