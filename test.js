class ReactiveString extends String {
  is(state) {
    return this.valueOf() === state;
  }
}

const x = new ReactiveString("John");
console.log(x);
