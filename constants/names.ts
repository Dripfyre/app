/**
 * List of 200 short, modern names for random selection
 */
export const MODERN_NAMES = [
  'Alex', 'Avery', 'Blake', 'Casey', 'Charlie',
  'Dakota', 'Drew', 'Emerson', 'Finley', 'Gray',
  'Harper', 'Hayden', 'Hunter', 'Indigo', 'Jade',
  'Jordan', 'Jules', 'Kai', 'Kennedy', 'Lane',
  'Logan', 'Lux', 'Max', 'Morgan', 'Noah',
  'Parker', 'Quinn', 'Reese', 'Riley', 'River',
  'Rowan', 'Ryan', 'Sage', 'Sawyer', 'Skyler',
  'Taylor', 'Wren', 'Zion', 'Aria', 'Bella',
  'Chloe', 'Daisy', 'Elle', 'Emma', 'Faye',
  'Grace', 'Hazel', 'Ivy', 'June', 'Kate',
  'Luna', 'Maya', 'Mia', 'Nina', 'Olive',
  'Paige', 'Rose', 'Ruby', 'Sara', 'Skye',
  'Tess', 'Vera', 'Willow', 'Zara', 'Aiden',
  'Asher', 'Atlas', 'Beck', 'Bodhi', 'Beau',
  'Cade', 'Cole', 'Cruz', 'Dash', 'Dean',
  'Eli', 'Ezra', 'Felix', 'Finn', 'Gage',
  'Grayson', 'Hudson', 'Jace', 'Jasper', 'Jax',
  'Knox', 'Leo', 'Levi', 'Liam', 'Luke',
  'Mason', 'Milo', 'Nash', 'Nico', 'Owen',
  'Phoenix', 'Rhys', 'Ryder', 'Seth', 'Theo',
  'Tate', 'Troy', 'Tyler', 'Vance', 'Wade',
  'Wyatt', 'Zane', 'Zeke', 'Ace', 'Axel',
  'Bear', 'Blaze', 'Colt', 'Duke', 'Fox',
  'Hawk', 'Jet', 'King', 'Storm', 'Wolf',
  'Ava', 'Brooklyn', 'Camila', 'Delilah', 'Eden',
  'Ellie', 'Evelyn', 'Faith', 'Georgia', 'Gemma',
  'Harper', 'India', 'Isla', 'Jolie', 'Kaia',
  'Kenzie', 'Kylie', 'Layla', 'Leah', 'Lily',
  'Madison', 'Mila', 'Naomi', 'Nova', 'Oakley',
  'Penelope', 'Piper', 'Quinn', 'Remi', 'Rory',
  'Scarlett', 'Sienna', 'Sloane', 'Sofia', 'Stella',
  'Summer', 'Tatum', 'Teagan', 'Thea', 'Uma',
  'Violet', 'Vivian', 'Winter', 'Zola', 'Adler',
  'Arlo', 'August', 'Austin', 'Axel', 'Bailey',
  'Baron', 'Bentley', 'Blake', 'Brady', 'Brock',
  'Brooks', 'Bryce', 'Camden', 'Carson', 'Carter',
  'Chase', 'Clayton', 'Cooper', 'Corbin', 'Dallas',
  'Damon', 'Dante', 'Declan', 'Denver', 'Dylan',
  'Easton', 'Emmett', 'Ethan', 'Evan', 'Flynn',
  'Ford', 'Gage', 'Grant', 'Griffin', 'Hayes',
  'Heath', 'Holden', 'Ian', 'Jagger', 'Jake',
  'Jesse', 'Jonas', 'Jonah', 'Jude', 'Kade',
  'Kane', 'Keaton', 'Kellen', 'Killian', 'Kip',
  'Kyler', 'Landon', 'Lennox', 'Lincoln', 'Micah',
  'Miles', 'Nolan', 'Oakley', 'Oliver', 'Orion',
  'Oscar', 'Pax', 'Pierce', 'Porter', 'Preston',
  'Quentin', 'Reed', 'Reid', 'Roman', 'Ronan',
];

/**
 * Get a random name from the list
 */
export function getRandomName(): string {
  const randomIndex = Math.floor(Math.random() * MODERN_NAMES.length);
  return MODERN_NAMES[randomIndex];
}
