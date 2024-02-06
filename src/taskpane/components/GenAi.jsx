import React, { useState } from 'react';
import './GenAi.css'; // Import CSS file
import Pagination from "./Pagination";

const GenAi = () => {
  const [responseData, setResponseData] = useState(null);
  const [selectionData, setSelectionData] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [index, setIndex] = useState(0);

  const itemsPerPage = 5;

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const pairsData = [{'key': 0, 'value': 'PARTNER AGREEMENT'},
    {'key': 1,
     'value': 'This Partner Agreement (this "Agreement") is made as of October 2322, 2021 ("Effective Date") by and between GameSix Company, a Massachusetts corporation with its principal place of business at 192190 Kelli Street, SA 0791 0101 ("GameSix "), and Tello Communication Corporation, a Delaware corporation with its principal place of business at 112 Kinderly Road, SA 95128 ("Tello"), either of which may be referred to as a "Party" or collectively as the "Parties".'},
    {'key': 2, 'value': 'PREAMBLE'},
    {'key': 3,
     'value': 'WHEREAS, GameSix and Tello each develop and offer solutions for service management;'},
    {'key': 4,
     'value': 'WHEREAS, GameSix and Tello have agreed to partner to offer customers a comprehensive connected service solution;'},
    {'key': 5,
     'value': 'WHEREAS, GameSix and Tello have agreed to each develop integrations between their solutions;'},
    {'key': 6,
     'value': 'WHEREAS, GameSix and Tello may refer customer opportunities to each other for sales of their respective solutions;'},
    {'key': 7,
     'value': 'WHEREAS, GameSix and Tello would like to offer certain GameSix customers the opportunity to migrate to the Tello field service management solution;'},
    {'key': 8,
     'value': 'NOW, THEREFORE, in consideration of the mutual representations, warranties and covenants contained herein, and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties, intending to be legally bound, agree as follows:'},
    {'key': 9, 'value': '1.Definitions.'},
    {'key': 10,
     'value': '"ACV" means, for subscription sales, an amount equal to the total value of subscription fees associated with the first twelve (12) months of the term of an executed Customer Contract for a Service Solution, and, for perpetual license sales, an amount equal to the total license fees payable by the Customer under the Customer Contract for a Service Solution multiplied by the then effective Subscription-Perpetual Conversion Factor.'},
    {'key': 11,
     'value': '"API(s)" means those application programmer interfaces that enable a Party to build Integrations into its Service Solution.'},
    {'key': 12,
     'value': '"Customer" means an entity that is identified as a customer on a Deal Registration Form.'},
    {'key': 13,
     'value': '"Customer Contract" means a binding agreement between a Customer and the Receiving Party for the provision of the Receiving Party\'s Service Solution to such Customer.'},
    {'key': 14,
     'value': '"Deal Registration Form" means the applicable form provided by a Party to the other Party to enable the other Party\'s sales representatives to register sales leads for a Party\'s products and services.'},
    {'key': 15,
     'value': '"Integration(s)" means the software interface(s) developed (or to be developed) by a Party to provide a working interface between the Service Solutions utilizing the API(s), as may be mutually agreed in writing by the Parties from time to time.'},
    {'key': 16,
     'value': '"Integration-Enabled" means a Party\'s Service Solution for which Integrations have been developed to enable such Party\'s Service Solution work with the other Party\'s Service Solution.'},
    {'key': 17,
     'value': '"Intellectual Property Rights" means (i) any and all patents, patent applications and patent rights (including without limitation any and all applicable assignments of patents or patent applications, continuations, continuations in-part, divisions, patents of addition, renewals, extensions, foreign counterparts, utility models, reexaminations, and applications for reissuance of patents); (ii) any and all copyrights and applications, registrations, recordings and renewals in connection therewith; (iii) any and all trade secrets and confidential business information (including without limitation ideas, research and development, know-how, technical data, designs, drawings, specifications, customer lists, pricing and cost information, and business and marketing plans and proposals, all of which whether currently existing or hereinafter developed); (iv) any and all other proprietary rights of any type whatsoever in connection therewith whether or not appropriate protection for the same is or has been sought; (v) any and all copies and tangible embodiments thereof (in whatever form or medium); (vii) any and all income, royalties, damages or payments now or hereafter due and/or payable under any of the foregoing with respect to any of the foregoing and the right to sue for past, present or future infringements of any of the foregoing; (vii) licenses, agreements and permissions with respect to any of the foregoing; and (viii) any and all rights corresponding to any of the foregoing throughout the world.'},
    {'key': 18,
     'value': '"Internal Use" means the use of the Licensed Materials: (1) to conduct training of a Party\'s personnel; and (2) to assist a Party\'s personnel to perform maintenance, customer support, and training pertaining to the Integration(s).'},
    {'key': 19,
     'value': '"Licensed Materials" means, as appropriate, the GAMESIX Service Solutions, the Tello Service Solution, the API(s) and Integrations provided by the Parties hereunder.'},
    {'key': 20,
     'value': '"Marks" means collectively the GAMESIX Trademarks and Tello Trademarks.'},
    {'key': 21,
     'value': '"GAMESIX FSM" means GAMESIX\'s proprietary field service management solution.'},
    {'key': 22,
     'value': '"GAMESIX SLM Modules" means GAMESIX proprietary service lifecycle management suite of solutions, other than GAMESIX FSM and GAMESIX\'s proprietary warranty contract management solution.'}]

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
    setcsvString(csvString);
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
      {responseData && (
        <div className="response-container">
          <h2>Response Data:</h2>
          <pre className="response-data">{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
      <br/>
      <button onClick={ documentToCsv} className="button">Get the legal clauses</button>
      <div id="valuesContainer">
      {currentItems.length > 0 &&
        currentItems.map((pair) => (
          <div key={pair.key}>
            <p
              onClick={() => scrollToParagraph(pair.key)}
              style={{ cursor: "pointer" }}
            >
              {pair.value}
            </p>
          </div>
        ))}
      <Pagination
        items={pairsData}
        itemsPerPage={itemsPerPage}
        handlePagination={handlePagination}
      />
    </div>
    </div>
  );
};

export default GenAi;
