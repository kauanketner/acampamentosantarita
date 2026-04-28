import { CallToApp } from '@/components/home/CallToApp';
import { GalleryPreview } from '@/components/home/GalleryPreview';
import { Hero } from '@/components/home/Hero';
import { Manifesto } from '@/components/home/Manifesto';
import { NumbersStrip } from '@/components/home/NumbersStrip';
import { Testimonials } from '@/components/home/Testimonials';
import { UpcomingEvents } from '@/components/home/UpcomingEvents';

// Renderiza no request — fetches têm fallback gracioso, mas evita
// que o build trave esperando a API responder.
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <Hero />
      <NumbersStrip />
      <Manifesto />
      <UpcomingEvents />
      <GalleryPreview />
      <Testimonials />
      <CallToApp />
    </>
  );
}
