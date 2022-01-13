import React from "react"
import Select from "react-select"

class Teacher extends React.Component{
    render(){
        const options = [
            {value : "1", label : "test"},
            {value : "2", label : "test2"},
        ]
        console.log(options)

        return(
            <div>
                <Select options={options}></Select>
            </div>
        )
    }
}

export default Teacher;