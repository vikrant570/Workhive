import Link from 'next/link';
import { LuShield, LuLock, LuEye, LuFileText, LuServer, LuMail, LuArrowLeft } from 'react-icons/lu';

const PrivacyPolicy = () => {
  {/* Main Content */ }
  return (
    <>
      <main className="w-full max-w-6xl mx-auto px-6 pt-12 pb-24">

        {/* Header Section */}
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ui-secondary border border-ui-tertiary/20 mb-6">
            <LuShield size={14} className="text-texts-important" />
            <span className="text-xs font-medium text-texts-secondary uppercase tracking-wider">Legal Documentation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-texts-primary">Privacy Policy</h1>
          <p className="text-texts-secondary text-lg">
            Last updated: <span className="text-texts-primary font-medium">October 24, 2025</span>
          </p>
        </header>

        {/* Introduction */}
        <div className="prose prose-invert max-w-none mb-16">
          <p className="text-texts-secondary leading-relaxed text-lg">
            At WorkHive, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform or use our project management services. By using WorkHive, you consent to the data practices described in this statement.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">

          {/* Section 1 */}
          <section className="bg-ui-secondary rounded-2xl p-8 border border-ui-tertiary/10 hover:border-buttons/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-ui-main border border-ui-tertiary/10 text-buttons">
                <LuEye size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-texts-primary mb-3">1. Information We Collect</h2>
                <p className="text-texts-secondary leading-relaxed mb-4">
                  We collect information that you provide directly to us when you create an account, update your profile, or use our collaboration tools.
                </p>
                <ul className="space-y-2 text-texts-secondary text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-buttons"></div>
                    <span>Personal Identification (Name, Email, Job Title)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-buttons"></div>
                    <span>Project Data (Task descriptions, files, timelines)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-buttons"></div>
                    <span>Usage Logs (Login times, feature usage statistics)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-ui-secondary rounded-2xl p-8 border border-ui-tertiary/10 hover:border-buttons/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-ui-main border border-ui-tertiary/10 text-texts-important">
                <LuFileText size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-texts-primary mb-3">2. How We Use Your Data</h2>
                <p className="text-texts-secondary leading-relaxed mb-4">
                  We use the collected data primarily to provide and improve the WorkHive platform. Your project data is used strictly to facilitate collaboration within your team.
                </p>
                <p className="text-texts-secondary leading-relaxed">
                  We may also use your information to communicate with you about updates, security alerts, and support messages. <span className="text-texts-important">We do not sell your personal data to third-party advertisers.</span>
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-ui-secondary rounded-2xl p-8 border border-ui-tertiary/10 hover:border-buttons/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-ui-main border border-ui-tertiary/10 text-buttons">
                <LuLock size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-texts-primary mb-3">3. Data Security</h2>
                <p className="text-texts-secondary leading-relaxed">
                  We implement enterprise-grade security measures designed to protect your information. This includes AES-256 encryption for data at rest and TLS 1.3 for data in transit. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-ui-secondary rounded-2xl p-8 border border-ui-tertiary/10 hover:border-buttons/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-ui-main border border-ui-tertiary/10 text-texts-primary">
                <LuServer size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-texts-primary mb-3">4. Third-Party Services</h2>
                <p className="text-texts-secondary leading-relaxed">
                  WorkHive integrates with various third-party services (e.g., cloud storage providers, communication tools). When you connect these services, we may share specific data points required to enable the integration. These third parties have their own privacy policies.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Contact Section */}
        <div className="mt-16 pt-8 border-t border-ui-tertiary/10">
          <h3 className="text-2xl font-bold text-texts-primary mb-6">Contact Us</h3>
          <p className="text-texts-secondary mb-6">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <Link href="/side/contact" className="flex items-center gap-3 px-6 py-4 bg-ui-secondary rounded-xl border border-ui-tertiary/10 hover:border-buttons/50 transition-all group">
              <LuMail size={20} className="text-buttons" />
              <div>
                <span className="block text-xs text-texts-secondary font-medium uppercase tracking-wider">Email Support</span>
                <span className="text-texts-primary font-medium group-hover:text-buttons transition-colors">support@workhive.com</span>
              </div>
            </Link>
          </div>
        </div>

      </main>
    </>
  );
};

export default PrivacyPolicy;