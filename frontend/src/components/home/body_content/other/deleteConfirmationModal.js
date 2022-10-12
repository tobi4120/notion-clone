import React from "react";

const DeleteConfirmationModal = (props) => {
    return (
        <div className="semi-transparent-bg">
            <div className="modal">
                <p>{props.message}</p>

                <button className="delete-btn" onClick={props.deleteFunction}>
                    Delete
                </button>

                <button className="cancel-btn" onClick={() => props.setModalShown(false)}>
                    Cancel
                </button>
            </div>
        </div>
    )
}
export default DeleteConfirmationModal;