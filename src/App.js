import React from 'react';

function App() {
  const handleAddDocument = () => {
    alert('Document upload triggered. (Connect to AWS Lambda in future)');
  };

  const handleSearch = () => {
    alert('Search triggered. (Connect to AWS Lambda in future)');
  };

  const handleLLMAnswer = () => {
    alert('LLM Answer triggered. (Connect to AWS Lambda in future)');
  };

  return (
    <div style={styles.container}>
      <h1>Research Management System</h1>
      <p>Welcome to the Research Management System. Use the buttons below to interact.</p>
      <button style={styles.button} onClick={handleAddDocument}>Add Document</button>
      <button style={styles.button} onClick={handleSearch}>Search</button>
      <button style={styles.button} onClick={handleLLMAnswer}>LLM Answer</button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
    fontFamily: 'Arial, sans-serif'
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

export default App;
