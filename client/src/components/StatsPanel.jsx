import StatCard from './StatCard';
import { Send, Search, Users, Award, XCircle, TrendingUp } from 'lucide-react';

const StatsPanel = ({ stats }) => {
  const cards = [
    {
      title: 'Applied',
      value: stats?.Applied ?? 0,
      icon: Send,
      color: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 dark:from-blue-950 dark:to-blue-900 dark:text-blue-200',
    },
    {
      title: 'Screening',
      value: stats?.Screening ?? 0,
      icon: Search,
      color: 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-800 dark:from-amber-950 dark:to-amber-900 dark:text-amber-200',
    },
    {
      title: 'Interview',
      value: stats?.Interview ?? 0,
      icon: Users,
      color: 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-800 dark:from-purple-950 dark:to-purple-900 dark:text-purple-200',
    },
    {
      title: 'Offer',
      value: stats?.Offer ?? 0,
      icon: Award,
      color: 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-800 dark:from-emerald-950 dark:to-emerald-900 dark:text-emerald-200',
    },
    {
      title: 'Closed',
      value: stats?.Closed ?? 0,
      icon: XCircle,
      color: 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 dark:from-slate-800 dark:to-slate-750 dark:text-slate-200',
    },
    {
      title: 'Response Rate',
      value: `${stats?.responseRate ?? 0}%`,
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-800 dark:from-indigo-950 dark:to-indigo-900 dark:text-indigo-200',
      subtitle: `${stats?.total ?? 0} total applications`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default StatsPanel;
