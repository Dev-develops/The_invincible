const express = require("express");
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const { MONGO_URI } = require("./src/config/mongodb");

const app = express();

app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({limit: '50mb', extended: true}));
app.use(cookieParser());

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true,
  useFindAndModify:true
});

app.all('/*',(req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Set-Cookie, Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

const userRoutes = require("./src/routes/users");
const areaRoutes = require("./src/routes/area");
const zoneRoutes = require("./src/routes/zone");
const notificationRoutes = require("./src/routes/notification");
const projectRoutes = require("./src/routes/project");
const vendorRoutes = require("./src/routes/vendor");
const installationRoutes = require("./src/routes/installation");
const machineryRoutes = require("./src/routes/machinery");
const materialRoutes = require("./src/routes/materials");
const uploadRoutes = require("./src/routes/uploads");
const workProgressRoutes = require("./src/routes/workProgerss");
const techdocsRoutes = require("./src/routes/techdocs");

app.use(morgan("dev"));

// All end points
app.use(express.static(path.join(__dirname, "uploads")));

app.use("/users", userRoutes);
app.use("/areas", areaRoutes);
app.use("/zones", zoneRoutes);
app.use("/notifications", notificationRoutes);
app.use("/projects", projectRoutes);
app.use("/vendors", vendorRoutes);
app.use("/installations", installationRoutes);
app.use("/machinery", machineryRoutes);
app.use("/material", materialRoutes);
app.use("/uploads", uploadRoutes);
app.use("/workProgress", workProgressRoutes);
app.use("/techdocs", techdocsRoutes);

// Handling errors
app.use((req, res, next) => {
  const error = new Error("Not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
