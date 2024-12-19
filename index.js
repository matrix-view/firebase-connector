const express = require("express");
const app = express();

const service = require("./src/service");

const { configuration } = service

const context = {
    configuration,
    service
}


app.get("/", (req, res) => {
    return res.send("Working!");
});

app.listen(configuration.port, () => {
    console.log("Initializing with configuration", configuration.env);
    console.log('Listening on port ' + configuration.port);
});

const main = async () => {
    console.log("Starting...")
    try {
        await service.firebaseService.watchCollections(context)
    } catch (e) {
        console.error(e)
        throw e
    }
    console.log('Finished starting!')
}

// Main startup
main().catch((err) => console.error('Process terminated with error', err));
