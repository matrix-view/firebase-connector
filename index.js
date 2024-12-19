const express = require("express");
const app = express();

const service = require("./src/service");
const { configuration } = service


app.get("/", (req, res) => {
    return res.send("Working!");
});

app.listen(configuration.port, () => {
    console.log("Initializing with configuration", configuration.env);
    console.log('Listening on port ' + configuration.port);
});