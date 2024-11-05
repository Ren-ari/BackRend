

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const { MongoClient } = require('mongodb');

let db;
const url = 'mongodb+srv://renari:zldeldrktvmf@cluster0.ie7tq.mongodb.net/forum?retryWrites=true&w=majority';

new MongoClient(url,).connect().then((client) => {
    console.log('MongoDB 접속 성공!');
    db = client.db('forum');
    app.listen(8080, () => {
      console.log('http://localhost:8080에서 서버 실행중');
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get('/', (요청, 응답) => {
  응답.sendFile(__dirname + '/index.html');
});

// app.get('/list', async (요청, 응답) => {
//   let result = await db.collection('post').find().toArray();
//   응답.render('list.ejs', { 글목록 : result });
// });

app.get('/write', (요청, 응답) => {
  응답.render('write.ejs')
})

app.post('/add', async (요청, 응답) => {
  try {
    await db.collection('post').insertOne({
      title: 요청.body.title,
      content: 요청.body.content,
      date: new Date()
    });
  console.log(요청.body);
  } catch(err) {
    console.log('데이터 저장 오류:', err);
    응답.status(500).send('데이터 저장에 실패했습니다.');
  }

});
  
