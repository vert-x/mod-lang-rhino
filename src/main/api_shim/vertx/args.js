function getArgValue(type, args) {
  if (args.length === 0) {
    return null;
  }
  var arg = args[args.length - 1];
  if (typeof(arg) === type) {
    args.pop();
    return arg;
  } else {
    return null;
  }
}