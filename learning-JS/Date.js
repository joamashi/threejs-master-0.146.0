"Date"

  var $data = new Date('8/25/1976');
    $data; // Wed Aug 25 1976 00:00:00 GMT+0900 (대한민국 표준시) 

  var str = $data.toString(); // "Wed Aug 25 1976 00:00:00 GMT+0900 (대한민국 표준시)"

  var myArray = []
  myArray = str.split(' '); // ["Wed", "Aug", "25", "1976", "00:00:00", "GMT+0900", "(대한민국", "표준시)"]
  strJoin = myArray.join(' '); // Wed Aug 25 1976 00:00:00 GMT+0900 (대한민국 표준시)

  var date = new Date(),
    hour = date.getHours(),
    milliseconds = date.getMilliseconds(),
    minutes = date.getMinutes(),
    month = date.getMonth(),
    seconds = date.getSeconds(),
    time = date.getTime(),
    dates = date.getDate(),
    day = date.getDay();

  var timestamp = new Date().getTime();
