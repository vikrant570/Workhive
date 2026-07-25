import WelcomePopup from '@/components/global_compns/WelcomePopup';
import PublicPageCard from '@/components/shared_homepg_compns/PublicPageCards';
import SloganAndAnimation from '@/components/shared_homepg_compns/Slogan&AnimHomePage';
import Link from 'next/link';
import { LuRocket, LuArrowRight, LuBuilding, LuChevronRight } from 'react-icons/lu';

export default function LandingPage() {
  return (
    <div className="text-texts-primary selection:bg-buttons/30">
      <WelcomePopup />

      {/*Header*/}
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome </h1>
          <p className="text-texts-secondary text-sm mt-1">Here's what's happening with your projects today.</p>
        </div>
        <div className="h-0.5 flex-1 bg-gradient-to-r from-buttons to-transparent mt-2"></div>
      </div>

      <div className="flex flex-col gap-8" id="container-homepage">

        {/* Row - 1 */}
        <div className="flex flex-row items-center justify-between lg:col-span-4 md:col-span-2 flex-wrap gap-2">

          {/* Get Started Page */}
          <Link className="lg:w-[67%] bg-ui-tertiary/20 rounded-3xl p-1 relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1" href="/getstarted">
            <div className="absolute inset-0 bg-gradient-to-br from-buttons/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="h-full bg-ui-secondary rounded-[20px] p-6 border border-ui-tertiary/10 flex flex-col items-center justify-center text-center relative z-10">
              <div className="w-16 h-16 bg-buttons rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-buttons/20 group-hover:scale-110 transition-transform">
                <LuBuilding size={32} className="text-ui-main" />
              </div>
              <h3 className="text-xl font-bold mb-2">Get Started</h3>
              <p className="text-sm text-texts-secondary leading-relaxed max-w-[250px] mb-4">
                Take a Brief Look at How This Platform Works
              </p>
              <div className="mt-auto flex items-center gap-1 text-xs font-bold text-buttons group-hover:translate-x-1 transition-transform">
                View <LuChevronRight size={14} />
              </div>
            </div>
          </Link>

          {/* What Coming ? */}
          <Link
            className="lg:w-[32%] bg-ui-secondary rounded-3xl p-1 relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1 block"
            href="/updates"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-texts-important/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="h-full bg-ui-secondary rounded-[20px] p-6 border border-ui-tertiary/10 flex flex-col items-center justify-center text-center relative z-10">
              <div className="w-16 h-16 bg-texts-important/10 border border-texts-important/20 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-texts-important/10 group-hover:scale-110 transition-transform">
                <LuRocket size={32} className="text-texts-important" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-texts-primary">What Coming ?</h3>
              <p className="text-sm text-texts-secondary leading-relaxed max-w-[250px] mb-4">
                Sneak a peek at our roadmap and discover new features we are building.
              </p>
              <div className="mt-auto flex items-center gap-1 text-xs font-bold text-texts-important group-hover:translate-x-1 transition-transform">
                View <LuArrowRight size={14} />
              </div>

            </div>
          </Link>
        </div>

        {/* Slogan & Animation Area */}
        <SloganAndAnimation />

        <PublicPageCard />

      </div>
    </div>
  )
}