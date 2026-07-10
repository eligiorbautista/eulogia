import { Users, MessageCircle, CheckCircle, Heart } from "lucide-react";
import { StatsCard } from "./stats-card";

interface DashboardStatsProps {
  totalGuests: number;
  answeredGuests: number;
  attendingCount: number;
  willingCount: number;
}

export function DashboardStats({
  totalGuests,
  answeredGuests,
  attendingCount,
  willingCount,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="Total Guests" value={totalGuests} icon={Users} variant="blue" />
      <StatsCard title="Answered" value={answeredGuests} icon={MessageCircle} variant="default" />
      <StatsCard title="Attending" value={attendingCount} icon={CheckCircle} variant="green" />
      <StatsCard title="Willing Godparent" value={willingCount} icon={Heart} variant="amber" />
    </div>
  );
}
