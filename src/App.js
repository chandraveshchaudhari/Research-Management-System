import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function App() {
  const [pdfText, setPdfText] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let text = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const pageText = await extractTextFromPage(page);
          text += pageText + '\n\n';
        }

        setPdfText(text);
      };

      reader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const extractTextFromPage = async (page) => {
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    return pageText;
  };

  return (
    <div style={styles.container}>
      <h1>Research Management System</h1>
      <p>Welcome to the Research Management System.</p>

      <div>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
      </div>

      <div style={styles.textContainer}>
        <h2>Extracted PDF Text:</h2>
        <textarea style={styles.textArea} value={pdfText} readOnly />
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  textContainer: {
    marginTop: '20px',
    textAlign: 'left',
    maxWidth: '800px',
    margin: '0 auto',
  },
  textArea: {
    width: '100%',
    height: '300px',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    overflow: 'auto',
  },
};

export default App;
