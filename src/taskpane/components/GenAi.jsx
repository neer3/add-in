import React, { useState } from 'react';
import './GenAi.css'; // Import CSS file
import Pagination from "./Pagination";

const GenAi = () => {
  const [responseData, setResponseData] = useState([]);
  const [selectionData, setSelectionData] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [index, setIndex] = useState(0);
  const [calledLLM, setCalledLLM] = useState(false);

  const itemsPerPage = 5;

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const pairsData = [];

  const currentItems = pairsData.slice(indexOfFirstItem, indexOfLastItem);

  const fetchData = async () => {
    await Word.run(async (context) => {
      var selection = context.document.getSelection();
      context.load(selection, 'text');

      await context.sync();

      setSelectionData(selection.text);

      console.log(selectionData);

      if(selectionData.length === 0){
        return;
      }

      const token = "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";
      const baseUrl = 'https://api.openai.com/v1/chat/completions';

      var bodyParams = {
        'text': selectionData
      };

      var queryString = new URLSearchParams(bodyParams).toString();
      var url = `${baseUrl}?${queryString}`;
      debugger;
      try {
        const response = await fetch(baseUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyParams)
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setResponseData(data.text);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    });
  };

  const documentToCsv = async () => {
    if(calledLLM === true){
      return;
    }

    setCalledLLM(true);
    let csvRows = [];
    csvRows.push('"index","paragraph"');
    await Word.run(async (context) => {
      const body = context.document.body;
      const paragraphs = body.paragraphs;
      paragraphs.load("text");
      await context.sync();
      for (let i = 0; i < paragraphs.items.length && i<40; i++) {
        let paragraph = paragraphs.items[i];
        let text = paragraph.text;
        text = text.replace(/[^a-zA-Z0-9\s]/g, "");
        if (text.length>2){
          let csvRow = i + ',"' + text + '"';
        csvRows.push(csvRow);
        }
      }
    });
    let csvString = csvRows.join("\n");

    const token =
      "";
    const baseUrl = "https://alpha.lvh.me:5400/api/v1/usage_metrics/gen_ai_test";

    var bodyParams = {
      'text': csvString
    };

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyParams)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setResponseData(data.legal_clauses);
      setCalledLLM(false);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setCalledLLM(false);
    }
  };

  const scrollToParagraph = async(inputValue) => {
    resetHighlight()
    setIndex(inputValue)
    await Word.run(async (context) => {
      const paragraphs = context.document.body.paragraphs;
      paragraphs.load("items, count");
  
      await context.sync();
      if (inputValue < 0 || inputValue >= paragraphs.count) {
        console.error("Invalid paragraph index.");
        return;
      }
  
      const targetParagraph = paragraphs.items[inputValue];
      paragraphs.items[inputValue].font.highlightColor = "yellow";
      targetParagraph.getRange().select();
      targetParagraph.getRange().scrollIntoView();
  
      await context.sync();
    });
  }

  const resetHighlight = async() => {
    await Word.run(async (context) => {
      const paragraphs = context.document.body.paragraphs;
      paragraphs.load("items, count");
  
      await context.sync();
      paragraphs.items[index].font.highlightColor = "white";
  
      await context.sync();
    });
  }

  return (
    <div>
      <button className="button" onClick={fetchData}>Summarize Data</button>
      <br/>
      <button onClick={ documentToCsv} className="button">Get the legal clauses</button>
      <div id="valuesContainer">
      {responseData.length > 0 &&
        responseData.map((pair) => (
          <div key={pair.index}>
            <p
              onClick={() => scrollToParagraph(pair.index)}
              style={{ cursor: "pointer" }}
            >
              {pair.clause}
            </p>
          </div>
        ))}
      <Pagination
        items={responseData}
        itemsPerPage={itemsPerPage}
        handlePagination={handlePagination}
      />
    </div>
    </div>
  );
};

export default GenAi;
