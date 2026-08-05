import Link from 'next/link';
import {
  LuUsers,
  LuFolderKanban,
  LuTrendingUp,
  LuMessageSquare,
  LuRocket,
  LuChevronRight,
  LuCircleCheck
} from 'react-icons/lu';

export default function GetStartedPage() {
  return (
    <div className="text-texts-primary selection:bg-buttons/30 flex flex-col gap-12 pb-12">

      {/* Header Section */}
      <div className="text-center mt-12 mb-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Get Started with <span className="text-buttons">Workhive</span>
        </h1>
        <p className="text-texts-secondary max-w-2xl mx-auto text-lg leading-relaxed">
          Your quick guide to connecting with professionals, managing projects smoothly, and tracking progress without the clutter.
        </p>
      </div>

      {/* Guide Section (80%) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Step 1 */}
        <div className="bg-ui-secondary rounded-2xl p-6 border border-ui-tertiary/10 flex flex-col gap-4 hover:border-buttons/30 transition-colors">
          <div className="w-12 h-12 bg-buttons/10 border border-buttons/20 rounded-xl flex items-center justify-center text-texts-important">
            <LuUsers size={24} />
          </div>
          <h2 className="text-xl font-bold">1. Connect Your Team</h2>
          <p className="text-texts-secondary text-sm leading-relaxed">
            Invite your colleagues directly to the platform. Build your professional network and keep all your work-related communications in one dedicated space, away from distracting personal messaging apps like WhatsApp.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-ui-secondary rounded-2xl p-6 border border-ui-tertiary/10 flex flex-col gap-4 hover:border-buttons/30 transition-colors">
          <div className="w-12 h-12 bg-buttons/10 border border-buttons/20 rounded-xl flex items-center justify-center text-ui-tertiary">
            <LuFolderKanban size={24} />
          </div>
          <h2 className="text-xl font-bold">2. Create & Organize Projects</h2>
          <p className="text-texts-secondary text-sm leading-relaxed">
            Set up projects with simple, intuitive interfaces. Organize daily tasks, share important instruction files, and keep everything perfectly managed with proper records.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-ui-secondary rounded-2xl p-6 border border-ui-tertiary/10 flex flex-col gap-4 hover:border-buttons/30 transition-colors">
          <div className="w-12 h-12 bg-buttons/10 border border-buttons/20 rounded-xl flex items-center justify-center text-green-500">
            <LuTrendingUp size={24} />
          </div>
          <h2 className="text-xl font-bold">3. Track Progress Smoothly</h2>
          <p className="text-texts-secondary text-sm leading-relaxed">
            Experience manager-to-employee style progress tracking. Teammates can easily see the whole group's progress and report their own updates seamlessly in real-time.
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-ui-secondary rounded-2xl p-6 border border-ui-tertiary/10 flex flex-col gap-4 hover:border-buttons/30 transition-colors">
          <div className="w-12 h-12 bg-buttons/10 border border-buttons/20 rounded-xl flex items-center justify-center text-buttons">
            <LuMessageSquare size={24} />
          </div>
          <h2 className="text-xl font-bold">4. Future-Proof Collaboration</h2>
          <p className="text-texts-secondary text-sm leading-relaxed">
            Stay tuned for customized, theme-based project tools tailored for specific scopes—whether it's coding, data analysis, or other specialized professional workflows.
          </p>
        </div>

      </div>

      {/* Advertisement / CTA Section (20%) */}
      <div className="mt-4 bg-gradient-to-br from-buttons/20 to-transparent rounded-3xl p-1 relative overflow-hidden group">
        <div className="bg-ui-secondary rounded-[20px] p-8 md:p-12 border border-ui-tertiary/10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-texts-important mb-3">
              <LuRocket size={20} />
              <span className="font-semibold text-sm uppercase tracking-wider">Join Workhive</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to simplify your workflow?</h2>
            <ul className="flex flex-col gap-3 text-texts-secondary text-sm mb-2">
              <li className="flex items-center gap-3">
                <LuCircleCheck className="text-buttons flex-shrink-0" size={18} />
                <span>No more messy communication channels</span>
              </li>
              <li className="flex items-center gap-3">
                <LuCircleCheck className="text-buttons flex-shrink-0" size={18} />
                <span>Clear, transparent progress visibility</span>
              </li>
              <li className="flex items-center gap-3">
                <LuCircleCheck className="text-buttons flex-shrink-0" size={18} />
                <span>A truly professional, distraction-free environment</span>
              </li>
            </ul>
          </div>

          <div className="w-full md:w-auto mt-4 md:mt-0">
            <Link
              href="/auth"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-buttons text-ui-main font-bold py-4 px-8 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg shadow-buttons/20"
            >
              Join Us Now <LuChevronRight size={20} />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}