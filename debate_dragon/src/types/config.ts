export interface IConfig {
   token: string;
   clientID: string;
   guildID: string;
   carmenRambles: {
      subscribers: Array<string>;
      // the channel name to send notifications too.
      channelName: string;
      // user id of carmen her self
      carmenId: string;
   };
   logLevel: "debug" | "info" | "warn" | "error";
   development: boolean;
}
