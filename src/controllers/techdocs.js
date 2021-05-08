const mongoose = require("mongoose");
const Doc = require("../models/techdocs");
const fs = require("fs");

const path = "./uploads/techDocs/";

exports.getDocs = (req, res, next) => {
  Doc.find()
    .exec()
    .then((result) => res.status(201).json(result))
    .catch((err) =>
      res.status(500).json({
        error: err,
      })
    );
};

exports.deleteDocs = (req, res, next) => {
  Doc.deleteOne({ _id: req.params.id })
    .then((_) => {
      console.log(req.params.name);
      fs.unlink(`${path}${req.params.name}`, (err) => {
        if (err) {
          console.error(err);
          return;
        }

        //file removed
      });

      res.json({ message: "Document Removed Successfully!" });
    })
    .catch((error) => res.status(500).json({ error }));
};
