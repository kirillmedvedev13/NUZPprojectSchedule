import React from "react"
import update from 'react-addons-update'
import { Button } from "react-bootstrap"
import CathedraDialog from "./CathedraDialog"
import CathedraModal from "./CathedraModal"
import CathedraTable from "./CathedraTable"
import CathedraSearch from "./CathedraSearch"

class Cathedra extends React.Component {
    state = {
        filters: {
            name: "",
        },
        item: {
            id: null,
            name: "",

        },
        openModal: false,
        openDialog: false,
    }

    handleOpenDialog = () => {
        this.setState({
            openDialog: true,
        })
    }

    handleCloseDialog = () => {
        this.setState({
            openDialog: false,
        })
    }

    handleOpenModal = () => {
        this.setState({
            openModal: true,
        })
    }

    handleCloseModal = () => {
        this.setState({
            openModal: false,
            item: {
                id: null,
                name: "",
            },
        })
    }

    handleChangeItem = (name, value) => {
        this.setState(PrevState => (
            {
                item: update(PrevState.item, { $merge: { [name]: value } })
            }
        ))
    }

    handleChangeFilters = (name, value) => {
        this.setState(PrevState => ({
            filters: update(PrevState.filters, { $merge: { [name]: value } })
        })
        )
    }

    handleSetItem = (item) => {
        this.setState(PrevState => ({
            item: update(PrevState.item, { $merge: item })
        }))
    }

    render() {
        const { filters, item, openModal, openDialog } = this.state;
        return (
            <>
                <CathedraModal isopen={openModal} item={item} handleChangeItem={this.handleChangeItem} handleCloseModal={this.handleCloseModal}></CathedraModal>
                <CathedraDialog isopen={openDialog} item={item} handleCloseDialog={this.handleCloseDialog}></CathedraDialog>
                <CathedraSearch handleChangeFilters={this.handleChangeFilters}></CathedraSearch>
                <div className="d-flex justify-content-end mx-2 my-2">
                    <Button variant="primary" className="col-auto" onClick={this.handleOpenModal}>Додати Кафедру</Button>
                </div>
                <CathedraTable handleOpenModal={this.handleOpenModal} handleOpenDialog={this.handleOpenDialog} handleSetItem={this.handleSetItem} filters={filters}></CathedraTable>

            </>
        )
    }
}

export default Cathedra;