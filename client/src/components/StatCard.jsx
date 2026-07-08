import { Card, CardContent } from '@/components/ui/card';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-0 shadow-sm ${color}`}>
      <CardContent className="p-3.5">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && <p className="text-[10px] opacity-60 mt-0.5">{subtitle}</p>}
          </div>
          <div className="p-2 rounded-lg bg-white/25 dark:bg-white/10 backdrop-blur-sm">
            <Icon className="w-4 h-4 opacity-85" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
