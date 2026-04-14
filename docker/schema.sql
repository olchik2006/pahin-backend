CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tree_species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL CHECK (category IN ('хвойні', 'листяні', 'квітучі', 'плодові', 'швидкоростучі')),
  name_ukr VARCHAR(100) NOT NULL,
  latin_name VARCHAR(100) NOT NULL,
  description TEXT,
  soil TEXT,
  weather TEXT,
  region TEXT,
  distance TEXT,
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  species_id UUID NOT NULL REFERENCES tree_species(id) ON DELETE RESTRICT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  planted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  user_description TEXT,
  location_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tree_id UUID NOT NULL UNIQUE REFERENCES trees(id) ON DELETE CASCADE,
  planting_date TIMESTAMP NOT NULL,
  planting_place VARCHAR(255) NOT NULL,
  pdf_url TEXT
);