// Mock data = fake data we use during development.
// We use it before backend APIs are ready so we can build the UI and routing now.
//
// imageUrl: Unsplash URLs with crop/size params so images load reliably in the browser.
// Later you can swap these for your own hosted assets.

export const mockEvents = [
  {
    id: '1',
    title: 'Nile Nights Live',
    category: 'Music',
    venue: 'Cairo Opera House',
    date: '2026-06-12',
    time: '20:00',
    description: 'An evening of contemporary Egyptian bands with a Nile-side vibe.',
    ticketPrice: 450,
    availableTickets: 120,
    imageUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    averageRating: 4.6,
  },
  {
    id: '2',
    title: 'Startup Pitch Night Cairo',
    category: 'Business',
    venue: 'The Greek Campus',
    date: '2026-06-18',
    time: '18:30',
    description: 'Founders pitch, investors network, and startup stories from Egypt.',
    ticketPrice: 200,
    availableTickets: 80,
    imageUrl:
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80',
    averageRating: 4.3,
  },
  {
    id: '3',
    title: 'Alexandria Street Food Festival',
    category: 'Food',
    venue: 'Bibliotheca Alexandrina',
    date: '2026-06-25',
    time: '16:00',
    description: 'Local vendors, signature dishes, and a weekend of Egyptian flavors.',
    ticketPrice: 150,
    availableTickets: 300,
    imageUrl:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    averageRating: 4.5,
  },
  {
    id: '4',
    title: 'React & Frontend Meetup',
    category: 'Technology',
    venue: 'New Cairo Expo Center',
    date: '2026-07-02',
    time: '19:00',
    description: 'Talks, lightning demos, and networking for frontend developers.',
    ticketPrice: 100,
    availableTickets: 200,
    imageUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    averageRating: 4.2,
  },
  {
    id: '5',
    title: 'ZED Park 5K Fun Run',
    category: 'Sports',
    venue: 'ZED Park',
    date: '2026-07-10',
    time: '07:30',
    description: 'A friendly 5K for runners of all levels. Bring your friends and family.',
    ticketPrice: 120,
    availableTickets: 500,
    imageUrl:
      'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80',
    averageRating: 4.4,
  },
  {
    id: '6',
    title: 'Downtown Art Walk',
    category: 'Art',
    venue: 'Downtown Cairo',
    date: '2026-07-15',
    time: '17:00',
    description: 'Gallery hopping, pop-up exhibits, and artist meet-and-greets.',
    ticketPrice: 75,
    availableTickets: 220,
    imageUrl:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    averageRating: 4.1,
  },
  {
    id: '7',
    title: 'Stand-up Night: Cairo Comedy Club',
    category: 'Comedy',
    venue: 'Downtown Cairo',
    date: '2026-07-22',
    time: '21:00',
    description: 'A lineup of local comedians with fresh sets and crowd work.',
    ticketPrice: 250,
    availableTickets: 90,
    imageUrl:
      'https://images.unsplash.com/photo-1520975958225-35a4b2c6f0f4?auto=format&fit=crop&w=800&q=80',
    averageRating: 4.0,
  },
  {
    id: '8',
    title: 'Classic Theatre: The Nile Stage',
    category: 'Theatre',
    venue: 'Cairo Opera House',
    date: '2026-08-01',
    time: '19:30',
    description: 'A classic theatre performance with a modern Egyptian twist.',
    ticketPrice: 500,
    availableTickets: 60,
    imageUrl:
      'https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?auto=format&fit=crop&w=800&q=80',
    averageRating: 4.7,
  },
]

