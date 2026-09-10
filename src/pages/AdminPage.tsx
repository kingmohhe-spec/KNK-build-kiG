import { useState, useEffect } from 'react';
import { supabase } from '../data/supabaseClient';
import { categoryDetails } from '../data/categoryDetails';
import { uploadProductImage, uploadBrandImage, loadLocalImageOverrides, loadLocalBrandOverrides } from '../data/supabaseClient';
import { Lock, Upload, Check, LogOut, Loader2, Image, Award } from 'lucide-react';

const ADMIN_PASSWORD = 'BuildBase2025!';
const SESSION_KEY = 'admin-authed';

const DEFAULT_BRANDS = [
  'INCGO',
  'MAMBA CEMENT',
  'LIN TANK',
  'MEDAL PAINT',
  'GOLDEN CHOICE PAINTS',
  'DURAM PAINT',
  'EUREKA',
  'ACADEMY BRUSHWARE',
  'POWAFIX',
  'PPC CEMENT',
  'AFRISASM CEMENT',
];

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState<boolean>(false);
  const [tab, setTab] = useState<'products' | 'brands'>('products');
  const [customImages, setCustomImages] = useState<Record<string, string>>({});
  const [brandImages, setBrandImages] = useState<Record<string, string>>({});
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<Record<string, string>>({});

  useEffect(() => {
    setAuthed(sessionStorage.getItem(SESSION_KEY) === '1');
  }, []);

  useEffect(() => {
    if (authed) {
      loadCustomImages();
      loadBrandImages();
    }
  }, [authed]);

  async function loadCustomImages() {
    const localOverrides = loadLocalImageOverrides();
    const { data } = await supabase!.from('product_images').select('category_name, product_name, image_url');
    const map: Record<string, string> = { ...localOverrides };
    if (data) {
      for (const row of data) {
        map[`${row.category_name}::${row.product_name}`] = row.image_url;
      }
    }
    setCustomImages(map);
  }

  async function loadBrandImages() {
    const localOverrides = loadLocalBrandOverrides();
    const { data } = await supabase!.from('brand_images').select('brand_name, image_url');
    const map: Record<string, string> = { ...localOverrides };
    if (data) {
      for (const row of data) {
        map[row.brand_name] = row.image_url;
      }
    }
    setBrandImages(map);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setAuthed(true);
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
    setLoading(false);
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }

  async function handleUpload(category: string, product: string, file: File) {
    const key = `${category}::${product}`;
    setUploadingKey(key);
    try {
      const url = await uploadProductImage(category, product, file);
      if (url) {
        setCustomImages((prev) => ({ ...prev, [key]: url }));
        setUploadMessage((prev) => ({ ...prev, [key]: 'Image updated!' }));
        setTimeout(() => setUploadMessage((prev) => { const n = { ...prev }; delete n[key]; return n; }), 3000);
      } else {
        setUploadMessage((prev) => ({ ...prev, [key]: 'Upload failed. Try again.' }));
      }
    } catch {
      setUploadMessage((prev) => ({ ...prev, [key]: 'Upload failed. Try again.' }));
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleBrandUpload(brandName: string, file: File) {
    const key = `brand::${brandName}`;
    setUploadingKey(key);
    try {
      const url = await uploadBrandImage(brandName, file);
      if (url) {
        setBrandImages((prev) => ({ ...prev, [brandName]: url }));
        setUploadMessage((prev) => ({ ...prev, [key]: 'Logo updated!' }));
        setTimeout(() => setUploadMessage((prev) => { const n = { ...prev }; delete n[key]; return n; }), 3000);
      } else {
        setUploadMessage((prev) => ({ ...prev, [key]: 'Upload failed. Try again.' }));
      }
    } catch {
      setUploadMessage((prev) => ({ ...prev, [key]: 'Upload failed. Try again.' }));
    } finally {
      setUploadingKey(null);
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Admin Login</h1>
          <p className="text-gray-500 text-center mb-8 text-sm">Sign in to manage product images and brand logos</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              required
              autoFocus
            />
            {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>
          <a href="#" className="block text-center mt-6 text-sm text-gray-500 hover:text-orange-600 transition-colors">
            ← Back to website
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Image Manager</h1>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-gray-500 hover:text-orange-600 transition-colors">View site</a>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${tab === 'products' ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'}`}
          >
            <Image className="h-4 w-4" /> Product Images
          </button>
          <button
            onClick={() => setTab('brands')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${tab === 'brands' ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'}`}
          >
            <Award className="h-4 w-4" /> Brand Logos
          </button>
        </div>

        {tab === 'products' && (
          <>
            <p className="text-gray-600 mb-8">Upload a photo for any product. The new image will appear on the website immediately.</p>
            {Object.entries(categoryDetails).map(([category, products]) => (
              <div key={category} className="mb-10">
                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const key = `${category}::${product.name}`;
                    const currentImage = customImages[key] ?? product.image;
                    const isUploading = uploadingKey === key;
                    return (
                      <div key={product.name} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="h-40 overflow-hidden bg-gray-200 relative">
                          <img src={currentImage} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 text-sm mb-1">{product.name}</h3>
                          <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>
                          <label className={`flex items-center justify-center gap-2 w-full border border-gray-200 rounded-lg py-2 text-sm font-medium cursor-pointer transition-all ${isUploading ? 'opacity-50 cursor-wait' : 'hover:border-orange-400 hover:text-orange-600'}`}>
                            {isUploading ? (
                              <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                            ) : (
                              <><Upload className="h-4 w-4" /> Upload photo</>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isUploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpload(category, product.name, file);
                                e.target.value = '';
                              }}
                            />
                          </label>
                          {uploadMessage[key] && (
                            <p className={`text-xs mt-2 flex items-center gap-1 ${uploadMessage[key].includes('updated') ? 'text-green-600' : 'text-red-500'}`}>
                              {uploadMessage[key].includes('updated') && <Check className="h-3 w-3" />}
                              {uploadMessage[key]}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'brands' && (
          <>
            <p className="text-gray-600 mb-8">Upload a logo for any trusted brand. The new logo will appear on the website immediately.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEFAULT_BRANDS.map((brandName) => {
                const key = `brand::${brandName}`;
                const currentLogo = brandImages[brandName];
                const isUploading = uploadingKey === key;
                return (
                  <div key={brandName} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="h-40 overflow-hidden bg-gray-100 relative flex items-center justify-center">
                      {currentLogo ? (
                        <img src={currentLogo} alt={brandName} className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-gray-400 text-sm">No logo uploaded yet</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm mb-3">{brandName}</h3>
                      <label className={`flex items-center justify-center gap-2 w-full border border-gray-200 rounded-lg py-2 text-sm font-medium cursor-pointer transition-all ${isUploading ? 'opacity-50 cursor-wait' : 'hover:border-orange-400 hover:text-orange-600'}`}>
                        {isUploading ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                        ) : (
                          <><Upload className="h-4 w-4" /> Upload logo</>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleBrandUpload(brandName, file);
                            e.target.value = '';
                          }}
                        />
                      </label>
                      {uploadMessage[key] && (
                        <p className={`text-xs mt-2 flex items-center gap-1 ${uploadMessage[key].includes('updated') ? 'text-green-600' : 'text-red-500'}`}>
                          {uploadMessage[key].includes('updated') && <Check className="h-3 w-3" />}
                          {uploadMessage[key]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
