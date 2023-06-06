import { MessageBuilder } from "../shared/message-side";

const messageBuilder = new MessageBuilder();
let webSocket = new WebSocket("ws://localhost:8080");

const fetchData = async (payload) => {
  try {
    const res = await fetch({
      url: "http://localhost:3002/api",
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        payload,
      }),
    });
  } catch (error) {
    console.log("[ERROR] REST REQUEST ERROR", error?.message);
  }
};

AppSideService({
  onInit() {
    messageBuilder.listen(() => {});

    webSocket.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    webSocket.onerror = (e) => {
      console.log("ws Connection Error", e);
    };

    webSocket.onclose = (e) => {
      // try to reconnect in 5 seconds
      webSocket = new WebSocket("ws://localhost:8080");
    }
  
    messageBuilder.on("request", (ctx) => {
      const jsonRpc = messageBuilder.buf2Json(ctx.request.payload);
      console.log(jsonRpc.method, "METHOD");
      console.log(jsonRpc, "FULL REQUEST");
      if (jsonRpc.method === "HEART_RATE") {
        webSocket.send(JSON.stringify(jsonRpc));
        return fetchData(jsonRpc.params);
      }
    });
  },

  onRun() {},

  onDestroy() {
  },
});
