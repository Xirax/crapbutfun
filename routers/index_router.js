const express = require('express');
var path = require("path")
const session = require('express-session');

const router = express();
// router.use(express.static(path.join(__dirname, '/../static')));
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.use(session(
    {secret: 'SECRET-KEY',
    resave: false,
    saveUninitialized: true,
    cookie: {path: '/', httpOnly: false, secure: false, maxAge: 1000 * 60 * 60 * 72}
    }
))

let id = 0
let ballList = []
let deadIDs = []
let colors = ["#0000FF", "#FF0000", "#00FF00", "#abb2b9", "#e67e22", "#f1c40f", "#8e44ad","#0000FF", "#FF0000", "#00FF00", "#abb2b9", "#e67e22", "#f1c40f", "#8e44ad","#0000FF", "#FF0000", "#00FF00", "#abb2b9", "#e67e22", "#f1c40f", "#8e44ad", "decrease", "block", "multicolor"]
let users = []
let minutes = 2
let seconds = 1


function timer(){
    if(seconds !== 0 && minutes !== 0){
        seconds--;
        if (seconds == 0) {
            minutes--;
            seconds = 60;}
    }
}


router.get('/kulki', (req, res) =>{

    for (let count = 0; count < 300; count++) {
        let id = count
        let dx = Math.random() / 50;
        let dy = Math.random() / 50;
        let dz = Math.random() / 50;
        let px = Math.random() * 1.2;
        let py = Math.random() * 1.2;
        let pz = Math.random() * 1.2;
        let color = colors[Math.floor(Math.random() * colors.length)];
        ballList.push({id, dx, dy, dz, px, py, pz, color})
    }
    res.send(ballList)
    setInterval(timer, 1000);


})

router.get('/status', (req, res) =>{


  // res.send({test: 'test'});

    if(seconds == 0 && minutes == 0){
        res.redirect('/end')
    }
    else if(req.session.idk == 0){
        res.send({mypoints: users[0].points, enemypoints: users[1].points, deadIDs: deadIDs, blocked: users[0].blocked, time: minutes + ":" + seconds})
        deadIDs = []
        users[0].blocked = false
    }
    else if(req.session.idk == 1){
        res.send({mypoints: users[1].points, enemypoints: users[0].points, deadIDs: deadIDs, blocked: users[1].blocked, time: minutes + ":" + seconds})
        deadIDs = []
        users[0].blocked = false
    } 
})

router.post('/newUser', (req, res) => {
    let { nickname } = req.body
    req.session.idk = id
    let points = 0
    let blocked = false
    let ready = false
    users.push({nickname, id, points, blocked, ready})
    id++
    console.log(users)
    res.end()
  });



router.post('/shot', (req, res) => {
      deadIDs.push(req.body.deadID)
      users[req.session.idk].points = req.body.points
      if (req.body.type == "blocked"){
        if(req.session.idk == 0){
            users[1].blocked = true
        }
        else if(req.session.idk == 1){
            users[0].blocked = true
        }
      }
      else if(req.body.type == "decrease"){
        if(req.session.idk == 0){
            users[1].points = users[1].points - 5
        }
        else if(req.session.idk == 1){
            users[0].points = users[0].points - 5
      }
      }

})

router.get("/", function (req, res) {
    res.redirect("/lobby")

})

router.get('/game', function(req, res){
    res.sendFile(path.join(__dirname, '../static/index.html'));
})

router.get("/lobby", (req, res) =>{
    res.sendFile(path.join(__dirname + "/../static/html/lobby.html"))
})

router.get("/end", (req, res) =>{
    res.sendFile(path.join(__dirname + "/../static/html/end.html"))
})

router.get("/checkWin", (req, res) =>{
    if (users[0].points > users[1].points){
        res.send(users[0].nickname)
    }
    else if (users[0].points < users[1].points){
        res.send(users[1].nickname)
    }
    id = 0
    ballList = []
    deadIDs = []
    users = []
    minutes = 2
    seconds = 0
})

router.get("/ready", (req, res) =>{
    users[req.session.idk].ready = true
    if(users[0].ready == true && users.length == 2){
        if(users[0].ready == true && users[1].ready == true){
            res.redirect('/indeks')
            // res.sendFile(path.join(__dirname + "/../static/html/index.html"))
            // console.log(res)
        }
    }

})

router.get("/indeks", (req, res) =>{
    res.sendFile(path.join(__dirname, "../static/html/index.html"))
})


router.get("/test", (req, res) =>{
    res.send({time: minutes + ":" + seconds})
})
//   router.listen(PORT, () => {
//     console.log(`nasłuchiwanie na porcie ${PORT}`);
//   });
module.exports = router;