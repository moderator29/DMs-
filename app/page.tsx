import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Timeline from '@/components/home/Timeline';
import StatsBlock from '@/components/home/StatsBlock';
import Tokenomics from '@/components/home/Tokenomics';
import Community from '@/components/home/Community';
import HomeChart from '@/components/home/HomeChart';
import HomeDdergo from '@/components/home/HomeDdergo';
import HomeStickerStrip from '@/components/home/HomeStickerStrip';

export default function HomePage() {
  return (
    <main className="bg-[#0a0a0a]">
      <Header />
      <Hero />
      <HomeStickerStrip />
      <StatsBlock />
      <Timeline />
      <HomeChart />
      <Tokenomics />
      <HomeDdergo />
      <Community />
      <Footer />
    </main>
  );
}
