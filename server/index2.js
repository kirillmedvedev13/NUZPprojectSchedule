

export default function f(param) {
    const GetRndInteger = this.import('./EvalutionAlghoritm/GetRndInteger')
    console.log(GetRndInteger)
    const { a, b } = param;

    return GetRndInteger(a, b);
}

