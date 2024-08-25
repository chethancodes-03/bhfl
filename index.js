https://back-i9pr.onrender.com/

const express = require('express');
const cors = require('cors');  
const app = express();
const USER_ID = "john_doe_17091999";
const EMAIL = "john@xyz.com";
const ROLL_NUMBER = "ABCD123";
app.use(cors());
app.use(express.json());
app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ is_success: false, message: "Invalid input: 'data' should be an array" });
    }
    const numbers = [];
    const alphabets = [];
    const frequencyMap = {};
    for (const item of data) {
      if (typeof item === 'string' && !isNaN(item.trim())) {
        numbers.push(item.trim());
      } else if (typeof item === 'string' && /^[a-zA-Z]$/.test(item)) {
        alphabets.push(item);
        if (item === item.toLowerCase()) {
          frequencyMap[item] = (frequencyMap[item] || 0) + 1;
        }
      }
    }
    let highestLowercaseAlphabet = [];
    if (Object.keys(frequencyMap).length > 0) {
      const maxFrequency = Math.max(...Object.values(frequencyMap));
      highestLowercaseAlphabet = Object.keys(frequencyMap).filter(char => frequencyMap[char] === maxFrequency);
    }
    res.json({
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet
    });

  } catch (error) {
    console.error(error); 
    res.status(500).json({ is_success: false, message: "Internal server error" });
  }
});
app.get('/bfh1', (req, res) => {
  res.json({ operation_code: 1 });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port ${PORT}');
});
