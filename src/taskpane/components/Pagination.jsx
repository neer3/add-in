import React, { useState } from "react";
import './Pagination.css'

export default function Pagination({ items, itemsPerPage, handlePagination }) {
  // Calculate the number of pages
  const pages = Math.ceil(items.length / itemsPerPage);
  const [selectedButton,setSelectedButton]=useState(0);
  const handleSelection = (buttonId) => {
    setSelectedButton(buttonId);
    handlePagination(buttonId)
  };


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
          onClick={() => handleSelection(number)}
          className="page-button"
          style={{
            backgroundColor: selectedButton === number ? "#0056b3" : "gray",
          }}
        >
          {number}
        </button>
      ))}
    </div>
  );
}