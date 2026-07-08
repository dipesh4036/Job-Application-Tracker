import dayjs from "dayjs";

export const formatDate = (date) => {
  if (!date) return "—";
  return dayjs(date).format("MMM D, YYYY");
};

export const isOverdue = (date) => {
  if (!date) return false;
  return (
    dayjs(date).isBefore(dayjs(), "day") || dayjs(date).isSame(dayjs(), "day")
  );
};

export const isStatusTransitionDisabled = (currentStatus, targetStatus) => {
  if (currentStatus === targetStatus) return false;
  if (currentStatus === "Closed") return true; 
  if (targetStatus === "Closed") return false;

  const PIPELINE = ["Applied", "Screening", "Interview", "Offer", "Closed"];
  const currentIndex = PIPELINE.indexOf(currentStatus);
  const targetIndex = PIPELINE.indexOf(targetStatus);
  
  return targetIndex !== currentIndex + 1;
};

export const STATUS_CONFIG = {
  Applied: {
    label: "Applied",
    color:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    dotColor: "bg-blue-500",
  },
  Screening: {
    label: "Screening",
    color:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    dotColor: "bg-amber-500",
  },
  Interview: {
    label: "Interview",
    color:
      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    dotColor: "bg-purple-500",
  },
  Offer: {
    label: "Offer",
    color:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    dotColor: "bg-emerald-500",
  },
  Closed: {
    label: "Closed",
    color:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    dotColor: "bg-slate-500",
  },
};

export const LOCATION_CONFIG = {
  remote: {
    label: "Remote",
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  },
  onsite: {
    label: "Onsite",
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  },
  hybrid: {
    label: "Hybrid",
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
};
