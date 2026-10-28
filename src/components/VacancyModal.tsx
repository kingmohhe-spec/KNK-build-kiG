import { X, Briefcase } from 'lucide-react';
import { useEffect } from 'react';
import type { Vacancy } from '../data/supabaseClient';

interface VacancyModalProps {
  vacancy: Vacancy;
  onClose: () => void;
}

export default function VacancyModal({ vacancy, onClose }: VacancyModalProps) {
  const urls = vacancy.image_urls && vacancy.image_urls.length > 0
    ? vacancy.image_urls
    : vacancy.image_url ? [vacancy.image_url] : [];

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vacancy-modal-title"
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-8 py-5 flex items-center justify-between z-10">
          <span className="flex items-center gap-2 text-sm font-semibold text-blue-600">
            <Briefcase className="h-4 w-4" /> Career Opportunity
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <h3 id="vacancy-modal-title" className="text-3xl font-bold text-gray-900 leading-tight">
            {vacancy.title}
          </h3>

          {vacancy.description && (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{vacancy.description}</p>
          )}

          {urls.length > 0 && (
            <div className="space-y-4">
              {urls.map((url, i) => (
                <img
                  key={url}
                  src={url}
                  alt={`${vacancy.title} ${i + 1}`}
                  className="w-full h-auto rounded-2xl border border-gray-200 bg-gray-50"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
