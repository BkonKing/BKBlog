// math.js
import lodash from 'lodash';
import classA from './classes/class-a';
import classB from './classes/class-b';
// 测试maxInitialRequests时隐藏下面语句
import classC from './classes/class-c';


let math = {
    teacher: 'math', age: 47
};
lodash.assign(math, {
  teacher: 'math', age: 48
})

classA.push(math);
classB.push(math);
classC.push(math);
