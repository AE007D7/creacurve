import type { MetadataRoute } from 'next';
export default function robots():MetadataRoute.Robots {return {rules:{userAgent:'*',allow:'/',disallow:['/api/','/dashboard/','/processing/','/admin/']},sitemap:'https://creacurve.com/sitemap.xml',host:'https://creacurve.com'}}
