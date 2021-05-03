const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/db.config');

const app = express();

var corsOrigin = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOrigin));

//parse requests dla content-type = application/json
app.use(express.json());

//parse requests dla content-type = application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//łączymy się z bazą danych:
const db = require('./models');
const Role = db.role;


db.mongoose
    .connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected with MongoDB");
        initial();
    })
    .catch(error => {
        console.error('Connection error: ', error);
        process.exit();
    });


app.get('/', (req, res) => {
    res.json({ message: 'Hello in News World Service API' });
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/article.routes')(app);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is working on port ${port}`)
});


function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            });


            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });


            new Role({
                name: "blocked"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'blocked' to roles collection");
            });
        }
    });
}