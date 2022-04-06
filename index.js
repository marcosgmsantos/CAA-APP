
const express = require('express')
const app = express()
const fs= require('fs')
const axios = require('axios');
const route = express.Router()
const cors = require('cors');
const req = require('express/lib/request');
const res = require('express/lib/response');
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies
const db = require("./models");


/* ***************************************
*                                        *
*                                        *
*  CONNECTING TO DATABASE                *
*                                        *
*****************************************/ 
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

/* ***************************************
*                                        *
*                                        *
*  ALLOWING CORS                         *
*                                        *
*****************************************/ 

var corsOptions = {
    origin: "*",
  };

const Entry = db.Entrys;
//this line is required to parse the request body
app.use(express.json())
app.use(cors(corsOptions))

// set view engine
app.set("view engine", "ejs")
//app.set("views", path.resolve(__dirname, "views/ejs"))

// load assets
app.use(express.static('assets'));
let api='http://localhost:3030/user/list'

app.get('/', (req, res) => {
    axios.get(api)
        .then(function(response){
            res.render('index', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

})

app.get('/update-user/', (req, res) => {
    axios.get(api)
        .then(function(response){
            //console.log(finds)
           res.render('update_user', {username: req.query.username,
            age: req.query.age,
            fullname: req.query.fullname,
            password: req.query.password})
            
        })
        .catch(err =>{
            res.send(err);
        })

})





app.put('/update-user/:username', (req, res)=> {
       //get the username from url
       const username = req.params.username
       //get the update data
    
    Entry.find({username:username})
        .then(data => {
            if(data){
                    res.send(data[0])     
            }else{ 
                res.status(404).send({ message : "Not found user with id "+ username})
                
            }
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Entrys."
            });
        });
       //check if the username exist or not           

})



/* Create - POST method */
app.post('/user/add', (req, res) => {

  
const userData = req.body

//check if the userData fields are missing
if (userData.fullname == null || userData.fullname == ''  || userData.age == null  || userData.age == '' || userData.username == null  || userData.username == '' || userData.password == null || userData.password == '') {
    //return res.status(401).send({error: true, msg: 'User data missing'})
   return  res.status(500).send({
        message : {error: true, msg: 'User data missing'}
    });
}
Entry.find({username: userData.usernam})
.then(existUsers => {
    // looking for user if already exists
    const findExist = existUsers.find( user => user.username === userData.username )
    if (findExist) {
        return res.status(409).send({error: true, msg: 'username already exist'})
    }else{
        let entry =new Entry(userData)
        entry
        .save(entry)
        .then(data => {
            res.redirect('/');

        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Entry."
          });
        });
    }


})
.catch(err => {
    res.status(500).send({
    message:
        err.message || "Some error occurred while retrieving Entrys."
    });
});

})





/* util functions */

//routing
app.get('/add-user', (req, res) =>{
    res.render('add_user')
})

//configure the server port
app.listen(3030, () => {
    console.log('Server runs on port 3000')
})