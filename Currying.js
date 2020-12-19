// Technical task
// create function compose(func1, func2, func3)(arg1, arg2)

// solution
function compose(...arg) {
  return function (...arg2) {
    const [ firstCallback, ...restCallbacks ] = arg.reverse();
    return restCallbacks.reduce((acc, current) => {
      acc = current(acc);
      return acc;
    }, firstCallback(...arg2));
  };
}

// example
compose(
  (y) => {
    return y + 2;
  },
  (x) => {
    return x + 1;
  },
  (x, y) => {
    return x + y;
  }
)(1, 2);
