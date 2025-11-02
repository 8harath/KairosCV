import { WebSocket, Server as WebSocketServer } from "ws"

export function createWebSocketServer(httpServer: any) {
  const wss = new WebSocketServer({ noServer: true })

  httpServer.on("upgrade", (request: any, socket: any, head: any) => {
    const url = new URL(request.url, `http://${request.headers.host}`)

    if (url.pathname.startsWith("/api/ws/")) {
      wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
        const fileId = url.pathname.split("/").pop()

        ws.on("message", (message: string) => {
          console.log(`[v0] Received: ${message}`)
        })

        // Simulate processing
        simulateProcessing(ws, fileId as string)
      })
    } else {
      socket.destroy()
    }
  })

  return wss
}

async function simulateProcessing(ws: WebSocket, fileId: string) {
  const stages = [
    { stage: "parsing", progress: 20, message: "Parsing resume..." },
    { stage: "parsing", progress: 35, message: "Extract complete" },
    { stage: "enhancing", progress: 50, message: "Enhancing with AI..." },
    { stage: "enhancing", progress: 70, message: "Content optimized" },
    { stage: "generating", progress: 80, message: "Generating PDF..." },
    { stage: "compiling", progress: 95, message: "Compiling..." },
  ]

  for (const update of stages) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(update))
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        stage: "complete",
        progress: 100,
        message: "Done!",
        download_url: `/api/download/${fileId}`,
      }),
    )
  }
}
