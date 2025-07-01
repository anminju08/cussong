import React from 'react';
import { Play, Pause, MoreHorizontal } from 'lucide-react';
import { Song } from '../types';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface SongListProps {
  songs: Song[];
  onSongSelect?: (song: Song) => void;
}

export const SongList: React.FC<SongListProps> = ({ songs, onSongSelect }) => {
  const { currentSong, isPlaying, playSong, togglePlayPause } = useAudioPlayer();

  const handleSongClick = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlayPause();
    } else {
      playSong(song, songs);
    }
    onSongSelect?.(song);
  };

  return (
    <div className="space-y-2">
      {songs.map((song, index) => (
        <div
          key={song.id}
          className={`group flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 hover:bg-white/5 cursor-pointer ${
            currentSong?.id === song.id ? 'bg-white/10' : ''
          }`}
          onClick={() => handleSongClick(song)}
        >
          <div className="flex-shrink-0 w-8 text-center">
            {currentSong?.id === song.id ? (
              <button className="text-green-400 hover:text-green-300">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            ) : (
              <span className="text-gray-400 group-hover:hidden text-sm">
                {index + 1}
              </span>
            )}
            {currentSong?.id !== song.id && (
              <button className="text-white hidden group-hover:block">
                <Play className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium truncate ${
              currentSong?.id === song.id ? 'text-green-600' : 'text-green-900'
            }`}>
              {song.title}
            </h3>
            <p className="text-green-700 text-sm truncate">{song.artist}</p>
          </div>

          <div className="flex-shrink-0 text-green-700 text-sm">
            {song.album}
          </div>

          <div className="flex-shrink-0 text-green-700 text-sm">
            {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
          </div>

          <button className="flex-shrink-0 p-2 text-green-700 opacity-0 group-hover:opacity-100">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};