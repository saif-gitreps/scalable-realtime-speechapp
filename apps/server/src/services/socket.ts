import { Server } from "socket.io";
import Redis from "ioredis";
import "dotenv/config";

const pub = new Redis({
   host: process.env.REDIS_HOST as string,
   port: process.env.REDIS_PORT as unknown as number,
   username: "default",
   password: process.env.REDIS_PASSWORD as string,
});
const sub = new Redis({
   host: process.env.REDIS_HOST as string,
   port: process.env.REDIS_PORT as unknown as number,
   username: "default",
   password: process.env.REDIS_PASSWORD as string,
});

class SocketService {
   private _io: Server; // this is a variable _io with a type of Server.

   constructor() {
      console.log("Init Socker Server..");
      this._io = new Server({
         cors: {
            allowedHeaders: ["*"],
            origin: "*",
         },
      });
      sub.subscribe("MESSAGES");
   }

   public initListeners() {
      const io = this._io;
      console.log("Init Socket Listeners..");
      io.on("connect", async (socket) => {
         try {
            console.log(`New Socket Connected`, socket.id);

            await pub.publish(
               "MESSAGES",
               JSON.stringify({ message: "New user connected" })
            );

            socket.on("event:message", async ({ message }: { message: string }) => {
               console.log("New message received", message);
            });
         } catch (error) {
            console.log("Error on socket connection", error);
         }
      });

      sub.on("message", async (channel, message) => {
         if (channel === "MESSAGES") {
            io.emit("message", message);
         }
      });
   }

   get io() {
      return this._io;
   }
}

export default SocketService;
