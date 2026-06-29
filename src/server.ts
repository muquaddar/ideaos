import { createServer, type Server } from "node:http";
import { healthCheck } from "./health.js";

export function createApp(port: number): Promise<{ server: Server; port: number }> {
  const server = createServer((req, res) => {
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(healthCheck()));
      return;
    }
    res.writeHead(404);
    res.end();
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      const address = server.address();
      const boundPort = typeof address === "object" && address ? address.port : port;
      resolve({ server, port: boundPort });
    });
  });
}

if (process.env.NODE_ENV !== "test") {
  createApp(Number(process.env.PORT ?? 3000));
}
