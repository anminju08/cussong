import React, { useState } from 'react';
import { X } from 'lucide-react';
import { MusicService } from '../services/musicService';
import { Song } from '../types';

interface SongUploadFormProps {
  onSongUploaded: (song: Song) => void;
  onClose: () => void;
}

export const SongUploadForm: React.FC<SongUploadFormProps> = ({ onSongUploaded, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    duration: 0,
    file_url: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const song = await MusicService.createSong(formData);
      onSongUploaded(song);
      onClose();
    } catch (error) {
      console.error('Error uploading song:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-green-600">곡 추가</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">
              곡 제목 
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white text-green-900 border border-green-300 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">
              아티스트 
            </label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white text-green-900 border border-green-300 rounded-lg focus:outline-none"  
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">
              앨범
            </label>
            <input
              type="text"
              name="album"
              value={formData.album}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white text-green-900 border border-green-300 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">
              재생 시간(초)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white text-green-900 border border-green-300 rounded-lg focus:outline-none"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">
              오디오 파일 URL 
            </label>
            <input
              type="url"
              name="file_url"
              value={formData.file_url}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white text-green-900 border border-green-300 rounded-lg focus:outline-none"
              placeholder="https://example.com/song.mp3"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>{loading ? '추가 중...' : '곡 추가'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-green-900 py-3 px-4 rounded-lg"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};