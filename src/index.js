import dotenv from "dotenv";
import express from "express";
import bodyPaser from "body-parser";


import { json, urlencoded } from "express";
import path from "path";

const __dirname = path.resolve();

import passportADRouter from "./routes/passport.js";
import userADRouter from "./routes/logout.js";
import requireAut from "./middleware/authmiddelware.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// register view engine

app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');
const port = process.env.PORT || 4500;

app.use(json());
app.use(bodyPaser.json());
app.use(cookieParser())
// app.use(urlencoded({ extended: true }));

app.get('/', requireAut, (req, res) => {
    res.render('pickup');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.use(
    "/api/",
    passportADRouter,
    userADRouter
);

app.use((req, res) => {
    res.status(404).render('404');
})



app.listen(port, () => console.log(`listening on:${port}`));
