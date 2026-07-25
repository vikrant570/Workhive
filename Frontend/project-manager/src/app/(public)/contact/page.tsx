import {
  LuMail,
  LuMapPin,
  LuClock,
  LuMessageSquare,
  LuSend
} from 'react-icons/lu';

const ContactUs = () => {
  {/* Main Content */ }
  return (
    <>
      <main className="w-full max-w-7xl mx-auto px-6 pt-12 pb-24">

        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ui-secondary border border-ui-tertiary/20 mb-6">
            <LuMessageSquare size={14} className="text-buttons" />
            <span className="text-xs font-medium text-texts-secondary uppercase tracking-wider">Support & Sales</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-texts-primary">Get in touch</h1>
          <p className="text-texts-secondary text-lg max-w-2xl mx-auto">
            Have a question about our pricing, features, or need a custom plan? We're here to help you get the most out of WorkHive.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Contact Info */}
          <div className="lg:col-span-5 space-y-8">

            {/* Info Card 1: Email */}
            <div className="bg-ui-secondary p-6 rounded-2xl border border-ui-tertiary/10 flex items-start gap-4">
              <div className="p-3 rounded-lg bg-ui-main border border-ui-tertiary/10 text-buttons">
                <LuMail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-texts-primary mb-1">Chat to us</h3>
                <p className="text-texts-secondary text-sm mb-2">Our friendly team is here to help.</p>
                <a href="mailto:hello@workhive.com" className="text-buttons font-medium hover:underline">hello@workhive.com</a>
              </div>
            </div>

            {/* Info Card 2: Office */}
            <div className="bg-ui-secondary p-6 rounded-2xl border border-ui-tertiary/10 flex items-start gap-4">
              <div className="p-3 rounded-lg bg-ui-main border border-ui-tertiary/10 text-texts-important">
                <LuMapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-texts-primary mb-1">Visit us</h3>
                <p className="text-texts-secondary text-sm mb-2">Come say hello at our office HQ.</p>
                <p className="text-texts-primary font-medium">100 Smith Street<br />Collingwood VIC 3066 AU</p>
              </div>
            </div>

            {/* Info Card 3: Hours */}
            <div className="bg-ui-secondary p-6 rounded-2xl border border-ui-tertiary/10 flex items-start gap-4">
              <div className="p-3 rounded-lg bg-ui-main border border-ui-tertiary/10 text-buttons">
                <LuClock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-texts-primary mb-1">Business Hours</h3>
                <p className="text-texts-secondary text-sm mb-2">Mon - Fri, 8am to 5pm.</p>
                <p className="text-texts-primary font-medium">EST Timezone</p>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-ui-secondary rounded-3xl p-8 border border-ui-tertiary/10 shadow-xl shadow-ui-main/50">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-texts-secondary uppercase tracking-wide">First Name</label>
                    <input
                      type="text"
                      placeholder="Jane"
                      className="w-full bg-ui-main border border-ui-tertiary/20 rounded-lg px-4 py-3 text-texts-primary placeholder:text-ui-tertiary/50 focus:outline-none focus:border-buttons focus:ring-1 focus:ring-buttons transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-texts-secondary uppercase tracking-wide">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full bg-ui-main border border-ui-tertiary/20 rounded-lg px-4 py-3 text-texts-primary placeholder:text-ui-tertiary/50 focus:outline-none focus:border-buttons focus:ring-1 focus:ring-buttons transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-texts-secondary uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    placeholder="jane@company.com"
                    className="w-full bg-ui-main border border-ui-tertiary/20 rounded-lg px-4 py-3 text-texts-primary placeholder:text-ui-tertiary/50 focus:outline-none focus:border-buttons focus:ring-1 focus:ring-buttons transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-texts-secondary uppercase tracking-wide">Subject</label>
                  <select className="w-full bg-ui-main border border-ui-tertiary/20 rounded-lg px-4 py-3 text-texts-primary focus:outline-none focus:border-buttons focus:ring-1 focus:ring-buttons transition-all appearance-none">
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Policies</option>
                    <option>Others (please specify)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-texts-secondary uppercase tracking-wide">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us more about your project..."
                    className="w-full bg-ui-main border border-ui-tertiary/20 rounded-lg px-4 py-3 text-texts-primary placeholder:text-ui-tertiary/50 focus:outline-none focus:border-buttons focus:ring-1 focus:ring-buttons transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="button"
                  className="w-full py-4 bg-buttons hover:bg-buttons/90 text-ui-main font-bold rounded-xl transition-all shadow-lg shadow-buttons/20 flex items-center justify-center gap-2 mt-4"
                >
                  <LuSend size={18} /> Send Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </>
  );
};

export default ContactUs;