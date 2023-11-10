const host = window.document.location.host.replace(/:.*/, '');
const ws = new WebSocket('wss://' + host);

// ws.onmessage = function (event) {
//   console.log(event);
// };

ws.onopen = function () {
  console.log('connected');
  // ws.send({'what');
}

export default ws;