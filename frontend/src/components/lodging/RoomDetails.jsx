import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../../styles/room_details.css";

const RoomDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const storedRoomData =
    JSON.parse(localStorage.getItem("roomSelectedData")) || {};

  const {
    room_no: roomNo,
    room_category: category,
    adults,
    children,
    checkInDate,
    checkOutDate,
    price: rate,
  } = storedRoomData;

  const calculateTotalPrice = () => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    console.log("checkin", checkIn);
    const days = Math.max((checkOut - checkIn) / (1000 * 60 * 60 * 24), 1);
    return days * parseFloat(rate || 0);
  };

  const totalPrice = calculateTotalPrice();
  const taxesAndFees = totalPrice * 0.05;
  const grandTotal = totalPrice + taxesAndFees;

  const formattedRate = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(rate);

  const formattedTotalPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(totalPrice);

  const formattedTaxesAndFees = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(taxesAndFees);

  const formattedGrandTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(grandTotal);

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("user");
    return savedData
      ? JSON.parse(savedData)
      : {
          GuestID: "",
          GuestFName: "",
          GuestLName: "",
          GuestContactNo: "",
          GuestEmail: "",
          GuestAddress: "",
          GuestCity: "",
        };
  });

  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePayment = () => {
    const {
      GuestFName,
      GuestLName,
      GuestContactNo,
      GuestEmail,
      GuestAddress,
      GuestCity,
    } = formData;

    // Validation to ensure all fields are filled
    if (
      !GuestFName ||
      !GuestLName ||
      !GuestContactNo ||
      !GuestEmail ||
      !GuestAddress ||
      !GuestCity
    ) {
      setPopupVisible(true);
      return;
    }

    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(
      now.getHours()
    ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(
      now.getSeconds()
    ).padStart(2, "0")}`;

    const invoiceNumber = `INV-${timestamp}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`;

    const options = {
      key: "rzp_test_ypUZQmsPpyZrAR",
      amount: grandTotal * 100,
      currency: "INR",
      name: "Hotel Management",
      description: "Room Payment",
      handler: (response) => {
        navigate("/ramkrishna/lodging/bill", {
          state: {
            invoiceNumber,
            paymentDetails: response,
            roomDetails: storedRoomData,
            guestDetails: formData, // Pass the formData (contact information) to the backend
          },
        });
      },
      prefill: {
        name: `${GuestFName} ${GuestLName}`,
        email: GuestEmail,
        contact: GuestContactNo,
        address: GuestAddress, // Ensure address is included
        city: GuestCity, // Ensure city is included
      },
      theme: {
        color: "#c69963",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      alert(`Payment failed: ${response.error.description}`);
    });

    rzp.open();
  };

  const closePopup = () => setPopupVisible(false);

  return (
    <div className="myroom_p-room-details-container">
      <div className="myroom_p-room-info-container">
        <div className="myroom_p-card">
          <div className="myroom_p-room-image-container">
            <img
              src={`/assets/rooms/room${roomNo}.jpg`}
              alt="Room"
              className="myroom_p-room-image"
            />
          </div>
          <div className="myroom_p-room-info">
            <h2>RoomEase</h2>
            <p>
              <strong>Room No:</strong> {roomNo}
            </p>
            <p>
              <strong>Category:</strong> {category}
            </p>
            <p>
              <strong>Adults:</strong> {adults}
            </p>
            <p>
              <strong>Children:</strong> {children}
            </p>
            <p>
              <strong>Check-in Date:</strong>{" "}
              {new Date(checkInDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Check-out Date:</strong>{" "}
              {new Date(checkOutDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="myroom_p-price-summary">
          <h3>Price Summary</h3>
          <p>
            <strong>Rate per Day:</strong> {formattedRate}
          </p>
          <p>
            <strong>Total Price:</strong> {formattedTotalPrice}
          </p>
          <p>
            <strong>Taxes & Fees (5%):</strong> {formattedTaxesAndFees}
          </p>
          <p>
            <strong>Grand Total:</strong> {formattedGrandTotal}
          </p>
          <button onClick={handlePayment}>Pay Now</button>
        </div>
      </div>

      <div
        className="myroom_p-guest-details-container"
        style={{
          width: "75%",
          minHeight: "800px",
          padding: "50px",
          margin: "50px auto", // Increased margin from the top
        }}
      >
        <form>
          <h2
            style={{
              color: "white",
              textDecoration: "none",
              marginBottom: "25px", // Increased space below title
            }}
          >
            Contact Information
          </h2>
          <p
            style={{
              marginBottom: "40px", // Increased space below the subtitle
              fontSize: "18px",
              color: "#C19A6B",
            }}
          >
            <Link
              to="/sign-in"
              className="myroom_p-sign-in-link"
              style={{
                textDecoration: "none",
                fontWeight: "bold",
                color: "#C19A6B",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#e74c3c")} // Change to gold on hover
              onMouseLeave={(e) => (e.target.style.color = "#C19A6B")} // Revert to original color
            ></Link>{" "}
          </p>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "48%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "20px",
                }}
              >
                <label
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="GuestFName"
                  value={formData.GuestFName || ""}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  style={{
                    width: "100%", // Full width
                    height: "45px",
                    padding: "10px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                />
              </div>
            </div>

            <div style={{ flex: 1, minWidth: "48%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "20px",
                }}
              >
                <label
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="GuestLName"
                  value={formData.GuestLName || ""}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  style={{
                    width: "100%", // Full width
                    height: "45px",
                    padding: "10px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                />
              </div>
            </div>
          </div>

          {["GuestContactNo", "GuestEmail", "GuestAddress", "GuestCity"].map(
            (fieldName, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "20px",
                }}
              >
                <label
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                </label>
                <input
                  type="text"
                  name={fieldName}
                  value={formData[fieldName] || ""}
                  onChange={handleInputChange}
                  placeholder={
                    fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
                  }
                  style={{
                    width: "100%", // Full width
                    height: "45px",
                    padding: "10px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                />
              </div>
            )
          )}
        </form>
      </div>

      {isPopupVisible && (
        <div className="myroom_p-popup">
          <div className="myroom_p-popup-content">
            <p>All fields are required. Please fill out all the fields.</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
