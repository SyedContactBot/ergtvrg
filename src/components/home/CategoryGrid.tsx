'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Swords, Laugh, Drama, Ghost, Heart, Clapperboard, 
  FlaskConical, FileText, Palette
} from 'lucide-react';

const GENRES = [
  { name: 'Action', value: 1003, icon: Swords, color: 'from-red-600 to-orange-600' },
  { name: 'Comedy', value: 1006, icon: Laugh, color: 'from-yellow-500 to-orange-500' },
  { name: 'Drama', value: 1004, icon: Drama, color: 'from-purple-600 to-pink-600' },
  { name: 'Thriller', value: 1005, icon: Ghost, color: 'from-gray-700 to-gray-900' },
  { name: 'Romance', value: 1007, icon: Heart, color: 'from-pink-500 to-rose-600' },
  { name: 'Mystery', value: 1002, icon: FlaskConical, color: 'from-indigo-600 to-purple-700' },
  { name: 'Crime', value: 1011, icon: Clapperboard, color: 'from-slate-700 to-slate-900' },
  { name: 'Sci-Fi', value: 1001, icon: FlaskConical, color: 'from-cyan-600 to-blue-700' },
  { name: 'Documentary', value: 1009, icon: FileText, color: 'from-emerald-600 to-teal-700' },
  { name: 'Animation', value: 8702164779707392, icon: Palette, color: 'from-orange-500 to-red-500' },
];

const LANGUAGES = [
  { name: 'Hindi', value: 1018 },
  { name: 'Tamil', value: 1033 },
  { name: 'Telugu', value: 1037 },
  { name: 'Bengali', value: 1041 },
  { name: 'Malayalam', value: 1039 },
  { name: 'Marathi', value: 1038 },
  { name: 'Kannada', value: 1035 },
  { name: 'Punjabi', value: 1063 },
  { name: 'English', value: 1003 },
];

export function CategoryGrid() {
  return (
    <section className="px-4 md:px-8 space-y-8">
      {/* Language pills */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-white md:text-2xl">Browse by Language</h2>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <Link
              key={lang.value}
              href={`/movies?language=${lang.value}`}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition-all hover:bg-white/10 hover:border-red-500/50 hover:text-white"
            >
              {lang.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Genre cards */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-white md:text-2xl">Browse by Genre</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {GENRES.map((genre) => {
            const Icon = genre.icon;
            return (
              <Link key={genre.value} href={`/movies?genre=${genre.value}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-3 rounded-xl bg-gradient-to-r ${genre.color} p-4 transition-shadow hover:shadow-lg hover:shadow-black/30`}
                >
                  <Icon className="h-6 w-6 text-white/80" />
                  <span className="text-sm font-semibold text-white">{genre.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
