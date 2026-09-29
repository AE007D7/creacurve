import type { MetadataRoute } from 'next';
import { guides } from '@/lib/printing/guides';
const base='https://creacurve.com';
export default function sitemap():MetadataRoute.Sitemap {return ['','/guides','/about','/contact','/privacy','/terms'].map(path=>({url:`${base}${path}`,changeFrequency:'monthly' as const,priority:path?0.5:1})).concat(guides.map(g=>({url:`${base}/guides/${g.slug}`,changeFrequency:'monthly' as const,priority:0.8})))}
