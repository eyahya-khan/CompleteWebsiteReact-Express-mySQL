const express = require('express');
const bodyParser = require('body-parser')
const multer  = require('multer')
const cors = require('cors')
const app = express();

//connect database
const mysql = require('mysql');
const { urlencoded } = require('body-parser');
const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'kbaree123BD111',
    database: 'cruddatabase',
});

app.use(cors())

app.use(bodyParser.urlencoded({extended: true}));
//express version 4.16 =>
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//add data from frontend
app.post('/api/insert',(req,res)=>{
    const productname = req.body.productname
    const productdescription = req.body.productdescription
    const imagedata = req.body.image
    const productquantity = req.body.productquantity
    const producttype = req.body.producttype

    const mysqlInsert = 'INSERT INTO testtable (productname,productdescription,image,quantity,type) VALUES (?,?,?,?,?);'
    db.query(mysqlInsert,[productname,productdescription,imagedata,productquantity,producttype],(err,result)=>{
        //console.log(err)
        res.send(result);
    })
})


//fetch data from database
app.get('/api/get',(req,res)=>{
    const mysqlFetch = 'SELECT * from testtable';
    db.query(mysqlFetch,(err,result)=>{
        res.send(result);
    })
})

//delete data from database
app.delete('/api/delete/:id',(req,res)=>{
    const name = req.params.id
    const mysqlDelete = 'DELETE FROM testtable WHERE id = ?'
    db.query(mysqlDelete,name,(err,result)=>{
        //res.send(result);
        if (err) console.log(err);
    })
})

//update data in database
app.put('/api/update',(req,res)=>{
    const name = req.body.id
    const productdescription = req.body.productdescription
    const productname = req.body.productname
    const mysqlUpdate = 'update testtable set productname = ?, productdescription = ? where id = ?'
    db.query(mysqlUpdate,[productname,productdescription,name],(err,result)=>{
        //res.send(result);
        if (err) console.log(err);
    })
})

//image upload
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, "./images")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '--' + file.originalname)
    }
})

const upload = multer({ storage: fileStorageEngine })
//for single image
app.post('/single', upload.single('image'), (req, res) => {
    console.log(req.file)
    res.send('Single image upload success!')
  })

//for multiple image
app.post('/multiple', upload.array('images',3), (req, res) => {
    console.log(req.files)
    res.send('Multiple image upload success!')
  })

app.listen(3001,()=>{
    console.log('Running on port 3001 ');
});