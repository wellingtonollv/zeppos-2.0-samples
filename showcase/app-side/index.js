import { MessageBuilder } from "../shared/message-side";

const messageBuilder = new MessageBuilder();
const wsURL = "wss://ultra.serveo.net";
let webSocket = new WebSocket(wsURL);



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
      console.log("ws Connection Closed", e);
    };

    messageBuilder.on("request", (ctx) => {
      const jsonRpc = messageBuilder.buf2Json(ctx.request.payload);
      console.log(jsonRpc, "FULL REQUEST");
      if (jsonRpc.method === "HEART_RATE") {
        webSocket.send(JSON.stringify(jsonRpc));
        return fetchData(jsonRpc.params);
      }
    });
  },

  onRun() {},

  onDestroy() {
    // if(webSocket?.close) webSocket.close();
  },
});
