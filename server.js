

const express = require('express');
const app = express();
const methodOverride = require('method-override');

app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/video'));
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended:true}))


const { MongoClient, ObjectId } = require('mongodb');

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
  응답.render('index.ejs')
});

app.get('/list', async (요청, 응답) => {
  let result = await db.collection('post').find().toArray();
  응답.render('list.ejs', { 글목록 : result });
});

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
  
app.get('/detail/:id', async (요청, 응답) => {
  try {
  let result = await db.collection('post').findOne({ _id : new ObjectId(요청.params.id) })
  console.log(요청.params)
  응답.render('detail.ejs', {result : result})
  } catch(e) {
    console.log(e)
    응답.status(404).send('이상한 url 입력함');
  }
})

app.get('/edit/:id', async (요청, 응답) => {
  let result = await db.collection('post').findOne({_id : new ObjectId(요청.params.id)})
  console.log(result)
  응답.render('edit.ejs', {result : result})
})

app.put('/edit', async(요청, 응답) => {
  try{
    await db.collection('post').updateOne({ _id : new ObjectId(요청.body.id) }, {$set : {title : 요청.body.title, content : 요청.body.content}})
  console.log(요청.body)
  응답.redirect('/list');
  } catch (err) {
    console.log('수정오류:', err);
    응답.status(500).send('수정에 실패했습니다.');
  }
  
})

app.delete('/delete', async(요청,응답)=>{
  await db.collection('post').deleteOne({ _id : new ObjectId(요청.query.docid) })
  응답.send('삭제완료')

})