import React, { useEffect, useState } from "react";
import room1 from "/assets/rooms/room1.jpg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/room_style.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function getDateRange(startDate, endDate) {
  // const dateArray = [];
  // let currentDate = new Date(startDate);

  // while (currentDate <= new Date(endDate)) {
  //   dateArray.push(new Date(currentDate));
  //   currentDate.setDate(currentDate.getDate() + 1); // Increment by 1 day
  // }

  // return dateArray;
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  // Calculate difference in days
  const timeDiff = end - start;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

export default function SingleRoom() {
  const { roomno } = useParams();
  console.log(roomno);

  const [room, setRoom] = useState(null);

  const [unavailableDates, setUnavailableDates] = useState([
    new Date("2025-01-02"),
  ]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    console.log("Starting to fetch room");

    axios
      .get(`http://127.0.0.1:8000/ramkrishna/lodging/rooms/${roomno}`)
      .then((response) => {
        console.log(response);
        setRoom(response.data.data.room[0]);

        const formattedDates = response.data.data.unavailableDates.map(
          (date) => new Date(date).toISOString().split("T")[0]
        );
        const dateObjects = formattedDates.map((date) => new Date(date));
        setUnavailableDates(dateObjects);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error occurred:", e.message);
      });
  }, [roomno]); //Re-run when room no changes

  console.log("Room Name", room);
  console.log("Unavailable dates", unavailableDates);

  // Below are used in calendars
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const navigate = useNavigate();

  const handleRoomClick = (roomData) => {
    const roomSelectedData = {
      ...room,
      checkInDate,
      checkOutDate,
      adults,
      children,
    };

    localStorage.setItem("roomSelectedData", JSON.stringify(roomSelectedData));

    navigate("/ramkrishna/lodging/rooms/room-details"); // Navigate without state

    // navigate("/ramkrishna/lodging/rooms/room-details", {
    //   state: {
    //     roomSelectedData, // Pass the selected room's data to the next page
    //   },
    // });
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="main">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "48px",
          alignItems: "center",
        }}
      >
        <SingleRoomBox room={room} />
        <div>
          <h1 style={{ fontSize: "48px", color: "#D2AF84" }}>
            Reserve this room today.
          </h1>
        </div>
        <SingleRoomInputs
          unavailableDates={unavailableDates}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          setCheckInDate={setCheckInDate}
          setCheckOutDate={setCheckOutDate}
          adults={adults}
          children={children}
          setAdults={setAdults}
          setChildren={setChildren}
          room={room}
          handleRoomClick={handleRoomClick}
        />
      </div>
    </div>
  );
}

function SingleRoomBox({ room }) {
  return (
    <div className="single-room">
      <SingleRoomImage roomImg={room.room_no} />
      <SingleRoomDetails room={room} />
    </div>
  );
}

function SingleRoomImage({ roomImg }) {
  return (
    <div
      className="single-room-img-box"
      style={{ width: "70%", overflowX: "hidden" }}
    >
      <img
        src={`/assets/rooms/room${roomImg}.jpg`}
        alt={"roomName"}
        style={{ transform: "translateX(-20%)" }}
      />
    </div>
  );
}

function SingleRoomDetailsHeading({ roomName = "Room 001" }) {
  return (
    <div className="single-room-heading">
      <h1>{roomName}</h1>
    </div>
  );
}

function SingleRoomDetails({ room }) {
  return (
    <div className="single-room-details">
      <SingleRoomDetailsHeading roomName={room.room_category} />
      <SingleRoomDetailsDescription roomFeatures={room.features} />
      <SingleRoomDetailsAmenities room={room} />
    </div>
  );
}

function SingleRoomDetailsDescription({ roomFeatures }) {
  return (
    <div
      style={{ maxWidth: "108rem", textAlign: "left", marginBottom: "24px" }}
    >
      <span>
        {/* Discover the ultimate luxury getaway for couples in the cozy wooden
        cabin 001. Nestled in a picturesque forest, this stunning cabin offers a
        secluded and intimate retreat. Inside, enjoy modern high-quality wood
        interiors, a comfortable seating area, a fireplace and a fully-equipped
        kitchen. The plush king-size bed, dressed in fine linens guarantees a
        peaceful nights sleep. */}
        {roomFeatures}
      </span>
    </div>
  );
}

function SingleRoomDetailsAmenities({ room }) {
  return (
    <div>
      <ul>
        <li>
          <ion-icon name="people"></ion-icon>
          <span>
            For upto <b>{room.capacity}</b> guests
          </span>
        </li>
        <li>
          <ion-icon name="location"></ion-icon>
          <span>
            Located in <b>India</b>
          </span>
        </li>
        <li>
          <ion-icon name="close-outline"></ion-icon>
          <span>{room.policies}</span>
        </li>
      </ul>
    </div>
  );
}

function SingleRoomInputs({
  unavailableDates,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
  adults,
  children,
  setAdults,
  setChildren,
  room,
  handleRoomClick,
}) {
  return (
    <div className="single-room">
      <SingleRoomCalendarsTotalPrice
        unavailableDates={unavailableDates}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        setCheckInDate={setCheckInDate}
        setCheckOutDate={setCheckOutDate}
        room={room}
      />
      <SingleRoomGuestsInput
        room={room}
        adults={adults}
        children={children}
        setAdults={setAdults}
        setChildren={setChildren}
        handleRoomClick={handleRoomClick}
      />
    </div>
  );
}

