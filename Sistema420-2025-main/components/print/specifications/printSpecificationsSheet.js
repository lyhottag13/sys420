import React from "react";
import { useRef, useState, useEffect } from "react";
import { jsPDF, HTMLOptionImage } from "jspdf";
import PrintIcon from "../../svg/printIcon";

import Loader from "../../loader";

import { parametersSections } from "../../../constants/";

const PrintSpecificationsSheet = ({ specifications }) => {
  const [printing, setPrinting] = useState(false);

  const handlerBubbleClick = () => {
    setPrinting(true);
  };
  useEffect(()=>{
    if(!printing) return;
    
    generatePdf();
    setPrinting(false);
  },[printing])

  // Generate PDF Functions
  function generatePdf() {
    var doc = new jsPDF({
      unit: "pt",
      format: "letter",
    });
    doc.setFontSize(12);

    addHeader(doc);
    addSections(doc);
    
    window.open( doc.output("bloburl", { filename: "REPORT" }), "_blank");

  }
  function addTextOnRow(doc, text, row, x) {
    const interline = 2;
    const top = 42.5;

    let rowSize = doc.getFontSize() + interline;
    let positionY = row * rowSize + top;

    doc.text(text, x, positionY);
  }
  function addHeader(doc) {
    doc.line(22.6, 28, 586.7, 28);

    // Titles
    doc.setFont(undefined, "bold");
    addTextOnRow(doc, 'COTO System 420 - Vers 1.0', 0, 22.6);
    addTextOnRow(doc, 'PN   :', 1, 22.6);

    addTextOnRow(doc, 'SPECIFICATION COPY', 0, 210.6);
    addTextOnRow(doc, 'APPL   : ', 1, 210.6);

    addTextOnRow(doc, 'REV. #           : ', 0, 398.6);
    addTextOnRow(doc, 'REV. DATE   : ', 1, 398.6);

    // Data
    doc.setFont(undefined, "normal");
    addTextOnRow(doc, `${specifications.pn}`, 1, 60);             // Part Number
    addTextOnRow(doc, `${specifications.application}`, 1, 265);   // Application
    addTextOnRow(doc, `${specifications.revision}`, 0, 485);      // Revision #
    addTextOnRow(doc, `${specifications.revision_date}`, 1, 485); // Revision date
  
    doc.line(22.6, 62, 586.7, 62);
  }
  function addSections(doc) {
    const titleSize = 12;
    const textSize = 10;
    const initialY = 100;
    const xPosition   = [[78, 230], [335, 490]];

    let y = initialY;
    let yGap = 13;
    let maxY = 737;
    let xIteration = 0;

    parametersSections.map((section)=>{
      if (specifications[section.key]) {
        doc.setFontSize(titleSize).setFont(undefined, "bold");

        if( (y+yGap) > maxY) {
          ;({ y, xIteration } = nextLine(doc, y, xIteration, yGap, maxY, initialY));
        }
        doc.text(`${section.name} ${section.parameters.length === 0? ' -  Test is On' : ''}`, xPosition[xIteration][0], y);

        ;({ y, xIteration } = nextLine(doc, y, xIteration, yGap, maxY, initialY));

        doc.setFontSize(textSize).setFont(undefined, "normal");
        section.parameters.map(parameter => {
          if(!(parameter.hide_if_missing && !specifications[parameter.key]) || specifications[parameter.key] === 0){
            doc.text(parameter.name, xPosition[xIteration][0], y);
            doc.text(`${parameter.is_boolean? (specifications[parameter.key]? 'YES' : 'NO') : specifications[parameter.key] }`, xPosition[xIteration][1], y);

            ;({ y, xIteration } = nextLine(doc, y, xIteration, yGap, maxY, initialY));
          }
        })

        ;({ y, xIteration } = nextLine(doc, y, xIteration, yGap, maxY, initialY));
      }
    })
  }
  function nextLine(doc, y, xIteration, yGap, maxY, initialY){
    y += yGap;

    if(y > maxY && xIteration == 1) {
      y = initialY;
      xIteration = 0;
      doc.addPage();
    }
    else if(y > maxY) {
      y = initialY;
      
      xIteration = 1;
    }

    return { y, xIteration };
  }

  return (
    <div className="w-full">
      <button
        onClick={handlerBubbleClick}
        className="transform hover:scale-125 hover:border rounded-full bg-blue-500 p-2 fixed bottom-4 right-4"
      >
        <PrintIcon className="fill-current text-white m-0 text-xl" />
      </button>
      {
        printing && 
        <Loader />
      }
    </div>
  );
};

export default PrintSpecificationsSheet;
