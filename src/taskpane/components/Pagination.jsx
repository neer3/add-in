import React from "react";
import './Pagination.css'

export default function Pagination({ items, itemsPerPage, handlePagination }) {
  // Calculate the number of pages
  const pages = Math.ceil(items.length / itemsPerPage);

  // Create an array of page numbers
  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  // Render the page buttons
  return (
    <div className="pagination">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => handlePagination(number)}
          className="page-button"
        >
          {number}
        </button>
      ))}
    </div>
  );
}