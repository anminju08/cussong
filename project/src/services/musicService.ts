import { Song, Playlist, PlaylistSong } from '../types';
const mockSongs: Song[] = [
  {
    id: '1',
    title: 'FAMOUS',
    artist: 'all day project',
    album: 'FAMOUS',
    duration: 180,
    file_url: 'https://www.youtube.com/watch?v=pShwcQAk7Js',
    cover_url: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: '나비소녀',
    artist: 'EXO',
    album: 'XOXO',
    duration: 240,
    file_url: 'https://www.youtube.com/watch?v=9nkIxVcBHCQ&list=RDMM9nkIxVcBHCQ&start_radio=1',
    cover_url: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Dirty Work',
    artist: 'aespa',
    album: 'Dirty Work',
    duration: 200,
    file_url: 'https://www.youtube.com/watch?v=kVi-9QYxmM4&list=RDkVi-9QYxmM4&start_radio=1',
    cover_url: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: '소나기',
    artist: '이클립스',
    album: '이클립스',
    duration: 220,
    file_url: 'https://www.youtube.com/watch?v=MQMzMgqcuKk&list=RDMQMzMgqcuKk&start_radio=1',
    cover_url: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Ambient Flow',
    artist: 'Meditation Music',
    album: 'Inner Peace',
    duration: 300,
    file_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
    cover_url: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Chill Vibes',
    description: 'Perfect for relaxing',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Work Focus',
    description: 'Music for productivity',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let songs = [...mockSongs];
let playlists = [...mockPlaylists];
let playlistSongs: PlaylistSong[] = [];

export class MusicService {
  static async getAllSongs(): Promise<Song[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...songs]), 100);
    });
  }

  static async getSongById(id: string): Promise<Song | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const song = songs.find(s => s.id === id) || null;
        resolve(song);
      }, 100);
    });
  }

  static async createSong(song: Omit<Song, 'id' | 'created_at' | 'updated_at' | 'cover_url'>): Promise<Song> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSong: Song = {
          ...song,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          cover_url: '',
        };
        songs.unshift(newSong);
        resolve(newSong);
      }, 100);
    });
  }

  static async updateSong(id: string, updates: Partial<Song>): Promise<Song> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = songs.findIndex(s => s.id === id);
        if (index === -1) {
          reject(new Error('Song not found'));
          return;
        }
        
        songs[index] = {
          ...songs[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        resolve(songs[index]);
      }, 100);
    });
  }

  static async deleteSong(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        songs = songs.filter(s => s.id !== id);
        resolve();
      }, 100);
    });
  }

  static async searchSongs(query: string): Promise<Song[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowercaseQuery = query.toLowerCase();
        const results = songs.filter(song =>
          song.title.toLowerCase().includes(lowercaseQuery) ||
          song.artist.toLowerCase().includes(lowercaseQuery) ||
          song.album.toLowerCase().includes(lowercaseQuery)
        );
        resolve(results);
      }, 100);
    });
  }

  static async getUserPlaylists(): Promise<Playlist[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...playlists]), 100);
    });
  }

  static async createPlaylist(playlist: Omit<Playlist, 'id' | 'created_at' | 'updated_at'>): Promise<Playlist> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPlaylist: Playlist = {
          ...playlist,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        playlists.unshift(newPlaylist);
        resolve(newPlaylist);
      }, 100);
    });
  }

  static async updatePlaylist(id: string, updates: Partial<Playlist>): Promise<Playlist> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = playlists.findIndex(p => p.id === id);
        if (index === -1) {
          reject(new Error('Playlist not found'));
          return;
        }
        
        playlists[index] = {
          ...playlists[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        resolve(playlists[index]);
      }, 100);
    });
  }

  static async deletePlaylist(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        playlists = playlists.filter(p => p.id !== id);
        playlistSongs = playlistSongs.filter(ps => ps.playlist_id !== id);
        resolve();
      }, 100);
    });
  }

  static async getPlaylistSongs(playlistId: string): Promise<(Song & { position: number })[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const playlistSongIds = playlistSongs
          .filter(ps => ps.playlist_id === playlistId)
          .sort((a, b) => a.position - b.position);
        
        const songsWithPosition = playlistSongIds
          .map(ps => {
            const song = songs.find(s => s.id === ps.song_id);
            return song ? { ...song, position: ps.position } : null;
          })
          .filter(Boolean) as (Song & { position: number })[];
        
        resolve(songsWithPosition);
      }, 100);
    });
  }

  static async addSongToPlaylist(playlistId: string, songId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingPlaylistSongs = playlistSongs.filter(ps => ps.playlist_id === playlistId);
        const nextPosition = existingPlaylistSongs.length > 0 
          ? Math.max(...existingPlaylistSongs.map(ps => ps.position)) + 1 
          : 0;
        
        const newPlaylistSong: PlaylistSong = {
          id: Date.now().toString(),
          playlist_id: playlistId,
          song_id: songId,
          position: nextPosition,
          added_at: new Date().toISOString(),
        };
        
        playlistSongs.push(newPlaylistSong);
        resolve();
      }, 100);
    });
  }

  static async removeSongFromPlaylist(playlistId: string, songId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        playlistSongs = playlistSongs.filter(
          ps => !(ps.playlist_id === playlistId && ps.song_id === songId)
        );
        resolve();
      }, 100);
    });
  }
}