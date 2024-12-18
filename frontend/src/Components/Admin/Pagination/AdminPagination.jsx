import './AdminPagination.css'

const AdminPagination = ({state, dispatch}) =>{

    const handlePageClick = (i) => {
        dispatch({type: 'SET_CURRENT_PAGE', payload: i})
    }
        
    const nextPage = () => {
        dispatch({type: 'SET_CURRENT_PAGE', payload: state.currentPage + 1})
    }
        
    const prevPage = () => {
        dispatch({type: 'SET_CURRENT_PAGE', payload: state.currentPage - 1})
    }

    const generatePaginationButtons = () => {
        let startPage = Math.floor((state.currentPage - 1) / 4) * 4 + 1;
        let endPage = Math.min(startPage + 3, state.totalPages);
        let paginationBtns = [];

        for (let i = startPage; i <= endPage; i++) {
            paginationBtns.push(
                <button key={i} className='pagination-btn'
                    onClick={() => handlePageClick(i)}
                    style={{
                        backgroundColor: state.currentPage === i ? '#ff3131' : '',
                        color: state.currentPage === i ? 'white' : ''
                    }}
                >{i}</button>
            );
        }
        return paginationBtns;
    };

    return (
            <div className="pagination-controls">
                <button disabled={state.disabledPrevBtn} onClick={() => handlePageClick(1)}>{`<<`}</button>
                <button id="prevPage" disabled={state.disabledPrevBtn} className="pagination-button" onClick={prevPage}>{"<"}</button>
                    <div className="pagination">
                        {generatePaginationButtons()}
                    </div>
                <button id="nextPage" disabled={state.disabledNextbtn} className="pagination-button" onClick={nextPage}>{">"}</button>
                <button disabled={state.disabledNextbtn} onClick={() => handlePageClick(state.totalPages)}>{`>>`}</button>
            </div>
    );
}

export default AdminPagination