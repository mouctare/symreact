import React from "react";



//<pagination currentPage={currentPage} itemsPerpage={itemsPerpage} length={customers.length} les props du composant parent (customers)
//onPageChanged={handlePageChange} />

const Pagination = ({ currentPage,itemsPerPage, length, onPageChanged}) => {
  

    const pagesCount =  Math.ceil(length / itemsPerPage); // ici on fait une division
        const pages = [];

        for(let i = 1; i <= pagesCount; i++) {
            pages.push(i);
        }
    
        return (
             <>
            <ul className="pagination pagination-sm">
            <li className={"page-item" + (currentPage === 1 && " disabled")} 
            // si la page actuelle est a  la premiére page, je vais désactivé le boutton
            > 
            <button 
              className="page-link"
               onClick={() => onPageChanged(currentPage - 1)}
               >
             &laquo;
             </button>
             </li> 
             {pages.map(page => ( 
             <li key={page} className={"page-item" + (currentPage === page && " active")}>
             <button className="page-link" onClick={() => onPageChanged(page)}
             >
             {page}
             </button>
           </li>
             ))}
             
         <li className={"page-item" + (currentPage === pagesCount && "disabled")} 
        
         > 
         <button 
         className="page-link" 
         onClick={() => onPageChanged(currentPage + 1)}
         >
             &raquo;
    </button>
      </li> 
     </ul>
   </>
   
   );
           
};

Pagination.getData = (items, currentPage, itemsPerPage) => {
  const start = currentPage * itemsPerPage - itemsPerPage;
  return items.slice(start, start + itemsPerPage); 
}

export default Pagination;