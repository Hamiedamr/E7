const express = require('express')
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()
const connectionString = "mongodb+srv://hamied:123@cluster0.cohdo.mongodb.net/asu?retryWrites=true&w=majority"

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

MongoClient.connect(connectionString,{ useUnifiedTopology: true}, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')
    const db = client.db('asu')
    const coursesCollection = db.collection('courses')
    const studentsCollection = db.collection('students')
    //API endpoints
    /**CREATE */
    app.post('/api/courses/create',(req,res)=>{
        coursesCollection.insertOne(req.body)
        .then(result => {
            res.json(result.ops[0])
          })
          .catch(error => console.error(error))
    });
    app.post('/api/students/create',(req,res)=>{
        studentsCollection.insertOne(req.body)
        .then(result => {
          res.json(result.ops[0])
        })
          .catch(error => console.error(error))
    });

    /**READ */
    app.get('/api/courses/',(req,res)=>{
        coursesCollection.find().toArray().then(result=>{
            res.json(result)
        })
    });
    app.get('/api/students/',(req,res)=>{ 
         studentsCollection.find().toArray().then(result=>{
          res.json(result)
         })
});

    /**UPDATE */
    app.put('/api/courses/',(req,res)=>{
        coursesCollection.findOneAndUpdate(
            { code: req.body.code },
            {
              $set: {
                name: req.body.name,
                desc: req.body.desc
              }
            },
            {
              upsert: true
            }
          ).then(result=> res.json(result))
            .catch(error => console.error(error))
    });
    app.put('/api/students/',(req,res)=>{
        studentsCollection.findOneAndUpdate(
            { code: req.body.code },
            {
              $set: {
                name: req.body.name,
                code: req.body.code,
              }
            },
            {
              upsert: true
            }
          ).then(result=> res.json(result))
          .catch(error => console.error(error))
    });

    /**DELETE */

    app.delete('/api/courses/',(req,res)=>{
        coursesCollection.deleteOne(
            { code: req.body.code }
          )
            .then(result => {
              res.json(result)
            })
            .catch(error => console.error(error))
    });
    app.delete('/api/students/',(req,res)=>{
        studentsCollection.deleteOne(
            { code: req.body.code }
          )
            .then(result => {
              res.json(result)
            })
            .catch(error => console.error(error))
    });

  })


//WEB Routes

app.get('/web/courses/create',(req,res)=>{
    res.sendFile(__dirname +'/views/courses.html')
});
app.get('/web/students/create',(req,res)=>{
    res.sendFile(__dirname +  '/views/students.html')
});


app.listen(3000,()=>{
    console.log("listening to 3000");
});