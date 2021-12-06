exports.getTimeAsString = function () {
  var _date = new Date();
  return _date.toISOString().split("T")[0] + " " + _date.toTimeString().split(" ")[0];
};
