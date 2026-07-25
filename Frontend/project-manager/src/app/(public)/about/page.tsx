import Link from 'next/link';
import { LuShield, LuTrendingUp, LuGlobe, LuCircleCheck, LuArrowRight, LuTarget } from 'react-icons/lu';

const About = () => {
    return (
        <main className="w-full max-w-7xl mx-auto pt-12 pb-24">

            {/* Hero Section */}
            <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ui-secondary border border-ui-tertiary/20 mb-6">
                    <span className="w-2 h-2 rounded-full bg-texts-important animate-pulse"></span>
                    <span className="text-xs font-medium text-texts-secondary uppercase tracking-wider">Revolutionizing Collaboration</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-texts-primary">
                    Where Teams <br />
                    <span className="text-buttons">Connect & Create.</span>
                </h1>

                <p className="text-lg md:text-xl text-texts-secondary max-w-2xl mx-auto leading-relaxed mb-10">
                    WorkHive is the central operating system for modern teams. We bridge the gap between companies and industries, enabling seamless project management and tracking.
                </p>

                <Link className="flex flex-col sm:flex-row items-center justify-center" href="/auth">
                    <button className="px-8 py-3 bg-buttons hover:bg-buttons/90 text-ui-main font-bold rounded-lg transition-all transform hover:-translate-y-1 shadow-lg shadow-buttons/20 flex items-center gap-2">
                        Join the Hive <LuArrowRight size={18} />
                    </button>
                </Link>
            </div>

            {/* Stats / Trust Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24 border-y border-ui-tertiary/10 py-8">
                <div className="text-center">
                    <h3 className="text-3xl font-bold text-texts-primary">500+</h3>
                    <p className="text-sm text-texts-secondary mt-1">Companies</p>
                </div>
                <div className="text-center">
                    <h3 className="text-3xl font-bold text-texts-primary">10k+</h3>
                    <p className="text-sm text-texts-secondary mt-1">Active Projects</p>
                </div>
                <div className="text-center">
                    <h3 className="text-3xl font-bold text-texts-primary">99%</h3>
                    <p className="text-sm text-texts-secondary mt-1">Satisfaction</p>
                </div>
                <div className="text-center">
                    <h3 className="text-3xl font-bold text-texts-important">24/7</h3>
                    <p className="text-sm text-texts-secondary mt-1">Global Support</p>
                </div>
            </div>

            {/* Mission / Value Proposition */}
            <div className="mb-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-texts-primary mb-4">Why WorkHive?</h2>
                    <p className="text-texts-secondary">Designed for clarity, built for speed, engineered for scale.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-ui-secondary p-8 rounded-2xl border border-ui-tertiary/10 hover:border-buttons/50 transition-colors group">
                        <div className="w-12 h-12 bg-ui-main rounded-lg flex items-center justify-center mb-6 border border-ui-tertiary/10 group-hover:scale-110 transition-transform">
                            <LuGlobe size={24} className="text-buttons" />
                        </div>
                        <h3 className="text-xl font-bold text-texts-primary mb-3">Global Ecosystem</h3>
                        <p className="text-texts-secondary leading-relaxed text-sm">
                            Connect with professionals across different time zones and industries without friction.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-ui-secondary p-8 rounded-2xl border border-ui-tertiary/10 hover:border-buttons/50 transition-colors group">
                        <div className="w-12 h-12 bg-ui-main rounded-lg flex items-center justify-center mb-6 border border-ui-tertiary/10 group-hover:scale-110 transition-transform">
                            <LuTarget size={24} className="text-texts-important" />
                        </div>
                        <h3 className="text-xl font-bold text-texts-primary mb-3">Precision Tracking</h3>
                        <p className="text-texts-secondary leading-relaxed text-sm">
                            Real-time analytics and milestone tracking ensure your projects never miss a beat.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-ui-secondary p-8 rounded-2xl border border-ui-tertiary/10 hover:border-buttons/50 transition-colors group">
                        <div className="w-12 h-12 bg-ui-main rounded-lg flex items-center justify-center mb-6 border border-ui-tertiary/10 group-hover:scale-110 transition-transform">
                            <LuShield size={24} className="text-buttons" />
                        </div>
                        <h3 className="text-xl font-bold text-texts-primary mb-3">Secure Collaboration</h3>
                        <p className="text-texts-secondary leading-relaxed text-sm">
                            Enterprise-grade security keeps your proprietary data safe while you collaborate openly.
                        </p>
                    </div>
                </div>
            </div>

            {/* Team / Text Block */}
            <div className="bg-ui-secondary rounded-3xl p-8 md:p-12 border border-ui-tertiary/10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    <h2 className="text-3xl font-bold text-texts-primary">
                        Built by Makers, <br />
                        <span className="text-texts-secondary">For Makers.</span>
                    </h2>
                    <p className="text-texts-secondary leading-relaxed">
                        We started WorkHive because we were tired of switching between five different tools just to manage one project. We believe that technology should get out of the way and let you focus on what matters: the work.
                    </p>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-texts-primary">
                            <LuCircleCheck size={20} className="text-buttons" />
                            <span className="font-medium">Streamlined Workflows</span>
                        </div>
                        <div className="flex items-center gap-3 text-texts-primary">
                            <LuCircleCheck size={20} className="text-buttons" />
                            <span className="font-medium">Cross-Industry Standards</span>
                        </div>
                        <div className="flex items-center gap-3 text-texts-primary">
                            <LuCircleCheck size={20} className="text-buttons" />
                            <span className="font-medium">Community Driven</span>
                        </div>
                    </div>
                </div>

                {/* Visual Placeholder for Team/Concept */}
                <div className="flex-1 w-full flex justify-center">
                    <div className="relative w-full max-w-sm aspect-square">
                        {/* Abstract Geometric Decoration */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-buttons/20 to-texts-important/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 w-full h-full bg-ui-main rounded-2xl border border-ui-tertiary/20 p-8 flex flex-col justify-between shadow-2xl">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 rounded-full bg-ui-secondary border border-ui-tertiary/20"></div>
                                <div className="px-3 py-1 rounded-full bg-buttons/10 text-buttons text-xs font-bold">ACTIVE</div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-4 bg-ui-secondary rounded w-3/4"></div>
                                <div className="h-4 bg-ui-secondary rounded w-1/2"></div>
                                <div className="h-32 bg-ui-secondary rounded w-full border border-ui-tertiary/10 flex items-center justify-center">
                                    <LuTrendingUp size={48} className="text-buttons opacity-50" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
};

export default About;