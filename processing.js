
module.exports = {
  process : function (logs) {
      let first = true;
      let begin_time = new Date();
      let number_of_blocks;
      let changes = [];
      let changes_time = [];
      let wins = [];
      let wins_time = [];
      let tests = [];
      let tests_time = [];
      let all_times = [];
      if(logs.length == 0){
        return null;
      }
    try {
      logs.forEach(function (log) {
        // for the first block, count the number of blocks given by the game
        if (first) {
          number_of_blocks = (log.blockly.match(/<block/g) || []).length;
          begin_time = log.publishedDate;
          changes.push(number_of_blocks);
          changes_time.push(0);
          all_times.push(log.publishedDate);
          first = false;
        }
        // if it reate a variable, count it as adding one block
        if (log.title == "change" && log.event.includes("var_create")) {
          number_of_blocks += 1;
          changes.push(number_of_blocks);
          changes_time.push(time_diff(begin_time, log.publishedDate, true))
          all_times.push(log.publishedDate);
        }
        // if blocks were created, add the number of them to the total blocks number of the program
        else if (log.title == "change" && log.event.includes("create")) {
          let event = JSON.parse(log.event);
          number_of_blocks += event.ids.length;
          changes.push(number_of_blocks);
          changes_time.push(time_diff(begin_time, log.publishedDate, true))
          all_times.push(log.publishedDate);
        }
        // if blocks were deleted, subtract the number of deleted from the total number of blocks
        else if (log.title == "change" && log.event.includes("delete")) {
          let event = JSON.parse(log.event);
          number_of_blocks -= event.ids.length;
          changes.push(number_of_blocks);
          changes_time.push(time_diff(begin_time, log.publishedDate, true))
          all_times.push(log.publishedDate);
        }
        else if (log.title == "change" && (log.event.includes("change") || log.event.includes("move"))) {
          changes.push(number_of_blocks);
          changes_time.push(time_diff(begin_time, log.publishedDate, true))
          all_times.push(log.publishedDate);
        }
        else if (log.title == "win") {
          changes.push(number_of_blocks);
          changes_time.push(time_diff(begin_time, log.publishedDate, true))
          wins.push(number_of_blocks);
          wins_time.push(time_diff(begin_time, log.publishedDate, true))
          all_times.push(log.publishedDate);
          throw new Error();
        }
        // if the code was tests, mark the time of the test
        else if (log.title == "test") {
          // tests.push(number_of_blocks);
          changes.push(number_of_blocks);
          changes_time.push(time_diff(begin_time, log.publishedDate, true))
          tests.push(number_of_blocks);
          tests_time.push(time_diff(begin_time, log.publishedDate, true))
          all_times.push(log.publishedDate);
        }
      });
    }
    catch (e) {
    }
    var changes_plot = plot_line(changes_time, changes);
    var tests_plot = plot_points(tests, tests_time, "test");
    var wins_plot = plot_points(wins, wins_time, "win")
    // var layout = plot_tests_and_wins(tests_time, wins_time, changes);
    var data = [changes_plot, tests_plot, wins_plot];
    var layout = {
      xaxis: {
        title: 'Time in Seconds'
      },
      yaxis: {
        title: 'Number of Blocks'
      }
    };
    return [data, layout,all_times];
  },
  get_level_data : function (users){
    // return the average values in this sequence
    // creates, changes, runs, time
    let average_values = []
    let number_of_creates_per_user = [];
    let number_of_changes_per_user = [];
    let number_of_runs_per_user = [];
    let number_of_ifs_per_user = [];
    let number_of_fors_per_user = [];
    let number_of_functions_per_user = [];
    let number_of_blocks_per_user = [];
    let time_per_user = [];
    if (users.length == 0) {
      return null;
    }
    users.forEach(function (user) {
      // console.log(user._id);
      // for each user
      // keep track of the number of creates,changes, run and time
      var first = true;
      var begin_time = new Date();
      let number_of_creates = 0;
      let number_of_changes = 0;
      let number_of_runs = 0;
      let number_of_ifs = 0;
      let number_of_fors = 0;
      let number_of_functions = 0;
      let number_of_blocks = 0;
      let index_of_runs = [];
      let time = [];
      try{
        user.logs.forEach(function (log, i){
          // for the first block, set the time
          if (first) {
            begin_time = log.publishedDate;
            first = false;
          }
          // if it reate a variable, count it as adding one block
          if (log.title == "change" && log.event.includes("var_create")) {
            number_of_creates++;
            time.push(time_diff(begin_time, log.publishedDate, false));
          }
          // if blocks were created, add the number of them to the total blocks number of the program
          else if (log.title == "change" && log.event.includes("create")) {
            number_of_creates++;
            time.push(time_diff(begin_time, log.publishedDate, false));
          }
          // change, move, delete
          else if (log.title == "change") {
            number_of_changes++;
            time.push(time_diff(begin_time, log.publishedDate, false));
          }
          // runs
          else if (log.title == "win" || log.title == "test") {
            number_of_runs++;
            // console.log(log)
            // console.log(i);
            index_of_runs.push(i);
            time.push(time_diff(begin_time, log.publishedDate, false));
            // to break after the first win
            if (log.title == 'win'){
              throw new Error();
            }
          }
        });
      }catch(e){
      }
      var last_log = user.logs[index_of_runs[index_of_runs.length - 1]]
      // console.log(last_log);
      number_of_changes_per_user.push(number_of_changes);
      number_of_creates_per_user.push(number_of_creates);
      number_of_runs_per_user.push(number_of_runs);
      // time in minutes till the first win
      time_to_first_win = time[time.length - 1] / 60
      if (time_to_first_win > 120) {
        // if the time is more than 120 minutes
        // like in the case of the user with the id 5bbdbb2cc40a6a07cc833af8
        // where the first win was after nearly a month of the first time
        // she opened the first level
        time_per_user.push(120);
      } else {
        time_per_user.push(time_to_first_win);
      }

      // calculate number of ifs, functions, for loops
      if (last_log){
        number_of_ifs = (last_log.blockly.match(/controls_if/g) || []).length;
        number_of_fors = (last_log.blockly.match(/controls_repeat_ext/g) || []).length + (last_log.blockly.match(/controls_whileUntil/g) || []).length + (last_log.blockly.match(/controls_for/g) || []).length;
        number_of_functions = (last_log.blockly.match(/procedures/g) || []).length;
        number_of_blocks = (last_log.blockly.match(/<block/g) || []).length;
      }
      // console.log(number_of_ifs);
      // console.log(number_of_fors);
      number_of_ifs_per_user.push(number_of_ifs);
      number_of_fors_per_user.push(number_of_fors);
      number_of_functions_per_user.push(number_of_functions);
      number_of_blocks_per_user.push(number_of_blocks);
    });
    // function to calculate average of for all users
    const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length

    average_values.push(arrAvg(number_of_creates_per_user).toFixed(1));
    average_values.push(arrAvg(number_of_changes_per_user).toFixed(1));
    average_values.push(arrAvg(number_of_runs_per_user).toFixed(1));
    average_values.push(arrAvg(time_per_user).toFixed(1));
    average_values.push(arrAvg(number_of_ifs_per_user).toFixed(1));
    average_values.push(arrAvg(number_of_fors_per_user).toFixed(1));
    average_values.push(arrAvg(number_of_functions_per_user).toFixed(1));
    average_values.push(arrAvg(number_of_blocks_per_user).toFixed(1));
    // console.log(number_of_creates_per_user);
    // console.log(number_of_changes_per_user);
    // console.log(number_of_runs_per_user);
    // console.log(number_of_ifs_per_user);
    // console.log(number_of_fors_per_user);
    // console.log(number_of_functions_per_user);

    return average_values;
  }
};

function plot_line(x_axis, y_axis){
  var trace = {
    x: x_axis,
    y: y_axis,
    mode: 'lines+markers',
    marker: {
      color: 'rgb(55, 128, 191)',
      size: 10
    },
    line: {
      color: 'rgb(55, 128, 191)',
      width: 3
    },
    name : 'Change'
  };
  return trace;
}

function plot_points(number_of_blocks, time, type){
  if(type == "test"){
    color = 'rgb(255, 0, 0)'
    name= 'Test'
  }else{
    color = 'rgb(50,205,50)'
    name = 'Win'
  }
  var trace = {
    x: time,
    y: number_of_blocks,
    mode: 'markers',
    marker: {
      color: color,
      size: 12
    },
    name: name
  };
  return trace;
}

function time_diff(begin_time, end_time, add_one){
  diff_ms = end_time - begin_time
  // time difference in seconds
  diff = diff_ms / 1000;
  if (add_one){
    // adding one second is nessecary for the blocks given in each level
    return diff + 1;
  }
  return diff;

}
