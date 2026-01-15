import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Upload, Moon, Sun, MapPin } from 'lucide-react';

interface Props {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

const InputForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    birthDate: '',
    birthTime: '',
    gender: 'male',
    location: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, photoBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md w-full mx-auto p-6 bg-slate-800/50 backdrop-blur-md rounded-xl border border-amber-900/30 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif text-amber-500">开启命理推演</h2>
        <p className="text-slate-400 text-sm mt-2">请输入生辰八字，生成您的人生 K 线</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">姓名</label>
          <input
            required
            type="text"
            className="w-full bg-slate-900 border border-slate-700 text-amber-100 px-4 py-2 rounded focus:outline-none focus:border-amber-600 transition-colors placeholder-slate-600"
            value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
            placeholder="请输入您的姓名"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">性别</label>
            <div className="flex bg-slate-900 rounded p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setProfile({ ...profile, gender: 'male' })}
                className={`flex-1 flex items-center justify-center py-1.5 rounded text-sm transition-all ${profile.gender === 'male' ? 'bg-slate-700 text-blue-300 shadow' : 'text-slate-500'}`}
              >
                <Sun size={16} className="mr-1" /> 男
              </button>
              <button
                type="button"
                onClick={() => setProfile({ ...profile, gender: 'female' })}
                className={`flex-1 flex items-center justify-center py-1.5 rounded text-sm transition-all ${profile.gender === 'female' ? 'bg-slate-700 text-pink-300 shadow' : 'text-slate-500'}`}
              >
                <Moon size={16} className="mr-1" /> 女
              </button>
            </div>
          </div>
           <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">出生地点</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                className="w-full bg-slate-900 border border-slate-700 text-amber-100 pl-9 pr-4 py-2 rounded focus:outline-none focus:border-amber-600 transition-colors placeholder-slate-600"
                value={profile.location}
                onChange={e => setProfile({ ...profile, location: e.target.value })}
                placeholder="城市 (如: 北京)"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">出生日期</label>
            <input
              required
              type="date"
              className="w-full bg-slate-900 border border-slate-700 text-amber-100 px-4 py-2 rounded focus:outline-none focus:border-amber-600 transition-colors [color-scheme:dark]"
              value={profile.birthDate}
              onChange={e => setProfile({ ...profile, birthDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">出生时间</label>
            <input
              required
              type="time"
              className="w-full bg-slate-900 border border-slate-700 text-amber-100 px-4 py-2 rounded focus:outline-none focus:border-amber-600 transition-colors [color-scheme:dark]"
              value={profile.birthTime}
              onChange={e => setProfile({ ...profile, birthTime: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">
            面相/手相 (选填)
          </label>
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`w-full border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center transition-colors ${profile.photoBase64 ? 'border-amber-600 bg-amber-900/20' : 'border-slate-700 hover:border-slate-500 bg-slate-900'}`}>
              <Upload size={24} className={profile.photoBase64 ? 'text-amber-500' : 'text-slate-500'} />
              <span className="text-xs text-slate-400 mt-2">
                {profile.photoBase64 ? '照片已上传 (点击更换)' : '上传 面相/手相 照片'}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">*AI 将结合相术进行更精准的分析。</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold py-3 rounded shadow-lg shadow-amber-900/50 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '正在沟通天地信息...' : '生成人生 K 线图'}
      </button>
    </form>
  );
};

export default InputForm;