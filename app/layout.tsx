import type { Metadata } from 'next';
import { Geist, Instrument_Serif } from 'next/font/google';
import './globals.css';
const geist=Geist({subsets:['latin'],variable:'--font-geist',display:'swap'});
const serif=Instrument_Serif({subsets:['latin'],weight:'400',style:['normal','italic'],variable:'--font-serif',display:'swap'});
export const metadata: Metadata = {
 metadataBase:new URL('https://creacurve.com'), title:{default:'CreaCurve | Practical 3D Printing Guides',template:'%s | CreaCurve'},
 description:'Practical 3D printing guides for makers: FDM materials, troubleshooting, design, and useful prints.',
 verification:{google:'a9iSpI2SBxC9-qRdPp0pJ21hJyOHmFd-EaOQwDEnwAw'},
 openGraph:{type:'website',siteName:'CreaCurve',locale:'en_US',url:'https://creacurve.com',title:'CreaCurve | Practical 3D Printing Guides',description:'Make better 3D prints with clear, practical FDM guides.'},
 robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large'}}
};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en" className={`${geist.variable} ${serif.variable}`}><body className="min-h-screen font-sans antialiased">{children}</body></html>}
