// const WebSocket = require('ws');

// // 连接目标地址
// const ws = new WebSocket('ws://localhost:3000/ws');

// ws.on('open', () => {
//   console.log('✅ 已连接');
//   ws.send('Hello from client'); // 发送一条消息
// });

// ws.on('message', (data) => {
//   console.log('📩 收到:', data.toString());
//   ws.close(); // 收到消息后主动关闭
// });


// ws.on('event', (data) => {
//   console.log('📩 收到 event:', data.toString());
//   ws.close(); // 收到消息后主动关闭
// });

// ws.on('error', (err) => {
//   console.error('❌ 错误:', err);
// });

// ws.on('close', () => {
//   console.log('🔌 已断开');
// });

const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000/ws');

ws.on('open', () => {
  console.log('✅ 已连接');

  // 发送 'events' 事件
  ws.send(JSON.stringify({ event: 'events', data: 'Hello Events' }));

  // 发送 'chat' 事件
//   setTimeout(() => {
//     ws.send(JSON.stringify({ event: 'chat', data: 'Hello Chat' }));
//   }, 500);

  // 发送 'message' 事件（演示可以订阅任意名字）
  setTimeout(() => {
    ws.send(JSON.stringify({ event: 'message', data: 'Hello Message' }));
  }, 1000);
});

ws.on('message', (data) => {
  console.log('📩 收到:', data.toString());
});

ws.on('error', (err) => console.error('❌ 错误:', err));
ws.on('close', () => console.log('🔌 已断开'));