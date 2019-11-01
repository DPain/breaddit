# breaddit
Your daily dose of bread memes.

## Sending OAuth token from client to server
This is how you send requests with the firebase jwt token appended in the Authorization header.
```javascript
async function request(bool) {
  var test = {
    'vote': bool
  };
  let token = await firebase.auth().currentUser.getIdToken();

  let val = await fetch('http://localhost:5001/breaddit-885b4/us-central1/api/karma/comment/-LrzMy3yhYJfR6mefUaN', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(test)
    })
    .then((resp) => resp.text()); // Gets raw response. 

  console.log(val);
}
```