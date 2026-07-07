import { useEffect, useState } from "react";
import "../../styles/room_style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Rooms() {
  const navigate = useNavigate();

  function goToRoom(roomno) {
    navigate(`/ramkrishna/lodging/rooms/${roomno}`);
  }

  const [rooms, setRooms] = useState([
    { id: 1, name: "Room 001", price: 700, capacity: 2, img: "room001" },
    { id: 2, name: "Room 002", price: 1000, capacity: 4, img: "room002" },
    { id: 3, name: "Room 003", price: 1500, capacity: 8, img: "room003" },
    { id: 4, name: "Room 004", price: 2000, capacity: 12, img: "room004" },
  ]);

  const [guestsNumFilter, setGuestsNumFilter] = useState(0);

  useEffect(() => {
    console.log("Fetching rooms data...");
    axios
      .get("http://127.0.0.1:8000/ramkrishna/lodging/rooms")
      .then((response) => {
        console.log("Room No", response.data.data.room);
        setRooms(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  }, []);

  function handleGuestsNum(selectedNum) {
    // console.log(selectedNum);
    setGuestsNumFilter(selectedNum);
  }

  const filteredRooms = rooms.filter(
    (room) => guestsNumFilter === 0 || room.capacity >= guestsNumFilter
  );

  console.log(filteredRooms);

  return (
    <div className="main">
      <div className="room-page">
        <div className="guest-selection">
          <GuestSelection
            onGuestsNum={handleGuestsNum}
            guestsNumFilter={guestsNumFilter}
          />
        </div>

        <div className="rooms-cards-grid">
          {/* <RoomCard /> */}
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.room_no}
              roomNo={room.room_no}
              roomImg={room.img}
              roomName={room.room_category}
              roomPrice={room.price}
              roomCapacity={room.capacity}
              goToRoom={goToRoom}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function GuestSelection({ onGuestsNum, guestsNumFilter }) {
  const options = [
    { num: 0, label: "All rooms" },
    { num: 3, label: "3 guests" },
    { num: 5, label: "5 guests" },
    { num: 7, label: "7 guests" },
  ];

  return (
    <div>
      {options.map((option) => (
        <GuestButton
          key={option.num}
          num={option.num}
          onGuestsNum={onGuestsNum}
          guestsNumFilter={guestsNumFilter}
        >
          {option.label}
        </GuestButton>
      ))}
    </div>
  );
}

function Button({
  children,
  classes = "",
  onClick,
  style = { fontWeight: 500 },
}) {
  return (
    <button className={`btn ${classes}`} onClick={onClick} style={style}>
      {children}
    </button>
  );
}

function GuestButton({ children, guestsNumFilter, onGuestsNum, num }) {
  const isSelected = guestsNumFilter === num;

  function handleGuestNum() {
    onGuestsNum(num);
  }

  return (
    <Button
      classes={`${isSelected ? "selected" : ""}`}
      onClick={handleGuestNum}
    >
      {children}
    </Button>
  );
}

function RoomCard({
  roomImg,
  roomName,
  roomPrice,
  roomCapacity,
  roomNo,
  goToRoom,
}) {
  return (
    <div className="room-card">
      <RoomCardImg roomImg={`room${roomNo}`} />

      <div className="room-card-info">
        <RoomCardDetails
          roomName={roomName}
          roomPrice={roomPrice}
          roomCapacity={roomCapacity}
        />
        <RoomCardButton roomNo={roomNo} goToRoom={goToRoom} />
      </div>
    </div>
  );
}

function RoomCardImg({ roomImg = "room002" }) {
  return <img src={`/assets/rooms/${roomImg}.jpg`} alt={roomImg} />;
}

function RoomCardDetails({ roomName, roomPrice, roomCapacity }) {
  return (
    <div className="room-card-info-details">
      <RoomCardHeading roomName={roomName} />
      <RoomCardGuestNum roomCapacity={roomCapacity} />
      <RoomCardPrice roomPrice={roomPrice} />
    </div>
  );
}

function RoomCardHeading({ roomName = "Room 001" }) {
  return <h3>{roomName}</h3>;
}

function RoomCardGuestNum({ roomCapacity = 2 }) {
  return (
    <div className="room-car-guestnum">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="#4c6b8a"
        aria-hidden="true"
        data-slot="icon"
      >
        <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z"></path>
      </svg>

      <p>
        For up to <span style={{ fontWeight: 700 }}>{roomCapacity}</span> guests
      </p>
    </div>
  );
}

function RoomCardPrice({ roomPrice = 700 }) {
  return (
    <div className="room-card-price">
      <span style={{ fontSize: "36px" }}>₹ {roomPrice} </span>
      <span>/ night</span>
    </div>
  );
}

function RoomCardButton({ roomNo, goToRoom }) {
  return (
    <>
      <div></div>
      <div className="room-card-btn">
        <Button
          classes="details-btn"
          onClick={() => {
            goToRoom(roomNo);
          }}
        >
          Details &amp; reservation &rarr;
        </Button>
      </div>
    </>
  );
}
