
import React from 'react';

const Contact: React.FC = () => {
  return (
    <section className="py-20 bg-background-light dark:bg-[#111827]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
                Let's Build Something <span className="text-primary">Scalable</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Currently open to new backend engineering opportunities globally. Whether you have a technical question or a potential collaboration, I'd love to hear from you.
              </p>
            </div>
            
            <div className="space-y-4">
               {[
                 { label: 'Email', value: 'solomon@example.com', icon: 'mail', color: 'text-primary' },
                 { label: 'LinkedIn', value: 'Professional Profile', icon: 'business_center', color: 'text-[#0a66c2]' },
                 { label: 'GitHub', value: 'Code Repositories', icon: 'code', color: 'text-slate-900 dark:text-white' },
                 { label: 'Location', value: 'Kenya (GMT+3)', icon: 'location_on', color: 'text-red-500' }
               ].map((item) => (
                 <div key={item.label} className="flex items-start gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a202c] shadow-sm transition-all hover:scale-[1.02]">
                   <div className={`${item.color} bg-opacity-10 p-3 rounded-lg`}>
                     <span className="material-symbols-outlined">{item.icon}</span>
                   </div>
                   <div>
                     <h3 className="text-sm font-bold dark:text-white">{item.label}</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400">{item.value}</p>
                   </div>
                 </div>
               ))}
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a202c] shadow-sm flex items-center gap-4">
              <div className="size-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Time</p>
                <p className="text-sm font-bold dark:text-white">Nairobi, Kenya (GMT+3)</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-[#1a202c] p-8 md:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
             <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-sm font-bold dark:text-gray-200">Full Name</label>
                      <input type="text" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border-transparent focus:ring-primary focus:border-primary transition-all dark:text-white" placeholder="John Doe" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold dark:text-gray-200">Email Address</label>
                      <input type="email" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border-transparent focus:ring-primary focus:border-primary transition-all dark:text-white" placeholder="john@example.com" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold dark:text-gray-200">Subject</label>
                   <select className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border-transparent focus:ring-primary focus:border-primary transition-all dark:text-white">
                      <option>Hiring / Opportunity</option>
                      <option>Collaboration</option>
                      <option>Technical Question</option>
                      <option>Other</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold dark:text-gray-200">Message</label>
                   <textarea rows={5} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border-transparent focus:ring-primary focus:border-primary transition-all dark:text-white" placeholder="Tell me about your project..."></textarea>
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all">
                  <span className="material-symbols-outlined">send</span>
                  Send Message
                </button>
             </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
