import React, { useState } from 'react';
import { pdfjs } from 'react-pdf';
import { Search, Upload, FileText, ChevronDown, BookOpen } from 'lucide-react';

// Configure the worker from CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const App = () => {
  const [pdfText, setPdfText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [llmFilter, setLlmFilter] = useState('All Documents');
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjs.getDocument(typedArray).promise;
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
    return textContent.items.map(item => item.str).join(' ');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Here you would implement the search functionality
    console.log(`Searching for: ${searchQuery}`);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const selectFilter = (filter) => {
    setLlmFilter(filter);
    setDropdownOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-md">
              <BookOpen className="h-8 w-8 text-blue-700" />
            </div>
            <h1 className="text-2xl font-bold">Research Management System</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search documents..."
                className="px-4 py-2 rounded-l-md border-0 focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-r-md flex items-center"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
            
            {/* Upload Button */}
            <label className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md cursor-pointer flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload</span>
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
            
            {/* Ask LLM Dropdown */}
            <div className="relative">
              <button 
                className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-md flex items-center space-x-2"
                onClick={toggleDropdown}
              >
                <span>Ask LLM</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <ul className="py-1">
                    <li 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectFilter('All Documents')}
                    >
                      All Documents
                    </li>
                    <li 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectFilter('Filter by Document')}
                    >
                      Filter by Document
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Document Viewer</h2>
            <span className="text-sm text-gray-500">Filter: {llmFilter}</span>
          </div>
          
          {pdfText ? (
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Extracted PDF Text
              </h3>
              <div className="bg-gray-50 p-4 rounded border h-96 overflow-auto font-mono text-sm whitespace-pre-wrap">
                {pdfText}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 mb-2">No document loaded</p>
              <p className="text-gray-500 text-sm">Upload a PDF file to view its content</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          © 2025 Research Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;