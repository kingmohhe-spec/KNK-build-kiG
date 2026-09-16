import { createClient } from '@supabase/supabase-js';
import type { CategoryProduct } from './categoryDetails';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;

export interface ProductImageRow {
  category_name: string;
  product_name: string;
  image_url: string;
}

export interface UploadResult {
  url: string | null;
  error: string | null;
  isLocal: boolean;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ]);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function saveLocalOverride(mapKey: string, storageKey: string, dataUrl: string) {
  let overrides: Record<string, string> = {};
  try {
    overrides = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
  } catch { overrides = {}; }
  overrides[mapKey] = dataUrl;
  localStorage.setItem(storageKey, JSON.stringify(overrides));
}

export async function fetchCustomImages(): Promise<Record<string, string>> {
  const localOverrides = loadLocalImageOverrides();
  if (!supabase) return localOverrides;
  try {
    const { data, error } = await withTimeout(
      supabase.from('product_images').select('category_name, product_name, image_url'),
      8000
    );
    const map: Record<string, string> = { ...localOverrides };
    if (error || !data) return map;
    for (const row of data as ProductImageRow[]) {
      map[`${row.category_name}::${row.product_name}`] = row.image_url;
    }
    return map;
  } catch {
    return localOverrides;
  }
}

export function resolveImage(
  category: string,
  product: CategoryProduct,
  customImages: Record<string, string>
): string {
  return customImages[`${category}::${product.name}`] ?? product.image;
}

export async function uploadProductImage(
  category: string,
  product: string,
  file: File
): Promise<UploadResult> {
  const localKey = `${category}::${product}`;
  if (!supabase) {
    const dataUrl = await fileToDataUrl(file);
    await saveLocalOverride(localKey, 'product-image-overrides', dataUrl);
    return { url: dataUrl, error: null, isLocal: true };
  }
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const safeCat = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const safeProd = product.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filePath = `${safeCat}/${safeProd}-${Date.now()}.${ext}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });
    if (uploadError) throw uploadError;

    const { data: pub } = supabase.storage.from('product-images').getPublicUrl(filePath);
    const publicUrl = pub.publicUrl;

    const { error: dbError } = await supabase
      .from('product_images')
      .upsert(
        { category_name: category, product_name: product, image_url: publicUrl },
        { onConflict: 'category_name,product_name' }
      );

    if (dbError) throw dbError;

    return { url: publicUrl, error: null, isLocal: false };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    const dataUrl = await fileToDataUrl(file);
    await saveLocalOverride(localKey, 'product-image-overrides', dataUrl);
    return { url: dataUrl, error: msg, isLocal: true };
  }
}

export function loadLocalImageOverrides(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem('product-image-overrides') ?? '{}');
  } catch {
    return {};
  }
}

export interface BrandImageRow {
  brand_name: string;
  image_url: string;
}

export async function fetchBrandImages(): Promise<Record<string, string>> {
  const localOverrides = loadLocalBrandOverrides();
  if (!supabase) return localOverrides;
  try {
    const { data, error } = await withTimeout(
      supabase.from('brand_images').select('brand_name, image_url'),
      8000
    );
    const map: Record<string, string> = { ...localOverrides };
    if (error || !data) return map;
    for (const row of data as BrandImageRow[]) {
      map[row.brand_name] = row.image_url;
    }
    return map;
  } catch {
    return localOverrides;
  }
}

export async function uploadBrandImage(
  brandName: string,
  file: File
): Promise<UploadResult> {
  if (!supabase) {
    const dataUrl = await fileToDataUrl(file);
    await saveLocalOverride(brandName, 'brand-image-overrides', dataUrl);
    return { url: dataUrl, error: null, isLocal: true };
  }
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const safeName = brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filePath = `${safeName}-${Date.now()}.${ext}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from('brand-logos')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });
    if (uploadError) throw uploadError;

    const { data: pub } = supabase.storage.from('brand-logos').getPublicUrl(filePath);
    const publicUrl = pub.publicUrl;

    const { error: dbError } = await supabase
      .from('brand_images')
      .upsert(
        { brand_name: brandName, image_url: publicUrl },
        { onConflict: 'brand_name' }
      );

    if (dbError) throw dbError;

    return { url: publicUrl, error: null, isLocal: false };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    const dataUrl = await fileToDataUrl(file);
    await saveLocalOverride(brandName, 'brand-image-overrides', dataUrl);
    return { url: dataUrl, error: msg, isLocal: true };
  }
}

export function loadLocalBrandOverrides(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem('brand-image-overrides') ?? '{}');
  } catch {
    return {};
  }
}

const MAIN_CATEGORY_KEY = '__main_category__';

export async function fetchMainCategoryImages(): Promise<Record<string, string>> {
  const localOverrides = loadLocalMainCategoryOverrides();
  if (!supabase) return localOverrides;
  try {
    const { data, error } = await withTimeout(
      supabase.from('product_images')
        .select('product_name, image_url')
        .eq('category_name', MAIN_CATEGORY_KEY),
      8000
    );
    const map: Record<string, string> = { ...localOverrides };
    if (error || !data) return map;
    for (const row of data as Pick<ProductImageRow, 'product_name' | 'image_url'>[]) {
      map[row.product_name] = row.image_url;
    }
    return map;
  } catch {
    return localOverrides;
  }
}

export async function uploadMainCategoryImage(
  categoryName: string,
  file: File
): Promise<UploadResult> {
  if (!supabase) {
    const dataUrl = await fileToDataUrl(file);
    await saveLocalOverride(categoryName, 'main-category-image-overrides', dataUrl);
    return { url: dataUrl, error: null, isLocal: true };
  }
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const safeName = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filePath = `main-category/${safeName}-${Date.now()}.${ext}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });
    if (uploadError) throw uploadError;

    const { data: pub } = supabase.storage.from('product-images').getPublicUrl(filePath);
    const publicUrl = pub.publicUrl;

    const { error: dbError } = await supabase
      .from('product_images')
      .upsert(
        { category_name: MAIN_CATEGORY_KEY, product_name: categoryName, image_url: publicUrl },
        { onConflict: 'category_name,product_name' }
      );

    if (dbError) throw dbError;

    return { url: publicUrl, error: null, isLocal: false };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    const dataUrl = await fileToDataUrl(file);
    await saveLocalOverride(categoryName, 'main-category-image-overrides', dataUrl);
    return { url: dataUrl, error: msg, isLocal: true };
  }
}

export function loadLocalMainCategoryOverrides(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem('main-category-image-overrides') ?? '{}');
  } catch {
    return {};
  }
}
