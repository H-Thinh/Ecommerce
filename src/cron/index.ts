import { dailyReportCron, monthReportCron } from "./report.cron";

export const initCronJobs = () => {
  dailyReportCron();
  monthReportCron();
};
