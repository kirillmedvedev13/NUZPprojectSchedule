function f(param) {
    const { a, b } = JSON.parse(param);
    return a + b;
}

import { DynamicPool } from "node-worker-threads-pool"

const dynamicPool = new DynamicPool(6);

let arr = [];
const param1 = JSON.stringify({ a: 2, b: 3 });
const param2 = JSON.stringify({ a: 10, b: 10 });
const c = 2;
arr.push(dynamicPool.exec({ task: f, param: param1 }));
arr.push(dynamicPool.exec({ task: f, param: param2 }));
async function f2() {
    await Promise.all(arr).then(res => {
        res.forEach(r => {
            console.log(r)
        })
    })
}
f2();
