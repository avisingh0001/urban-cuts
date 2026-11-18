// Store booked slots to prevent double booking
const bookedSlots = [];

function handleBooking(event) {
  event.preventDefault();

  // Read inputs using getElementById
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const service = document.getElementById("serviceSelect").value;
  const stylist = document.getElementById("stylistSelect").value;
  const date = document.getElementById("bookDate").value;
  const time = document.getElementById("bookTime").value;

  // Validation: ensure no field is empty
  if (name === "" || phone === "" || service === "" || stylist === "" || date === "" || time === "") {
    alert("Please fill in all details before booking!");
    return;
  }

  // Create unique slot identifier
  const slotKey = stylist + " on " + date + " at " + time;

  // Check if slot is already booked
  if (bookedSlots.includes(slotKey)) {
    alert("Slot unavailable! " + stylist + " is already booked on " + date + " at " + time + ". Please choose another slot.");
  } else {
    bookedSlots.push(slotKey);
    let msg = "Booking Confirmed!\nName: " + name + "\nService: " + service + "\nStylist: " + stylist + "\nDate: " + date + "\nTime: " + time;
    alert(msg);
    document.getElementById("appointmentForm").reset();
  }
}

// Attach event listener
const bookingForm = document.getElementById("appointmentForm");
bookingForm.addEventListener("submit", handleBooking);