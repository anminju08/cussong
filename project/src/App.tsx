import React, { useState, useEffect } from 'react';
import { AudioPlayer } from './components/AudioPlayer';
import { SongList } from './components/SongList';
import { PlaylistManager } from './components/PlaylistManager';
import { SearchBar } from './components/SearchBar';
import { SongUploadForm } from './components/SongUploadForm';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { MusicService } from './services/musicService';
import { Song, Playlist } from './types';
import { Music, Home, Search, Library, Plus} from 'lucide-react';

function App() {
  const { playSong } = useAudioPlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'library'>('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      const allSongs = await MusicService.getAllSongs();
      setSongs(allSongs);
      setFilteredSongs(allSongs);
    } catch (error) {
      console.error('Error loading songs:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredSongs(songs);
      return;
    }

    try {
      const searchResults = await MusicService.searchSongs(query);
      setFilteredSongs(searchResults);
    } catch (error) {
      console.error('Error searching songs:', error);
    }
  };

  const handleSongUploaded = (newSong: Song) => {
    setSongs(prev => [newSong, ...prev]);
    setFilteredSongs(prev => [newSong, ...prev]);
  };

  return (
    <div className="min-h-screen bg-white text-green-900">
      <div className="flex h-screen">
        <div className="w-64 bg-white p-6 flex flex-col">
          <div className="flex items-center space-x-2 mb-8">
            <Music className="h-6 w-6 text-green-700" />
            <h1 className="text-xl font-bold text-green-700">CUSSONG</h1>
          </div>

          <nav className="flex-1 space-y-2">
            <button
              onClick={() => setCurrentView('home')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-green-700`}
            >
              <Home className="h-5 w-5" />
              <span>홈</span>
            </button>

            <button
              onClick={() => setCurrentView('search')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-green-700`}
            >
              <Search className="h-5 w-5" />
              <span>검색</span>
            </button>

            <button
              onClick={() => setCurrentView('library')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-green-700`}
            >
              <Library className="h-5 w-5" />
              <span>내 라이브러리</span>
            </button>

            <button
              onClick={() => setShowUploadForm(true)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-green-700`}
            >
              <Plus className="h-5 w-5" />
              <span>곡 추가</span>
            </button>
          </nav>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 pb-32">
            {currentView === 'home' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-green-700">최근 추가된 곡</h2>
                <SongList songs={filteredSongs} />
              </div>
            )}

            {currentView === 'search' && (
              <div>
                <div className="mb-6">
                  <SearchBar onSearch={handleSearch} />
                </div>
                {searchQuery ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-green-700">검색 결과</h2>
                    <SongList songs={filteredSongs} />
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Search className="h-16 w-16 text-green-200 mx-auto mb-4" />
                    <p className="text-green-700">곡, 아티스트, 앨범을 검색해보세요</p>
                  </div>
                )}
              </div>
            )}

            {currentView === 'library' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-green-700">내 라이브러리</h2>
                <PlaylistManager onPlaylistSelect={setSelectedPlaylist} />
              </div>
            )}
          </div>
        </div>
      </div>

      <AudioPlayer />

      {showUploadForm && (
        <SongUploadForm
          onSongUploaded={handleSongUploaded}
          onClose={() => setShowUploadForm(false)}
        />
      )}
    </div>
  );
}

export default App;