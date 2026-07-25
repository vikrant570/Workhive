import { Server, Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/typed-events";

// 1. Events sent from Server to Client
export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  messageReceived: (message : any) => void;
}

// 2. Events sent from Client to Server
export interface ClientToServerEvents {
  hello: () => void;
  join_room: (roomId: string) => void;
  sendMessage: (chatID: string, message: string, callback: (res: any) => void) => void;
  inviteToProject : (chatID: string, project: any, callback: (res:any) => void) => void;
}

// 3. Inter-server events (if using multiple nodes/Redis)
export interface InterServerEvents {
  ping: () => void;
}

// 4. Socket Data (This is important! Type your custom properties here)
export interface SocketData {
  user :{
    userID: string | Types.ObjectId;
  }
}

// --- GLOBAL EXPORTED TYPES ---

// The main IO instance type
export type IOServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

// The individual Socket instance type
export type IOSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

// The "Next" function type for Middlewares
// (err?: ExtendedError) => void is the internal Socket.io signature
export type IONext = (err?: ExtendedError) => void;