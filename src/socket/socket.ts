import { io } from "socket.io-client";

import { API_URL } from "@/constants";

const SERVER_URL = API_URL;

const socket = io(SERVER_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

export default socket;
