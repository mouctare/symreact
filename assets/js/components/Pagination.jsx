import React, from "react";


//<pagination currentPage={currentPage} itemsPerpage={itemsPerpage} length={customers.length} les props du composant parent (customers)
//onPageChanged={handlePageChange} />

const Pagination = ({ currentPage,itemsPerPage, length, onPageChanged}) => {
    
        return ( <div>
            <ul className="pagination pagination-sm">
            <li className={"page-item" + (currentPage === 1 && "disabled")} 
            // si la page actuelle est a  la premiére page, je vais désactivé le boutton
            > 
            <button 
              className="page-link"
               onClick={() => handlePageChange(currentPage - 1)}
               >
             &laquo;
             </button>
             </li> 
             {pages.map(page => ( 
             <li key={page} className={"page-item" + (currentPage === page && " active")}>
             <button className="page-link" 
             onClick={() => handlePageChange(page)}
             >
             {page}
             </button>
           </li>
             ))}
             
         <li className={"page-item" + (currentPage === pagesCount && "disabled")} 
          // si la page actuelle est a 10, je vais désactivé le boutton
         > 
         <button className="page-link" 
         onClick={() => handlePageChange(currentPage + 1)}>
             &raquo;
             </button>
      </li> 
     </ul>
   </div>);
           
}
