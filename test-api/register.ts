fetch("http://localhost:3100/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: "your_username",
    password: "your_password",
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    // Handle response data here
  })
  .catch((error) => {
    console.error("Error:", error);
    // Handle errors here
  });
