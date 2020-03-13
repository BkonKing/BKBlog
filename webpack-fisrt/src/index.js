import './index.less';
// 局部刷新
if (module && module.hot) {
  module.hot.accept()
}
// 根据环境变量判断环境
if (DEV === 'dev') {
  //开发环境
} else {
  //生产环境
}
fetch("user")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.log(err));
fetch("/login/account", {
  method: "POST",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: "admin",
    password: "888888"
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.log(err));
class Animal {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

document.getElementById('btn').onclick = function () {
  import('./handle.js').then(fn => fn.default());
}

const dog = new Animal('dog');
