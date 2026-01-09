const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  initializeSeats,
  getSeatMap,
  lockSeat,
  confirmSeat
} = require("../controllers/SeatController");

router.post("/initialize", initializeSeats); // CREATE
router.get("/:showId", getSeatMap);           // READ
router.post("/lock", auth, lockSeat);         // UPDATE
router.post("/confirm", auth, confirmSeat);   // UPDATE

module.exports = router;
