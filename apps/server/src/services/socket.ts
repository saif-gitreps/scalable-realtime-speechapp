import { Server } from "socket.io";

class SocketService {
   private _io: Server; // this is a variable _io with a type of Server.

   constructor() {
      console.log("Init Socker Server..");
      this._io = new Server();
   }

   public initListeners() {
      const io = this.io;
      console.log("Init Socket Listeners..");
      io.on("connect", async (socket) => {
         console.log(`New Socket Connected`, socket.id);

         socket.on("event:message", async ({ message }: { message: string }) => {
            console.log("New message received", message);
         });
      });
   }

   get io() {
      return this._io;
   }
}

export default SocketService;
