const functions = require('firebase-functions');
const axios = require('axios');

const LINE_ACCESS_TOKEN = 'mjBswxJRSJh6lEUILZCQY0YtsiUNdrjfgc0TlwxyX81qDmYaqpYU08UlsHoNRAqgVtONzIYRnPYX2BVfR6R7lT95zD5Y2PN4LjhudPIB1dZUb3SPUN6mIoPgKNMPq/ECKTCht87DOXQC9mWhNIqCeQdB04t89/1O/w1cDnyilFU='; // ใส่ Channel Access Token ของคุณ

// ฟังก์ชันสำหรับส่ง Flex Message
const sendFlexMessage = (userId) => {
  const flexMessage = {
    type: 'flex',
    altText: 'Flex Message',
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://i.postimg.cc/DZsFJ99F/271798.jpg',
        size: 'full',
        aspectRatio: '1:1',
        aspectMode: 'fit',
        action: {
          type: 'uri',
          label: 'Line',
          uri: 'https://linecorp.com/'
        }
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'แจกเครดิตฟรี 100 บาท',
            weight: 'bold',
            size: 'xl',
            align: 'center',
            margin: 'md',
            contents: []
          },
          {
            type: 'button',
            action: {
              type: 'uri',
              label: 'รับคูปอง',
              uri: 'https://lin.ee/qnC7UQH'
            },
            height: 'sm',
            style: 'primary',
            offsetTop: '5px'
          },
          {
            type: 'button',
            action: {
              type: 'uri',
              label: 'สมัครสมาชิก',
              uri: 'https://betner168.com'
            },
            height: 'sm',
            style: 'secondary',
            offsetTop: '10px'
          },
          {
            type: 'button',
            action: {
              type: 'uri',
              label: 'แชร์ต่อให้เพื่อน',
              uri: 'line://msg/text/https://lin.ee/qnC7UQH'
            },
            height: 'sm',
            style: 'secondary',
            offsetTop: '15px'
          },
          {
            type: 'spacer',
            size: 'sm'
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'text',
            text: 'รับฟรี 100 ทันที',
            size: 'sm',
            color: '#959595FF',
            margin: 'sm',
            contents: []
          }
        ]
      }
    }
  };

  return axios.post('https://api.line.me/v2/bot/message/push', {
    to: userId,
    messages: [flexMessage]
  }, {
    headers: {
      Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
};

// ฟังก์ชัน Webhook ที่จะรับจาก Dialogflow และส่ง Flex Message
exports.dialogflowWebhook = functions.https.onRequest((req, res) => {
  const action = req.body.queryResult.action;

  // เช็คว่าเป็นเหตุการณ์ `follow` หรือไม่
  if (action === 'follow') {
    const userId = req.body.originalDetectIntentRequest.payload.data.source.userId;

    sendFlexMessage(userId)
      .then(() => {
        res.send({ fulfillmentText: 'Welcome message sent!' });
      })
      .catch(error => {
        console.error('Error sending message:', error);
        res.status(500).send('Error');
      });
  } else {
    res.send({ fulfillmentText: 'No follow event detected' });
  }
});
