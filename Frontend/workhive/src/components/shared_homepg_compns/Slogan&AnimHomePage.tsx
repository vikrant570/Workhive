"use client"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { LuArrowRight } from "react-icons/lu"

const SloganAndAnimation = () => {
  return (
    <div className="lg:col-span-8 bg-ui-secondary/30 rounded-3xl p-8 border border-ui-tertiary/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-buttons/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

      <div className="flex-1 z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
          Work together, <br />
          <span className="text-buttons">faster, anywhere!</span>
        </h2>
        <p className="text-texts-secondary text-lg leading-relaxed mb-6">
          A platform where ideas flow freely and teamwork feels effortless. Jump in, share, and build together.
        </p>
        <button className="px-6 py-2.5 bg-ui-main border border-buttons/30 text-buttons rounded-full text-sm font-semibold hover:bg-buttons hover:text-ui-main transition-all flex items-center gap-2">
          Start Collaborating <LuArrowRight size={16} />
        </button>
      </div>

      <div className="w-full md:w-1/3 z-10">
        {/* Use <DotLottieReact ... /> here in your real code */}
        <DotLottieReact
          src="/animations/Coding_boy.lottie"
          loop
          autoplay
          className="p-0 mt-5"
          style={{ height: "40%", width: "fit-content" }}
        />
      </div>
    </div>
  )
};

export default SloganAndAnimation;