function SingleRoomCalendarsTotalPrice({
  unavailableDates,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
  room,
}) {
  return (
    <div className="single-room-calendars-total-price">
      <div style={{ borderRight: "1px solid #2c3d4f", paddingTop: "48px" }}>
        <Calendars
          unavailableDates={unavailableDates}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          setCheckInDate={setCheckInDate}
          setCheckOutDate={setCheckOutDate}
        />
        <SingleRoomPriceDetails
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          room={room}
        />
      </div>
    </div>
  );
}

function SingleRoomPriceDetails({
  room,
  roomPrice = room.price,
  checkInDate,
  checkOutDate,
}) {
  console.log("Room Price", room.price);
  let noOfDays = null;
  if (checkInDate !== null && checkOutDate !== null) {
    noOfDays = getDateRange(checkInDate, checkOutDate);
  }
  console.log(noOfDays);
  return (
    <div className="single-room-price-details">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexGrow: "1",
        }}
      >
        <div>
          <span>₹ {roomPrice} </span>
          <span style={{ fontSize: "16px" }}>/ night</span>
        </div>
        {noOfDays && (
          <>
            <div style={{ backgroundColor: "#B78343", padding: "2px 8px" }}>
              x {noOfDays}
            </div>
            <div style={{ fontWeight: "700", fontSize: "20px" }}>
              <span>TOTAL</span>
              <span>₹ {roomPrice * noOfDays}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AdultInputFields({ children, maxGuests, guests, setGuests }) {
  const len = maxGuests || 4;
  console.log("guests", guests);

  return (
    <div className="single-input">
      <label>{children}</label>
      <select
        onChange={(e) => setGuests(e.target.value)}
        required
        value={guests}
      >
        {Array.from({ length: len }, (_, i) => i + 1).map((num) => {
          return (
            <option value={num} key={num}>
              {num}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function ChildrenInputFields({ children, maxGuests, guests, setGuests }) {
  const len = (maxGuests || 4) + 1; // Keep original length calculation

  return (
    <div className="single-input">
      <label>{children}</label>
      <select
        onChange={(e) => setGuests(e.target.value)}
        required
        value={guests}
      >
        {Array.from({ length: len }, (_, i) => i).map((num) => {
          return (
            <option value={num} key={num}>
              {num}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function SingleRoomGuestsInput({
  room,
  adults,
  children,
  setAdults,
  setChildren,
  handleRoomClick,
}) {
  return (
    <div className="single-room-guests-input">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          padding: "48px",
        }}
      >
        <AdultInputFields
          guests={adults}
          setGuests={setAdults}
          maxGuests={room.capacity}
        >
          Adults
        </AdultInputFields>
        <ChildrenInputFields guests={children} setGuests={setChildren}>
          Children
        </ChildrenInputFields>
      </div>
      <Buttons handleRoomClick={handleRoomClick} />
    </div>
  );
}

function Buttons({ handleRoomClick }) {
  const navigate = useNavigate();
  function goToRooms() {
    navigate("/ramkrishna/lodging/rooms");
  }

  return (
    <div className="single-room-btns">
      <button onClick={goToRooms}>Back</button>
      <button onClick={handleRoomClick}>Next</button>
    </div>
  );
}

function Calendars({
  unavailableDates,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
}) {
  // Function to strip time from a date
  const stripTime = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // Check if a date is unavailable
  const isDateUnavailable = (date) => {
    return unavailableDates.some(
      (unavailableDate) =>
        stripTime(unavailableDate).getTime() === stripTime(date).getTime()
    );
  };

  // Assign class to grayed-out dates
  const dayClassName = (date) => {
    return isDateUnavailable(date) || date < today ? "grayed-out" : undefined;
  };

  // Function to handle Check-Out date selection
  const handleCheckOutChange = (date) => {
    // Disable Check-Out dates before the selected Check-In date
    if (checkInDate && date <= checkInDate) {
      return;
    }
    setCheckOutDate(date);
  };

  const today = new Date();
  console.log("today", today);
  today.setHours(0, 0, 0, 0);

  return (
    <div
      className="calendars-flex"
      style={{
        display: "flex",
        gap: "48px",
        marginBottom: "32px",
        paddingLeft: "48px",
        paddingRight: "48px",
      }}
    >
      <div>
        <p style={{ color: "#c69963", marginBottom: "20px", fontSize: "16px" }}>
          Select a Check-In Date:
        </p>
        <DatePicker
          selected={checkInDate}
          onChange={(date) => setCheckInDate(date)}
          dayClassName={dayClassName}
          filterDate={(date) => date >= today && !isDateUnavailable(date)} // Disable previous dates
          inline
          calendarClassName="custom-calendar"
        />
      </div>
      <div>
        <p style={{ color: "#c69963", marginBottom: "20px", fontSize: "16px" }}>
          Select a Check-Out Date:
        </p>
        <DatePicker
          selected={checkOutDate}
          onChange={handleCheckOutChange}
          dayClassName={dayClassName}
          filterDate={(date) => {
            // Disable previous dates and ensure date is after Check-In
            return (
              date >= today && date > checkInDate && !isDateUnavailable(date)
            );
          }}
          inline
          calendarClassName="custom-calendar"
        />
      </div>
      <style>
        {`.custom-calendar {
  font-size: 1.5rem;
  width: 100%;
}

.react-datepicker {
  width: 100%; 
}

.react-datepicker__day,
.react-datepicker__day-name {
  width: 3rem; 
  line-height: 3rem;
}

.react-datepicker__header {
  font-size: 1.5rem;
}
  .custom-calendar .react-datepicker { background-color: #141c24;  }

`}
      </style>
    </div>
  );
}
