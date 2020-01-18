const express = require("express");
const bodyParser = require('body-parser');
const Ctgamestudio = require("./model/Ctgamestudio")
const User = require("./model/User")
const mongoose = require("mongoose");
const process = require("./processing")

// connect to database
mongoose.connect(
  "mongodb://localhost:27017/ctstudio",
  { useNewUrlParser: true },
  error => {
    if (!error) {
      console.log("Success Connection");
    } else {
      console.log("Error connecting the Database");
    }
  }
);

// start express app
const app = express();
app.use(express.static(__dirname + '/public'));
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const excludedUsers = [
  'werneburg@collide.info',
  'ingmar.werneburg@senckenberg.de',
  'manske@collide.info',
  'hoppe@collide.info',
  'jessica.feldkamp@stud.uni-due.de',
  'alexander.kocur@stud.uni-due.de',
  'anna.taphorn@stud.uni-due.de',
  'benjamin.koelner@gmail.com',
  'computational.thinking@collide.info',
  'felix.mucha@collide.info',
  'hoppe@collide.info',
  'maze0@collide.info',
  'MB0@collide.info',
  'MS0@collide.info',
  'LH0@collide.info',
  'AD2@collide.info',
  'AD3@collide.info',
  'EY1@collide.info',
  'EY2@collide.info',
  'EY3@collide.info',
  'HV1@collide.info',
  'SK3@collide.info'
];


//Routes
app.get("/", async function(req, res){
  user_ids = await Ctgamestudio.distinct("owner");
  users = await User.find({_id : {$in : user_ids}, email : {$nin : excludedUsers}}).select('name')
  levels = await Ctgamestudio.distinct("level");
  res.render("index", {users: users, levels : levels.sort()});

});

app.post("/", async function(req, res) {
  if (!req.body.user){
    // stats about all users in specific levels
    var data = await get_level_data(String(req.body.level))
    res.send({data: data});
  }else{
    // stats about certain user in specific level
    let idToSearch = mongoose.Types.ObjectId(req.body.user);
    let levelToSearch = String(req.body.level);

    Ctgamestudio.find({
      owner: idToSearch,
      level: levelToSearch,
      title: { $ne: "get" }
    }).exec().then(result => {
      data = process.process(result);
      if(data){
        res.send({data: data, user: req.body.user, level: levelToSearch});
      }else{
        res.send({error:true});
      }
    })
  }
});

async function get_level_data(level){
  // get the number of levels most of the users have passed
  // and define the users passed more than this number as high success
  // otherwise low success
  var levels_most_users_passed = number_of_levels();
  // get data for users passed more than 5 levels
  var high_success_users = await get_users_data(level, "$gt");
  // get data for users passed less than 5 levels
  var low_success_users = await get_users_data(level, '$lt');
  // get data for users passed 5 levels
  var average_success_users = await get_users_data(level, '$eq');
  var trace1 = {
    x: ['creates', 'changes', 'runs', 'time'],
    y: high_success_users,
    name: 'High success',
    marker: { color: 'rgb(85,202,106)' },
    type: 'bar'
  };

  var trace2 = {
    x: ['creates', 'changes', 'runs', 'time'],
    y: average_success_users,
    name: 'Average',
    marker: { color: 'rgb(27,141,253)' },
    type: 'bar'
  };

  var trace3 = {
    x: ['creates', 'changes', 'runs', 'time'],
    y: low_success_users,
    name: 'Low success',
    marker: { color: 'rgb(234,54,81)' },
    type: 'bar'
  };

  var data = [trace1, trace2, trace3];
  var layout = {
    title: "LEVEL " + level,
    barmode: 'group'
  };
  var plot = [data, layout];
  return plot;
}

async function get_users_data(level, type_of_users){
  // exclude testing and developing accounts
  var included_users= await User.find({email :{$nin :excludedUsers}}).select("_id");
  var included_users_ids = included_users.map(a => a._id);
  var users_ids =
    await Ctgamestudio.aggregate(
      [{
        // match users with at least one win
        // and not a tester
        $match: {
          title: "win",
          owner : {$in : included_users_ids}
        }
      },
      // group by user and level
      {
        $group:
          { _id: { owner: "$owner", level: "$level" } }
      },
      // group again by owner and count number of levels
      {
        $group: { _id: "$_id.owner", count: { $sum: 1 } }
      },
      // filter users according to type of users
      { $match: { count: { [type_of_users] : 5 } } }
      ]).exec().then(result => {
        return result.map(a => a._id);
      });

  // to include users with zero wins
  if(type_of_users == "$lt"){
    users_ids_with_atleast_one_win = await Ctgamestudio.aggregate(
      [{$group: {
          _id: { owner: "$owner", title: "$title", level: "$level" },
          count: { $sum: 1 }
          }
        },
        {$match: {
          "_id.title": "win"
          }
        },
        { $group: {
          _id: "$_id.owner",
          }
        }]).exec().then(result => {
          return result.map(a => a._id);
        });

    users_ids_with_zero_wins = await Ctgamestudio.distinct("owner",{ $and: [
      {owner :{$in: included_users_ids}},
      { owner: { $nin: users_ids_with_atleast_one_win}}
      ]
    })
    users_ids.push(...users_ids_with_zero_wins);
  }
  // get all level logs for the ids we have
  var users_data = await Ctgamestudio.aggregate(
    [{
      $match: {
        level: level,
        owner: { $in: users_ids }
      }
    },
    {
      $group:
        { _id: "$owner", logs: { $push: "$$ROOT" } }
    }
    ]).exec().then(result => {
      if (result.length != 0){
        data = process.get_level_data(result);
        return data;
      }
      return [0,0,0,0];
    });
  return users_data;
}

async function number_of_levels(){
  levels_passed_by_each_user = await Ctgamestudio.aggregate(
    [{
        // all users with that won at least one level
        $match: { title: "win" }
      },
      // group them by user and level
      { $group:
        { _id: { owner: "$owner", level: "$level" }}
      },
      // group one more time to calculate number of levels each user passed
      { $group: {
        _id: "$_id.owner",
        count: { $sum: 1 }
        }
    }]
  );
  let number_of_levels = levels_passed_by_each_user.map(a => a.count);
  // get the most frequent number of levels passed
  return get_most_frequent_levels_passed(number_of_levels);
}

function get_most_frequent_levels_passed(array) {
  if (array.length == 0)
    return null;
  var modeMap = {};
  var maxEl = array[0], maxCount = 1;
  for (var i = 0; i < array.length; i++) {
    var el = array[i];
    if (modeMap[el] == null)
      modeMap[el] = 1;
    else
      modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}

app.post("/get_logs", async function (req, res) {
  let idToSearch = mongoose.Types.ObjectId(req.body.user);
  let levelToSearch = String(req.body.level);
  let date = req.body.date;
  log = await Ctgamestudio.find({owner : idToSearch, level:levelToSearch, publishedDate: date});
  console.log(log[0].blockly)
  res.send(log[0].blockly );
});

app.listen(3000)
