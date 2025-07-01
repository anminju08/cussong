/*
  # Create Music Player Database Schema

  1. New Tables
    - `songs`
      - `id` (uuid, primary key)
      - `title` (text)
      - `artist` (text)
      - `album` (text)
      - `duration` (integer, seconds)
      - `file_url` (text)
      - `cover_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `playlists`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `playlist_songs`
      - `id` (uuid, primary key)
      - `playlist_id` (uuid, foreign key)
      - `song_id` (uuid, foreign key)
      - `position` (integer)
      - `added_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text NOT NULL,
  album text DEFAULT '',
  duration integer DEFAULT 0,
  file_url text NOT NULL,
  cover_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create playlist_songs junction table
CREATE TABLE IF NOT EXISTS playlist_songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid REFERENCES playlists(id) ON DELETE CASCADE,
  song_id uuid REFERENCES songs(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  added_at timestamptz DEFAULT now(),
  UNIQUE(playlist_id, song_id)
);

-- Enable Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;

-- Songs policies (public read, authenticated write)
CREATE POLICY "Anyone can read songs"
  ON songs FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert songs"
  ON songs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update songs"
  ON songs FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete songs"
  ON songs FOR DELETE
  TO authenticated
  USING (true);

-- Playlists policies (users can only manage their own playlists)
CREATE POLICY "Users can read their own playlists"
  ON playlists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own playlists"
  ON playlists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists"
  ON playlists FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists"
  ON playlists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Playlist songs policies (users can manage songs in their playlists)
CREATE POLICY "Users can read playlist songs from their playlists"
  ON playlist_songs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_songs.playlist_id
      AND playlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add songs to their playlists"
  ON playlist_songs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_songs.playlist_id
      AND playlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update playlist songs in their playlists"
  ON playlist_songs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_songs.playlist_id
      AND playlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete playlist songs from their playlists"
  ON playlist_songs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_songs.playlist_id
      AND playlists.user_id = auth.uid()
    )
  );

-- Insert sample data
INSERT INTO songs (title, artist, album, duration, file_url, cover_url) VALUES
  ('Chill Beats', 'LoFi Producer', 'Midnight Sessions', 180, 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3', 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg'),
  ('Cosmic Journey', 'Space Ambient', 'Interstellar', 240, 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3', 'https://images.pexels.com/photos/1279813/pexels-photo-1279813.jpeg'),
  ('Urban Nights', 'City Sounds', 'Metropolitan', 200, 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3', 'https://images.pexels.com/photos/1540408/pexels-photo-1540408.jpeg'),
  ('Digital Dreams', 'Synthwave Artist', 'Neon Nights', 220, 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3', 'https://images.pexels.com/photos/1649691/pexels-photo-1649691.jpeg'),
  ('Ambient Flow', 'Meditation Music', 'Inner Peace', 300, 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3', 'https://images.pexels.com/photos/1540401/pexels-photo-1540401.jpeg');