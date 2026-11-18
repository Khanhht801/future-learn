export type Area = "home" | "math" | "english" | "badges" | "parents";
const path = window.location.pathname;
const index = path.lastIndexOf("/dashboard");
export const dashboardURL = new URL(
  path.slice(0, index) + "/dashboard/",
  window.location.origin,
);
export const dashboardLink = (path = "") => new URL(path, dashboardURL).href;
export function remember(subject: "math" | "english", id: string) {
  try {
    localStorage.setItem("futurelearn-resume-subject", subject);
    localStorage.setItem("futurelearn-resume-item", id);
  } catch {
    /* Storage is optional. */
  }
}
