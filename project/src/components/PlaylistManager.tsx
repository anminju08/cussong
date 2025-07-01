import React, { useState, useEffect } from 'react';
import { Plus, Music, Trash2, Edit2 } from 'lucide-react';
import { Playlist } from '../types';
import { MusicService } from '../services/musicService';

interface PlaylistManagerProps {
  onPlaylistSelect: (playlist: Playlist) => void;
}

export const PlaylistManager: React.FC<PlaylistManagerProps> = ({ onPlaylistSelect }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const userPlaylists = await MusicService.getUserPlaylists();
      setPlaylists(userPlaylists);
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    setLoading(true);
    try {
      await MusicService.createPlaylist({
        name: newPlaylistName,
        description: newPlaylistDescription,
      });
      
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setShowCreateForm(false);
      await loadPlaylists();
    } catch (error) {
      console.error('Error creating playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;

    try {
      await MusicService.deletePlaylist(playlistId);
      await loadPlaylists();
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-green-700">내 플레이리스트</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>플레이리스트 생성</span>
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg p-4 mb-6">
          <form onSubmit={handleCreatePlaylist} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">
                플레이리스트 이름
              </label>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full px-3 py-2 bg-white text-green-900 border border-green-300 rounded-lg focus:outline-none"
                placeholder="플레이리스트 이름 입력"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">
                설명 (선택)
              </label>
              <textarea
                value={newPlaylistDescription}
                onChange={(e) => setNewPlaylistDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white text-green-900 border border-green-300 rounded-lg focus:outline-none"
                placeholder="플레이리스트 설명 입력"
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {loading ? '생성 중...' : '생성'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-200 text-green-900 px-4 py-2 rounded-lg"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-white rounded-lg p-4 cursor-pointer group"
            onClick={() => onPlaylistSelect(playlist)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-200 p-2 rounded-lg">
                  <Music className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <h3 className="text-green-900 font-medium">{playlist.name}</h3>
                  {playlist.description && (
                    <p className="text-green-700 text-sm">{playlist.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="text-green-700 p-1"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePlaylist(playlist.id);
                  }}
                  className="text-red-500 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {playlists.length === 0 && !showCreateForm && (
        <div className="text-center py-8">
          <Music className="h-12 w-12 text-green-200 mx-auto mb-4" />
          <p className="text-green-700">아직 플레이리스트가 없습니다. 첫 플레이리스트를 만들어보세요!</p>
        </div>
      )}
    </div>
  );
};