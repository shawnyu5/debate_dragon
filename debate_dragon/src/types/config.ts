export interface IConfig {
   token: string;
   clientID: string;
   guildID: string;
   carmenRambles: {
      // the channel id to send notifications too.
      channelId: string;
      // user id of carmen her self
      carmenId: string;
      // the guild id of the server to keep track of carmen messages
      guildID: string;
      // the number of messages to trigger a notification
      messageLimit: number;
      // carmen subscriber role id. The role to ping when she starts rambling
      subscribersRoleID: "991000363408719953";
      // number of minutes to wait before sending a notification
      coolDown: 60;
   };
   logLevel: "debug" | "info" | "warn" | "error";
   development: boolean;
   subForJohn: {
      // id of john
      johnID: string;
      // channel to send the notification to
      notificationChannelId: string;
      // the guild id of the server to keep track of john messages
      guildID: string;
      // cool down in minutes
      cooldown: number;
      // the role id to ping for notifications
      subscribersRoleID: string;
      // the strings to look for to trigger a notification
      words: Array<string>;
   };
}
