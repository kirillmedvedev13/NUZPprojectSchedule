import { Form, Row, InputGroup,FormControl  } from "react-bootstrap"
import { Search } from "react-bootstrap-icons"
import React from "react";
import { useQuery } from "@apollo/client"
import Select from "react-select"

function TemplateSelect({ searchinfo, handleChangeFilters }) {
    const { error, loading, data } = useQuery(searchinfo.query.gql);
    if (loading) return 'Loading...';
    if (error) return `Error! ${error}`;
    let options = []
    data[searchinfo.query.name].forEach(item => {
        const key = Number(item.id)
        options.push({ label: item.name, value: key})
    });
    console.log(options);
    return (<Select options={options} placeholder={searchinfo.placeholder} onChange={(e) => {
        handleChangeFilters(searchinfo.namefilter, searchinfo.typeValue(e.value))
    }
    }/>)
}

function TemplateInput({ searchinfo, handleChangeFilters }) {
    return (
        <InputGroup className="my-1">
            <InputGroup.Text ><Search></Search></InputGroup.Text>
            <FormControl
                placeholder={searchinfo.placeholder}
                onChange={(e) => 
                    handleChangeFilters(searchinfo.namefilter, searchinfo.typeValue(e.target.value))
                }
            />
        </InputGroup>
    )
}

class TemplateSearch extends React.Component {


    render() {
        const { handleChangeFilters, searchinfo = [] } = this.props;

        return (
            <Form onSubmit={(e) => e.preventDefault()} >
                <Form.Group as={Row} className="my-2 mx-2 justify-content-center">
                    {searchinfo.map(info => {
                        switch (info.type) {
                            case "input":
                                return (<TemplateInput searchinfo={info} handleChangeFilters={handleChangeFilters}></TemplateInput>)
                            case "select":
                                return (<TemplateSelect searchinfo={info} handleChangeFilters={handleChangeFilters}></TemplateSelect>)
                            default:
                                return null; 
                        }
                    })}
                </Form.Group>
            </Form >
        );
    }
};

export default TemplateSearch;
