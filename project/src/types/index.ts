export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  file_url: string;
  cover_url: string;
  created_at: string;
  updated_at: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface PlaylistSong {
  id: string;
  playlist_id: string;
  song_id: string;
  position: number;
  added_at: string;
}