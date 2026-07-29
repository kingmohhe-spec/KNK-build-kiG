import { useState, useEffect } from 'react';
import { X, FileText, CheckCircle2, AlertCircle, Loader2, User, CreditCard, Phone, Mail, MapPin, Building2, Wallet } from 'lucide-react';

const BRANCHES = [
  'Dayizenza',
  'Dwarsloop',
  'Elukwatini',
  'Kwamhlanga',
  'Numbi',
  'White River',
];

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_QEd4qhO-nZ_Yy-OQYs2tHGTLwpjN3jU5O72NsXDAxK4xgum3U9ZDRc2c8p463PPOmQ/exec';

interface CreditApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreditApplicationForm({ isOpen, onClose }: CreditApplicationFormProps) {
  const [form, setForm] = useState({
    fullName: '',
    idNumber: '',
    phone: '',
    email: '',
    address: '',
    branch: '',
    income: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setStatus('idle');
      setForm({ fullName: '', idNumber: '', phone: '', email: '', address: '', branch: '', income: '' });
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus('success');
      setForm({ fullName: '', idNumber: '', phone: '', email: '', address: '', branch: '', income: '' });
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-orange-400 focus:bg-white/20 transition-all pl-11';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 rounded-3xl shadow-2xl border border-white/20">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-gradient-to-r from-blue-700 to-blue-800 border-b border-white/10">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2.5 rounded-xl shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Apply for Credit</h2>
              <p className="text-blue-200 text-xs">Flexible financing for your projects</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {status === 'success' ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Application Submitted!</h3>
              <p className="text-blue-200 mb-8">
                Thank you for applying. A team member will contact you soon to discuss your credit options.
              </p>
              <button
                onClick={onClose}
                className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  name="fullName"
                  required
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  name="idNumber"
                  required
                  placeholder="ID Number"
                  value={form.idNumber}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                  <input
                    name="phone"
                    required
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email (optional)"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  name="address"
                  required
                  placeholder="Physical Address"
                  value={form.address}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 pointer-events-none z-10" />
                <select
                  name="branch"
                  required
                  value={form.branch}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="" className="text-gray-900">Select nearest branch</option>
                  {BRANCHES.map((b) => (
                    <option key={b} value={b} className="text-gray-900">
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  name="income"
                  placeholder="Monthly Income (optional)"
                  value={form.income}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3.5 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-[1.02] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-300 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  Something went wrong. Please try again.
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
