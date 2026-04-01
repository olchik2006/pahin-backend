CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tree_species (
  id SERIAL PRIMARY KEY,
  name_ua VARCHAR(255) NOT NULL,
  name_latin VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS trees (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  species_id INTEGER REFERENCES tree_species(id),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_name VARCHAR(255),
  region VARCHAR(100),
  personal_message TEXT,
  planted_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  tree_id INTEGER REFERENCES trees(id) ON DELETE CASCADE,
  cert_code VARCHAR(50) UNIQUE NOT NULL,
  issued_at TIMESTAMP DEFAULT NOW()
);