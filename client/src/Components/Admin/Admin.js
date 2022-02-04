import React from "react";

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = { file: "" };
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("handle uploading-", this.state.file);
  }

  handleFileChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: "E:/kirill/shedule project/some files/24-01-20_#ПЗ_Вiдомiсть_доручень_д_ВЕСНА_2019-2020.xls",
        imagePreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(file);
  }

  render() {
    return (
      <div className="previewComponent">
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <input
            className="fileInput"
            type="file"
            onChange={(e) => this.handleFileChange(e)}
          />
          <button
            className="submitButton"
            type="submit"
            onClick={(e) => this.handleSubmit(e)}
          >
            Upload Image
          </button>
        </form>
      </div>
    );
  }
}
export default Admin;
