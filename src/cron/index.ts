import { dailyReportCron } from "./report.cron";

export const initCronJobs = () => {
  dailyReportCron();
};
