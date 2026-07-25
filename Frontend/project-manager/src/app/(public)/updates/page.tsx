import {
  LuHexagon,
  LuSlidersHorizontal,
  LuLayoutTemplate,
  LuSparkles,
  LuPlugZap,
  LuSmartphone,
  LuRocket
} from "react-icons/lu";

const roadmapItems = [
  {
    title: "Niche Customizations",
    description: "More precise customizations tailored to specific project niches. Whether you are in software development, marketing, or design, WorkHive will adapt its workflows, custom fields, and templates to fit your exact industry needs.",
    icon: LuSlidersHorizontal,
    color: "text-buttons",
    bgColor: "bg-buttons/10",
    borderColor: "border-buttons/20",
    status: "In Development",
    qtr: "Q2 2026"
  },
  {
    title: "Flawless Layouts & UI",
    description: "Improved layouts for flawless usage. We are refining every pixel of the interface to reduce cognitive load, improve accessibility, and provide a distraction-free environment for deep work.",
    icon: LuLayoutTemplate,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/20",
    status: "In Design",
    qtr: "Q2 2026"
  },
  {
    title: "AI-Powered Insights",
    description: "WorkHive Brain will automatically summarize long chat threads, predict project bottlenecks, and suggest task prioritizations to keep your team operating at peak efficiency.",
    icon: LuSparkles,
    color: "text-texts-important",
    bgColor: "bg-texts-important/10",
    borderColor: "border-texts-important/20",
    status: "Prototyping",
    qtr: "Q3 2026"
  },
  {
    title: "Advanced Two-Way Integrations",
    description: "Seamless, real-time sync with tools like GitHub, Figma, and Jira. Updates in your external tools will instantly reflect in WorkHive tasks and vice versa, eliminating duplicate data entry.",
    icon: LuPlugZap,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/20",
    status: "Planned",
    qtr: "Q4 2026"
  },
  {
    title: "Mobile App 2.0",
    description: "A complete overhaul of our iOS and Android applications. Expect offline mode, improved push notifications, and a specialized interface for checking project status on the go.",
    icon: LuSmartphone,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/20",
    status: "Planned",
    qtr: "Q4 2026"
  }
];

export default function WhatsComing() {
  {/* Main Content */ }
  return (
    <>
      <main className="w-full max-w-6xl mx-auto px-6 pt-12">

        {/* Header Section */}
        <div className="mb-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-texts-important/10 border border-texts-important/20 mb-6">
              <LuRocket size={14} className="text-texts-important" />
              <span className="text-xs font-bold text-texts-important uppercase tracking-wider">Product Roadmap</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-texts-primary">
              What's Coming?
            </h1>
            <p className="text-texts-secondary text-lg leading-relaxed">
              We are constantly evolving to make WorkHive the ultimate collaborative workspace.
              Take a look at the major updates, tools, and refinements heading your way.
            </p>
          </div>

          {/* Decorative Graphic */}
          <div className="hidden md:flex relative w-48 h-48 items-center justify-center">
            <div className="absolute inset-0 bg-buttons/20 blur-[50px] rounded-full"></div>
            <div className="relative w-32 h-32 bg-ui-secondary border border-ui-tertiary/20 rounded-3xl flex items-center justify-center shadow-2xl animate-[spin_15s_linear_infinite]">
              <LuHexagon size={60} className="text-buttons/50" />
            </div>
            <LuRocket size={40} className="text-texts-primary absolute z-10 drop-shadow-2xl" />
          </div>
        </div>

        {/* Timeline / Roadmap List */}
        <div className="relative">
          {/* Vertical Line for Timeline */}
          <div className="absolute left-6 md:left-[50%] top-0 bottom-0 w-px bg-gradient-to-b from-ui-tertiary/20 via-ui-tertiary/10 to-transparent transform -translate-x-1/2 hidden md:block"></div>

          <div className="space-y-12">
            {roadmapItems.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className={`relative flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>

                  {/* Timeline Node (Center) */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-ui-main border-4 border-ui-secondary rounded-full items-center justify-center z-10 shadow-xl">
                    <div className={`w-3 h-3 rounded-full ${item.bgColor.replace('/10', '')}`}></div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-1/2"></div>

                  {/* Content Card */}
                  <div className="w-full md:w-1/2 flex">
                    <div className={`w-full bg-ui-secondary rounded-3xl p-8 border border-ui-tertiary/10 hover:border-ui-tertiary/30 transition-all duration-300 shadow-lg group relative overflow-hidden ${isEven ? 'md:mr-8' : 'md:ml-8'}`}>

                      {/* Ambient hover glow */}
                      <div className={`absolute top-0 right-0 w-32 h-32 ${item.bgColor} blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                      <div className="relative z-10">
                        {/* Meta Info */}
                        <div className="flex justify-between items-center mb-6">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.bgColor} ${item.borderColor} ${item.color}`}>
                            <item.icon size={24} />
                          </div>
                          <div className="text-right">
                            <span className="block text-xs font-bold text-texts-primary mb-1">{item.qtr}</span>
                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${item.status === 'In Development' ? 'bg-buttons/10 text-buttons' :
                              item.status === 'In Design' ? 'bg-purple-500/10 text-purple-400' :
                                item.status === 'Prototyping' ? 'bg-texts-important/10 text-texts-important' :
                                  'bg-ui-tertiary/10 text-texts-secondary'
                              }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>

                        {/* Text Content */}
                        <h3 className="text-2xl font-bold text-texts-primary mb-3">
                          {item.title}
                        </h3>
                        <p className="text-sm text-texts-secondary leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action Footer */}
        <div className="mt-20 bg-gradient-to-br from-ui-secondary to-ui-tertiary/5 rounded-3xl p-10 border border-ui-tertiary/10 text-center">
          <h2 className="text-2xl font-bold text-texts-primary mb-3">Have a feature request?</h2>
          <p className="text-texts-secondary mb-6 max-w-lg mx-auto">
            We build WorkHive for you. If there's something specific you need to make your workflow better, let our product team know.
          </p>
          <button className="bg-buttons text-ui-main hover:text-texts-primary font-lg font-semibold hover:bg-transparent border-2 hover:border-buttons/40 cursor-pointer transition-all duration-150 px-4 py-2 rounded-lg">
            Submit an Idea
          </button>
        </div>

      </main>
    </>
  );
}