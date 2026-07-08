import { CheckCircle2 } from 'lucide-react';
import logo from '../assets/logo.png';

const AuthLayout = ({ children }) => {
  const features = [
    'Visualize status pipelines effortlessly',
    'Detailed stats and response rate tracking',
    'Overdue alerts & task management',
  ];

  return (
    <div className="min-h-screen flex bg-slate-50/50 dark:bg-background">
      {/* Left Panel  */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-indigo-700 via-purple-600 to-rose-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoLTZ2LTZoNnptMC0zMHY2aC02VjRoNnptMzAgMzB2NmgtNnYtNmg2em0wLTMwdjZoLTZWNGg2ek02IDM0djZIMHYtNmg2em0wLTMwdjZIMFY0aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-25" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-300/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between w-full h-full p-16 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20">
              <img src={logo} alt="JobTracker Logo" className="w-6 h-6 object-contain invert mix-blend-screen" />
            </div>
            <span className="text-xl font-bold tracking-tight">JobTracker</span>
          </div>

          <div className="space-y-8 max-w-lg">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
                Master Your Job Hunt.
              </h1>
              <p className="text-lg text-white/80 leading-relaxed">
                Track applications, organize interview stages, and optimize your response rate with standard visual pipelines.
              </p>
            </div>
            <ul className="space-y-3">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white/95">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-2">
            {['Applied', 'Screening', 'Interview', 'Offer', 'Closed'].map((stage) => (
              <span 
                key={stage} 
                className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-semibold tracking-wider uppercase text-white/90 border border-white/10"
              >
                {stage}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel  */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/10 to-purple-50/10 pointer-events-none" />
        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <img src={logo} alt="JobTracker Logo" className="w-6 h-6 object-contain invert mix-blend-screen" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              JobTracker
            </h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
