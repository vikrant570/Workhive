import Link from 'next/link';
import { LuBookOpen, LuArrowRight, LuMessageSquare, LuShield } from 'react-icons/lu';

const PublicPageCards = () => {
    return (
        <>
            <hr className="border-t border-ui-tertiary/10" />

            {/* Row 3: More With Workhive */}
            <section id="sidePageCards">
                <h2 className="text-2xl font-bold mb-6">More With Workhive</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* About Card */}
                    <Link href="/about" className="group bg-ui-secondary border border-ui-tertiary/10 hover:border-purple-500/30 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 flex flex-col items-center h-full">
                            <div className="p-3 bg-purple-500/10 rounded-2xl mb-4 text-purple-400 group-hover:text-purple-300 transition-colors">
                                <LuBookOpen size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-texts-primary mb-2">About Us</h3>
                            <p className="text-sm text-texts-secondary mb-6 flex-1 text-center">
                                Learn about our mission, our team, and our commitment to helping teams work better.
                            </p>
                            <span className="text-sm text-buttons font-medium flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                Learn More <LuArrowRight size={16} />
                            </span>
                        </div>
                    </Link>

                    {/* Contact Card */}
                    <Link href="/contact" className="group bg-ui-secondary border border-ui-tertiary/10 hover:border-green-500/30 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 flex flex-col items-center h-full">
                            <div className="p-3 bg-green-500/10 rounded-2xl mb-4 text-green-400 group-hover:text-green-300 transition-colors">
                                <LuMessageSquare size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-texts-primary mb-2">Contact</h3>
                            <p className="text-sm text-texts-secondary mb-6 flex-1 text-center">
                                Any problems or suggestions regarding WorkHive? Share them with our team.
                            </p>
                            <span className="text-sm text-buttons font-medium flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                Contact Us <LuArrowRight size={16} />
                            </span>
                        </div>
                    </Link>

                    {/* Privacy Card */}
                    <Link href="/privacypolicy" className="group bg-ui-secondary border border-ui-tertiary/10 hover:border-ui-tertiary/30 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-ui-tertiary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 flex flex-col items-center h-full">
                            <div className="p-3 bg-ui-tertiary/10 rounded-2xl mb-4 text-ui-tertiary group-hover:text-texts-secondary transition-colors">
                                <LuShield size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-texts-primary mb-2">Privacy Policy</h3>
                            <p className="text-sm text-texts-secondary mb-6 flex-1 text-center">
                                Read about how we handle your data and our commitment to security.
                            </p>
                            <span className="text-sm text-buttons font-medium flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                Read Policy <LuArrowRight size={16} />
                            </span>
                        </div>
                    </Link>

                </div>
            </section>
        </>
    )
}

export default PublicPageCards;