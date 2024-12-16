import fastify from 'fastify'
import fastifyWebSockets from "@fastify/websocket";
import cors from "@fastify/cors";

const server = fastify({logger: true})

/**
 * Register cors to allow all connections. Note that in production environments, you should
 * narrow down domains that should be able to access your server.
 */
server.register(cors);

/**
 * Register the Fastify WebSockets plugin.
 */
server.register(fastifyWebSockets);
/**
 * Register a new handler to listen for WebSocket messages.
 */
server.register(async function (serverWebSocket) {
  serverWebSocket.get(
    "/online-status",
    {
      websocket: true,
    },
    (connection, req) => {
      connection.on("message", msg => {
        connection.send(`Hello from Fastify. Your message is ${msg}`);
      });
    }
  );
});

let numberButtonCall = 0 
server.get('/ping', async (request, reply) => {
  return 'pong pong pong\n'
})

server.get('/arduinobuttonpush', async (request, reply) => {
    numberButtonCall += 1
    console.log("le Bouton a été apuyée: ", numberButtonCall)

    server.websocketServer.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(
          JSON.stringify({
            numberButtonPush: numberButtonCall,
          })
        );
      }
    });
    reply.status(200)
    return `nb Button Call: ${numberButtonCall}`
})

server.get('/', async (request, reply) => {
  console.log("request to /")
  reply.status(200)
  return `broken mind`
})

server.listen({ port: 8080, host: '0.0.0.0'}, (err, ipaddress) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${ipaddress}`)
})