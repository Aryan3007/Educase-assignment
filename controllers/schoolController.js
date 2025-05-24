import { db } from '../config/db.js';

// Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = deg => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  try {
    await db.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    res.status(201).json({ message: 'School added successfully' });
  } catch (error) {
    console.error('Add School Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const listSchools = async (req, res) => {
  const { latitude, longitude } = req.query;
  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ message: 'Invalid coordinates' });
  }

  try {
    const [schools] = await db.execute('SELECT * FROM schools');

    const sortedSchools = schools
      .map(school => ({
        ...school,
        distance: getDistance(userLat, userLon, school.latitude, school.longitude),
      }))
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json(sortedSchools);
  } catch (error) {
    console.error('List Schools Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
