import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Shuffle, 
  Repeat,
  Repeat1
} from 'lucide-react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export const AudioPlayer: React.FC = () => {
  const {
    audioRef,
    currentSong,
    isPlaying,
    duration,
    currentTime,
    volume,
    shuffle,
    repeat,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    changeVolume,
    toggleShuffle,
    toggleRepeat,
    formatTime,
  } = useAudioPlayer();

  if (!currentSong) {
    return null;
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seekTo(percentage * duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    changeVolume(newVolume);
  };

  return (
    <>
      <audio ref={audioRef} />
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10 p-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="min-w-0 flex-1">
                <h3 className="text-green-900 font-medium truncate">{currentSong.title}</h3>
                <p className="text-green-700 text-sm truncate">{currentSong.artist}</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2 flex-1">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleShuffle}
                  className={`p-2 rounded-full ${
                    shuffle ? 'text-green-600 bg-green-100' : 'text-green-700'
                  }`}
                >
                  <Shuffle className="h-4 w-4" />
                </button>
                
                <button
                  onClick={playPrevious}
                  className="p-2 text-green-700"
                >
                  <SkipBack className="h-5 w-5" />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  className="bg-green-500 text-white p-3 rounded-full"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>
                
                <button
                  onClick={playNext}
                  className="p-2 text-green-700"
                >
                  <SkipForward className="h-5 w-5" />
                </button>
                
                <button
                  onClick={toggleRepeat}
                  className={`p-2 rounded-full ${
                    repeat !== 'none' ? 'text-green-600 bg-green-100' : 'text-green-700'
                  }`}
                >
                  {repeat === 'one' ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex items-center space-x-2 w-full max-w-md">
                <span className="text-xs text-green-700 min-w-[40px]">
                  {formatTime(currentTime)}
                </span>
                <div
                  className="flex-1 bg-green-100 rounded-full h-1 cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div
                    className="bg-green-500 rounded-full h-1"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-green-700 min-w-[40px]">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-1 justify-end">
              <Volume2 className="h-4 w-4 text-green-700" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-green-100 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};