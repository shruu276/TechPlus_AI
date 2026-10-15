import React, { useState } from 'react';
import { User, Check, Zap, Save, Sparkles, Building2, BookOpen, GraduationCap } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfilePageProps {
  profile: UserProfile | null;
  onUpdateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  onResetCieDemo: () => Promise<void>;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onUpdateProfile,
  onResetCieDemo
}) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: profile?.name || 'Aarav Sharma',
    branch: profile?.branch || 'Computer Engineering',
    year: profile?.year || 'Third Year',
    college: profile?.college || 'COEP Technological University, Pune',
    graduation_year: profile?.graduation_year || 2028,
    interests: profile?.interests || ['Artificial Intelligence', 'Robotics', 'IoT', 'Cloud Computing'],
    preferred_event_types: profile?.preferred_event_types || ['Workshops', 'Hackathons', 'Conferences'],
    preferred_locations: profile?.preferred_locations || ['Pune', 'Online', 'Maharashtra'],
    budget_preference: profile?.budget_preference || 'Under ₹1,000'
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const allInterests = [
    'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Web Development',
    'App Development', 'Cloud Computing', 'Cybersecurity', 'IoT', 'Robotics',
    'Drones', 'Embedded Systems', 'Blockchain', 'DevOps', 'Software Development',
    'Electronics', 'Sustainability', 'Research', 'Entrepreneurship'
  ];

  const allEventTypes = [
    'Workshops', 'Conferences', 'Hackathons', 'Meetups', 'Webinars',
    'Corporate events', 'Research programs', 'Competitions', 'Certifications', 'Internships'
  ];

  const allLocations = ['Online', 'Pune', 'Mumbai', 'Nashik', 'Maharashtra', 'India', 'Anywhere'];
  const budgetOptions = ['Free only', 'Under ₹500', 'Under ₹1,000', 'Under ₹2,500', 'Any'];

  const toggleItem = (list: string[], item: string) => {
    if (list.includes(item)) {
      return list.filter((i) => i !== item);
    } else {
      return [...list, item];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdateProfile(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleApplyCieBenchmark = async () => {
    setSaving(true);
    try {
      await onResetCieDemo();
      setFormData({
        name: 'Aarav Sharma',
        branch: 'Computer Engineering',
        year: 'Third Year',
        college: 'COEP Technological University, Pune',
        graduation_year: 2028,
        interests: ['Artificial Intelligence', 'Robotics', 'IoT', 'Cloud Computing'],
        preferred_event_types: ['Workshops', 'Hackathons', 'Conferences', 'Corporate events'],
        preferred_locations: ['Pune', 'Online', 'Maharashtra'],
        budget_preference: 'Under ₹1,000'
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header with Benchmark Button */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Student Academic Profile</h1>
            <p className="text-xs text-slate-400">
              Personalize recommendations, match scores, and eligibility filters.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleApplyCieBenchmark}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-900/30 shrink-0"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Load CIE-3 Demo Benchmark</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile saved successfully! AI match scores have been recalculated.</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Academic Information */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Academic Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full py-2.5 px-3.5 bg-navy-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Engineering Branch</label>
              <select
                value={formData.branch || ''}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full py-2.5 px-3.5 bg-navy-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Robotics & Automation">Robotics & Automation</option>
                <option value="AI & Data Science">AI & Data Science</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Academic Year</label>
              <select
                value={formData.year || ''}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full py-2.5 px-3.5 bg-navy-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="First Year">First Year</option>
                <option value="Second Year">Second Year</option>
                <option value="Third Year">Third Year</option>
                <option value="Final Year">Final Year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">College / University</label>
              <input
                type="text"
                value={formData.college || ''}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full py-2.5 px-3.5 bg-navy-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Graduation Year</label>
              <input
                type="number"
                value={formData.graduation_year || 2028}
                onChange={(e) => setFormData({ ...formData, graduation_year: Number(e.target.value) })}
                className="w-full py-2.5 px-3.5 bg-navy-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Technical Interests (Multi-select) */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Technical Interests (Select All That Apply)</span>
            </h2>
            <span className="text-xs text-cyan-400 font-semibold">
              {formData.interests?.length || 0} selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allInterests.map((interest) => {
              const isSelected = formData.interests?.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      interests: toggleItem(formData.interests || [], interest),
                    })
                  }
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white border border-cyan-400 shadow-md shadow-blue-900/30'
                      : 'bg-navy-950/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-300" />}
                  <span>{interest}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Opportunity Format Preferences */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Preferred Opportunity Types</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {allEventTypes.map((type) => {
              const isSelected = formData.preferred_event_types?.includes(type);
              return (
                <button
                  type="button"
                  key={type}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      preferred_event_types: toggleItem(formData.preferred_event_types || [], type),
                    })
                  }
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border border-indigo-400'
                      : 'bg-navy-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-300" />}
                  <span>{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Location & Budget Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white pb-3 border-b border-slate-800">
              Preferred Locations
            </h2>
            <div className="flex flex-wrap gap-2">
              {allLocations.map((loc) => {
                const isSelected = formData.preferred_locations?.includes(loc);
                return (
                  <button
                    type="button"
                    key={loc}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        preferred_locations: toggleItem(formData.preferred_locations || [], loc),
                      })
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border border-cyan-400'
                        : 'bg-navy-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white pb-3 border-b border-slate-800">
              Budget Preference
            </h2>
            <div className="space-y-2">
              {budgetOptions.map((b) => (
                <label
                  key={b}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                    formData.budget_preference === b
                      ? 'bg-blue-600/20 border-cyan-400 text-white'
                      : 'bg-navy-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="budget"
                    checked={formData.budget_preference === b}
                    onChange={() => setFormData({ ...formData, budget_preference: b })}
                    className="text-cyan-400 focus:ring-0"
                  />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-bold transition-all flex items-center gap-2 shadow-xl shadow-blue-900/30"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
