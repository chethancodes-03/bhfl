import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './index.css'; 

const Form = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const preprocessJsonInput = (input) => {
    return input.replace(/“|”/g, '"');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const cleanedJsonInput = preprocessJsonInput(jsonInput);
      let parsedData;
      try {
        parsedData = JSON.parse(cleanedJsonInput);
      } catch (jsonErr) {
        throw new Error('Invalid JSON format');
      }
      if (!parsedData || !Array.isArray(parsedData.data)) {
        throw new Error('Invalid JSON format');
      }

      const res = await axios.post('http://localhost:3000/bfhl', parsedData);
      setResponse(res.data);
      console.log(res.data)
    } catch (err) {
      setResponse(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!response) return null;

    const options = selectedOptions.map(option => option.value);
    const dataToRender = {};

    if (options.includes('Alphabets')) dataToRender.alphabets = response.alphabets || [];
    if (options.includes('Numbers')) dataToRender.numbers = response.numbers || [];
    if (options.includes('Highest lowercase alphabet')) dataToRender.highest_lowercase_alphabet = response.highest_lowercase_alphabet || [];

    return (
      <div>
        <h3>Response Data:</h3>
        {Object.keys(dataToRender).length > 0 ? (
          <ul>
            {options.includes('Alphabets') && (
              <li>
                <strong>Alphabets:</strong> {dataToRender.alphabets.join(', ')}
              </li>
            )}
            {options.includes('Numbers') && (
              <li>
                <strong>Numbers:</strong> {dataToRender.numbers.join(', ')}
              </li>
            )}
            {options.includes('Highest lowercase alphabet') && (
              <li>
                <strong>Highest lowercase alphabet:</strong> {dataToRender.highest_lowercase_alphabet.join(', ')}
              </li>
            )}
          </ul>
        ) : (
          <p>No data to display. Please select options to view results.</p>
        )}
      </div>
    );
  };

  return (
    <div className="Index">
      <h1>{response ? 'Response' : 'Submit JSON Data'}</h1>
      <textarea
        rows="5"
        cols="50"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='{"data": ["A", "C", "z"]}'
      />
      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {error && <div className="error">{error}</div>}
      {response && (
        <div className="select-container">
          <Select
            isMulti
            options={[
              { value: 'Alphabets', label: 'Alphabets' },
              { value: 'Numbers', label: 'Numbers' },
              { value: 'Highest lowercase alphabet', label: 'Highest lowercase alphabet' }
            ]}
            onChange={handleSelectChange}
            placeholder="Select options"
          />
        </div>
      )}
      {renderResponse()}
    </div>
  );
};

export default Form;