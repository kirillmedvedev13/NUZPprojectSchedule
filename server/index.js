import { DynamicPool } from "node-worker-threads-pool"
import GetRndInteger from "./EvalutionAlghoritm/GetRndInteger.js";
const dynamicPool = new DynamicPool(6);
import f from "./index2.js"
let arr = [];
const param1 = { a: 2, b: 3, GetRndInteger };
const param2 = { a: 10, b: 10, GetRndInteger };
const c = 2;
for (let i = 0; i < 100; i++) {
    arr.push(dynamicPool.exec({ task: f, param: param1 }));
    arr.push(dynamicPool.exec({ task: f, param: param2 }));
    async function f2() {
        await Promise.all(arr).then(res => {
            res.forEach(r => {
                console.log(r)
            })
        })
    }
}
