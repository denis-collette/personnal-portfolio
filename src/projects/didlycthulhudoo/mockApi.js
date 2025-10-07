// This file simulates the data that the backend would normally provide.

const mockEvents = [
  {
    id: "evt_1",
    author: "H.P. Lovecraft",
    title: "Book Club: 'The Call of Cthulhu'",
    description: "Join us for a reading and discussion of the classic tale. Sanity optional.",
    dates: ["2025-10-28T19:00", "2025-11-04T19:00"],
    attendances: [
      { name: "August Derleth", available: [true, false] },
      { name: "Robert Bloch", available: [true, true] }
    ]
  },
  {
    id: "evt_2",
    author: "Dr. Armitage",
    title: "Study Group for the Necronomicon",
    description: "Advanced reading group. Please bring your own copy.",
    dates: ["2025-10-31T23:59"],
    attendances: [
      { name: "Wilbur Whateley", available: [true] }
    ]
  },
  {
    id: "evt_3",
    author: "Miskatonic University",
    title: "Guest Lecture: The Colour Out of Space",
    description: "A presentation by the Geology department on the strange meteorite from '93. Protective eyewear recommended.",
    dates: ["2025-11-12T18:00"],
    attendances: [
      { name: "Dr. Armitage", available: [true] },
      { name: "Prof. Dyer", available: [false] }
    ]
  },
  {
    id: "evt_4",
    author: "The Esoteric Order of Dagon",
    title: "Innsmouth Community Fish Fry",
    description: "All are welcome. Do not mind the locals' distinct appearance.",
    dates: ["2025-11-15T13:00", "2025-11-16T13:00"],
    attendances: [
      { name: "Robert Olmstead", available: [true, true] }
    ]
  }
];

// This function mimics fetching the list of all events.
export function fetchEvents() {
  return new Promise(resolve => {
    setTimeout(() => resolve([...mockEvents]), 500); // Simulate network delay
  });
}

// This function mimics fetching a single event by its ID.
export function fetchEventById(id) {
  return new Promise(resolve => {
    const event = mockEvents.find(e => e.id === id);
    setTimeout(() => resolve(event ? { ...event } : null), 500);
  });
}