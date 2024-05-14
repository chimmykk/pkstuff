const accountSid = '';
const authToken = '';
const client = require('twilio')(accountSid, authToken);
const fetch = require('node-fetch');

// Fetch the JSON data from the endpoint
fetch('http://localhost:3000/api/attendanceaggr')
  .then(response => response.json())
  .then(data => {
    // Iterate over each object in the array
    data.forEach(item => {
  
      const phoneNumber = '+91' + item.phonenumber; // Add the prefix "+91"
      const messageBody = `English: ${item.attendance.English}, Python: ${item.attendance.Python}, JavaScript: ${item.attendance.JavaScript}, Data Structures: ${item.attendance['Data Structures']}, Cloud Computing: ${item.attendance['Cloud Computing']}, German/Tamil: ${item.attendance['German/Tamil']}`;

      // Send SMS using Twilio
      client.messages
        .create({
          body: messageBody,
          from: '+13236162578',
          to: phoneNumber
        })
        .then(message => console.log(`Message sent to ${phoneNumber}. SID: ${message.sid}`))
        .catch(error => console.error(`Error sending message to ${phoneNumber}:`, error));
    });
  })
  .catch(error => console.error('Error fetching data:', error));
