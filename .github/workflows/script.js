// 30-minute appointment slots from 10 AM to 7 PM
const timeSlots = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"
];

// Set default date to today in YYYY-MM-DD
const today = new Date().toISOString().split("T")[0];
document.getElementById("availDate").value = today;
document.getElementById("bookDate").value = today;

// Retrieve bookings from browser localStorage
function getBookings() {
  const data = localStorage.getItem("urbanCutsBookings");
  if (data) return JSON.parse(data);
  const sample = [
    { stylist: "Alex", date: today, time: "11:00 AM", name: "Rohan", service: "Haircut" },
    { stylist: "David", date: today, time: "02:00 PM", name: "Amit", service: "Beard Styling" }
  ];
  localStorage.setItem("urbanCutsBookings", JSON.stringify(sample));
  return sample;
}

// Check whether a slot is already booked
function isSlotBooked(stylist, date, time) {
  const bookings = getBookings();
  for (let i = 0; i < bookings.length; i++) {
    if (bookings[i].stylist === stylist && bookings[i].date === date && bookings[i].time === time) {
      return true;
    }
  }
  return false;
}

// Render slots: Green for Available, Red for Booked
function renderAvailability() {
  const stylist = document.getElementById("availStylist").value;
  const date = document.getElementById("availDate").value;
  const grid = document.getElementById("slotsContainer");
  const timeSelect = document.getElementById("bookTime");

  grid.innerHTML = "";
  timeSelect.innerHTML = '<option value="">Select Available Time Slot</option>';

  let firstAvailable = "";
  let availableCount = 0;

  for (let i = 0; i < timeSlots.length; i++) {
    const time = timeSlots[i];
    const booked = isSlotBooked(stylist, date, time);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "slot-btn " + (booked ? "booked" : "available");
    btn.textContent = time + (booked ? " (Booked)" : " (Open)");

    if (!booked) {
      availableCount++;
      if (!firstAvailable) firstAvailable = time;

      // Add to available time dropdown
      const opt = document.createElement("option");
      opt.value = time;
      opt.textContent = time;
      timeSelect.appendChild(opt);

      // Clicking an available slot pre-fills the booking form
      btn.addEventListener("click", function() {
        document.getElementById("bookStylist").value = stylist;
        document.getElementById("bookDate").value = date;
        document.getElementById("bookTime").value = time;
        document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
      });
    } else {
      btn.addEventListener("click", function() {
        alert("This slot with " + stylist + " on " + date + " is already booked!");
      });
    }
    grid.appendChild(btn);
  }

  // Update availability status and next available slot message
  const statusBadge = document.getElementById("availStatus");
  const nextSlotText = document.getElementById("nextSlotText");

  if (availableCount > 0) {
    statusBadge.textContent = "Slots Available (" + availableCount + ")";
    statusBadge.style.backgroundColor = "#16a34a";
    nextSlotText.textContent = "Next Slot: " + firstAvailable;
  } else {
    statusBadge.textContent = "Fully Booked";
    statusBadge.style.backgroundColor = "#dc2626";
    nextSlotText.textContent = "No slots available";
  }
}

// Handle appointment booking form submission
function handleBooking(event) {
  event.preventDefault();

  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const service = document.getElementById("bookService").value;
  const stylist = document.getElementById("bookStylist").value;
  const date = document.getElementById("bookDate").value;
  const time = document.getElementById("bookTime").value;

  if (!name || !phone || !service || !stylist || !date || !time) {
    alert("Please fill in all details before booking!");
    return;
  }

  // Prevent duplicate booking for same stylist, date and time
  if (isSlotBooked(stylist, date, time)) {
    alert("Duplicate booking prevented! " + stylist + " is already booked on " + date + " at " + time + ".");
    return;
  }

  // Save booking to localStorage
  const bookings = getBookings();
  bookings.push({ name: name, phone: phone, service: service, stylist: stylist, date: date, time: time });
  localStorage.setItem("urbanCutsBookings", JSON.stringify(bookings));

  // Sync controls and re-render slots immediately
  document.getElementById("availStylist").value = stylist;
  document.getElementById("availDate").value = date;
  renderAvailability();

  // Show booking confirmation
  alert("Booking Confirmed!\n\nName: " + name + "\nPhone: " + phone + "\nService: " + service + "\nStylist: " + stylist + "\nDate: " + date + "\nTime: " + time);

  document.getElementById("appointmentForm").reset();
  document.getElementById("bookDate").value = date;
}

// Event Listeners for interactive updates
document.getElementById("availStylist").addEventListener("change", renderAvailability);
document.getElementById("availDate").addEventListener("change", renderAvailability);
document.getElementById("appointmentForm").addEventListener("submit", handleBooking);

// Initial render on page load
renderAvailability();