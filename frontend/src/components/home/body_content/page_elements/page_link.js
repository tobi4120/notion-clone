import React from 'react';
import { delete_element } from '../../../../actions';
import { connect } from 'react-redux';

function Page_link(props) {
    const page = props.page_element.page_link[0]
    
    if (page) 
        return (
            <a style={{opacity: props.snapshot.isDragging? '0.5': '1' }} 
                className={`page_link ${props.page_element.color}`} href={`/#/${page.page}`}>
                <div className="hover-overlay">
                    <i className="far fa-file-alt"></i>
                    <p>{page.page_name}</p>
                </div>
            </a>
        )
    props.delete_element(props.page_element)
    return null
}

const mapStateToProps = (state) => {
    return {
        selected_page: state.selected_page
    }
}

export default connect(mapStateToProps, { delete_element })(Page_link);