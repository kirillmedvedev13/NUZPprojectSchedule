import { Form, Row, InputGroup,FormControl  } from "react-bootstrap"
import { Search } from "react-bootstrap-icons"
import React from "react";
import { useQuery } from "@apollo/client"
import Select from "react-select/async"

function TemplateSelect({ searchinfo, handleChangeFilters }) {
    const { error, loading, data } = useQuery(searchinfo.query.gql);
    if (loading) return 'Loading...';
    if (error) return `Error! ${error}`;
    let options = []
    data[searchinfo.query.name].forEach(item => {
        options.push({ label: item[searchinfo.query.nameatr], value: Number(item.id)})
    });
    console.log(options)
    return (<Select isClearable options={options} placeholder={searchinfo.placeholder} onChange={(e) => {
        handleChangeFilters(searchinfo.namefilter, e ? searchinfo.typeValue(e.value) : null)
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
