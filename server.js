
const express = require('express')
const app = express()

app. listen(8080, () => {
  console.log('http://localhost:8080에서 서버 실행중')
})

app.get('/',(요청, 응답) => {
  응답.send('반갑다')
})