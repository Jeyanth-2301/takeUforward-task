const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "takeuforward",
});

app.get("/", (re, res) => {
  return res.json("Hola Amigo!");
});

app.get("/bannerInfo", (re, res) => {
  const sql =
    "SELECT * from banner where id='f44b09b1-580e-11ef-9ffe-902e16f011ee'";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

const processingBannerUpdateRequest = (
  userId,
  description,
  timer,
  visible,
  link
) => {
  const user_id = userId;
  const description_formatted = description.trim();
  const timer_mins = timer;
  let visibility = 0;
  if (visible === true) {
    visibility = 1;
  }
  const redirect_link = link.trim();
  return {
    user_id,
    description_formatted,
    redirect_link,
    timer_mins,
    visibility,
  };
};

app.post("/updateBannerInfo", (req, res) => {
  const { userId, description, timer, visible, link } = req.body;

  if (!userId || !description || !timer || !visible || !link) {
    return res.status(400).json({ message: "Missing required fields" }); // TODO: need to specify the missing field
  }
  const processedRequest = processingBannerUpdateRequest(
    userId,
    description,
    timer,
    visible,
    link
  );

  const sql =
    "UPDATE banner SET visibility = ?, redirect_link = ?, description = ?, timer = ? WHERE user_id = ?";
    
  db.query(
    sql,
    [
      processedRequest.visibility,
      processedRequest.redirect_link,
      processedRequest.description_formatted,
      processedRequest.timer_mins,
      processedRequest.user_id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating banner:", err);
        return res
          .status(500)
          .json({ message: "Error updating banner", error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Banner not found" });
      }

      return res.json({ message: "Banner Updated successfully" });
    }
  );
});

app.listen(8081, () => {
  console.log("listening");
});
