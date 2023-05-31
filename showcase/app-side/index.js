import { MessageBuilder } from '../shared/message-side'

const messageBuilder = new MessageBuilder()
const webSocket = new WebSocket('ws://localhost:8080')



const fetchData = async (payload) => {
  try {
    // Requesting network data using the fetch API
    // The sample program is for simulation only and does not request real network data, so it is commented here
    // Example of a GET method request
    // const res = await fetch({
    //   url: 'https://xxx.com/api/xxx',
    //   method: 'GET'
    // })
    // Example of a POST method request
    // const res = await fetch({
    //   url: 'https://xxx.com/api/xxx',
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     text: 'Hello Zepp OS'
    //   })
    // })

    // A network request is simulated here
    const res = await fetch({
      url: 'https://oculus-test.vercel.app/api',
      method: 'POST',
      body: JSON.stringify({
        payload
      })
    });
    console.log(res, 'res')
    // const resBody = typeof res.body === 'string' ?  JSON.parse(res.body) : res.body

    // ctx.response({
    //   data: { result: resBody.data },
    // })

  } catch (error) {
    console.log('errorzito',error)
    // ctx.response({
    //   data: { result: 'ERROR' },
    // })
  }
}

AppSideService({
  onInit() {
    messageBuilder.listen(() => {})

    webSocket.onopen = () => {
      console.log('WebSocket Client Connected')
    }

    messageBuilder.on('request', (ctx) => {
      const jsonRpc = messageBuilder.buf2Json(ctx.request.payload)
      console.log(jsonRpc.method, 'jsonRpc');
      console.log(jsonRpc, 'jsonRpc')
      if (jsonRpc.method === 'POST_HEART_RATE') {
        webSocket.send(JSON.stringify(jsonRpc))
        return fetchData(jsonRpc.params)
      }
    })
  },

  onRun() {
  },

  onDestroy() {
  }
})
