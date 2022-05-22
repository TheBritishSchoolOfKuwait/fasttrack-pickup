import dotenv from "dotenv";
import express from "express";
import bodyPaser from "body-parser";
import passportADRouter from "./routes/passport.js";
import userADRouter from "./routes/logout.js";
import requireAuth from "./middleware/authMiddelware.js";
import cookieParser from "cookie-parser";
import { json, urlencoded } from "express";
import path from "path";
import { fileURLToPath } from "url";
import ftPickupRouter from "./routes/pickup.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const __dirname = path.resolve();
console.log(__dirname);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// register view engine

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

const port = process.env.PORT || 4500;

app.use(json());
app.use(bodyPaser.json());
app.use(cookieParser());
// app.use(urlencoded({ extended: true }));

app.get("/", requireAuth, (req, res) => {
  res.render("pickup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.use("/api/", passportADRouter, userADRouter, ftPickupRouter);

app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(port, () => console.log(`listening on:${port}`));
