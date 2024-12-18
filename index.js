const express = require("express");
const app = express();

app.get("/", function(req, res) {
    return res.send("Working!");
});

app.listen(80, function(){
    console.log('Listening on port 80');
});