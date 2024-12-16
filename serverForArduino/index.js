"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
const cors_1 = __importDefault(require("@fastify/cors"));
const server = (0, fastify_1.default)({ logger: true });
/**
 * Register cors to allow all connections. Note that in production environments, you should
 * narrow down domains that should be able to access your server.
 */
server.register(cors_1.default);
/**
 * Register the Fastify WebSockets plugin.
 */
server.register(websocket_1.default);
/**
 * Register a new handler to listen for WebSocket messages.
 */
server.register(function (serverWebSocket) {
    return __awaiter(this, void 0, void 0, function* () {
        serverWebSocket.get("/online-status", {
            websocket: true,
        }, (connection, req) => {
            connection.on("message", msg => {
                connection.send(`Hello from Fastify. Your message is ${msg}`);
            });
        });
    });
});
let numberButtonCall = 0;
server.get('/ping', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return 'pong pong pong\n';
}));
server.get('/arduinobuttonpush', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    numberButtonCall += 1;
    console.log("le Bouton a été apuyée: ", numberButtonCall);
    server.websocketServer.clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify({
                numberButtonPush: numberButtonCall,
            }));
        }
    });
    reply.status(200);
    return `nb Button Call: ${numberButtonCall}`;
}));
server.get('/', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("request to /");
    reply.status(200);
    return `broken mind`;
}));
server.listen({ port: 8080, host: '0.0.0.0' }, (err, ipaddress) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${ipaddress}`);
});
