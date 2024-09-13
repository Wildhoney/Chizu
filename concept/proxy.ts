const target = {
    person: {
        name: "Adam"
    },
  };
  
  const handler2 = {
    get(target, prop, receiver) {
        console.log(prop);
        return target[prop];
    },
  };
  
  const proxy2 = new Proxy(target, handler2);
  console.log(proxy2.person.name); // world