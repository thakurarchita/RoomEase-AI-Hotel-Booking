const db = require("../database/connection");

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const fs = require('fs');
const calculateDynamicPrice = require('./calculateDynamicPrice');
let data;
fs.readFile('src/dynamic_pricing_data.json', 'utf8', (err, jsonData) => {
  if (err) {
      console.error("Error reading JSON file:", err);
      return;
  }
  data = JSON.parse(jsonData);
  console.log(data)
}
);

function calcPrice(roomType, basePrice, data) {
  const { season, deluxe_room_demand, standard_room_demand, suite_room_demand, competitorPrice, temperature, localEvent, isWeekend } = data;

  if (roomType === 'Deluxe') {
    console.log(roomType, basePrice, season, deluxe_room_demand, competitorPrice, temperature, localEvent, isWeekend);
    return calculateDynamicPrice(roomType, basePrice, season, deluxe_room_demand, competitorPrice, temperature, localEvent, isWeekend);
  } else if (roomType === 'Standard') {
    console.log(roomType, basePrice, season, standard_room_demand, competitorPrice, temperature, localEvent, isWeekend);
    return calculateDynamicPrice(roomType, basePrice, season, standard_room_demand, competitorPrice, temperature, localEvent, isWeekend);
  } else if (roomType === 'Suite') {
    console.log(roomType, basePrice, season, suite_room_demand, competitorPrice, temperature, localEvent, isWeekend);

    return calculateDynamicPrice(roomType, basePrice, season, suite_room_demand, competitorPrice, temperature, localEvent, isWeekend);
  } else {
    console.error("Invalid room type:", roomType);
    return basePrice; // Fallback to base price if the room type is invalid
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let rooms = "";

function getDateRange(startDate, endDate) {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1); // Increment by 1 day
  }

  return dateArray;
}


exports.getAllRooms = (req, res) => {
  const sqlQuery = "SELECT * FROM room";

  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Database query failed:", err.message);
      res.status(500).json({
        status: "fail",
        message: "Database query failed",
      });
    }

    rooms = results;
    
   rooms =  rooms.map((room)=>{
    const dynamicPrice = calcPrice(room.room_category, room.price, data)
    // console.log({...room, price:dynamicPrice})
    return {...room, price:dynamicPrice}
   })


    res
      .status(200)
      .json({ status: "success", requestedAt: req.requestTime, data: rooms });
  });
};

exports.getRoom = (req, res) => {
  const roomno = Number(req.params.roomno);
  const sqlRoomQuery = "SELECT * FROM room WHERE room_no = ?";
  let room = {};
  let unavailableDates = [];

  // db.query(sqlRoomQuery, [roomno], (err, results) => {
  //   if (err) {
  //     console.error("Database query failed:", err.message);
  //     res.status(404).json({
  //       status: "fail",
  //       message: `Room with no ${roomno} not found.`,
  //     });
  //   }

  //   // res
  //   //   .status(200)
  //   //   .json({ status: "success", data: results[0] });
  //   room = results[0];
  // });

  room = rooms.filter((el)=> {return el.room_no === roomno; console.log(el.id);})
  console.log('Room clicked', rooms);
  console.log('Room clicked', room);

  const sqlBookingQuery = "SELECT CheckinDate,CheckOutDate from bookings WHERE RoomNo = ? AND deleted_status = 'active'";

  db.query(sqlBookingQuery, [roomno], (err, results)=>{
    if (err) {
      console.error("Database query failed:", err.message);
      res.status(404).json({
        status: "fail",
        message: `Room with no ${roomno} not found.`,
      });
    }

    // console.log(results);
    function formatDateLocal(input) {
      const date = new Date(input);
      if (isNaN(date)) {
        throw new Error("Invalid date passed to formatDateLocal: " + input);
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    const bookings = results;
    bookings.forEach((booking)=>{
      unavailableDates = unavailableDates.concat(
        getDateRange(booking.CheckinDate, booking.CheckOutDate)
      );
    });

    unavailableDates = [...new Set(unavailableDates.map((date)=> formatDateLocal(date)))];
    console.log(unavailableDates)

    res
        .status(200)
        .json({ status: "success", data: {room, unavailableDates} });
  });
};
