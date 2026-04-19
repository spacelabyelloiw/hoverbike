const packageVersion = "0.1.0";
const rawBuildVersion = import.meta.env.VITE_BUILD_VERSION || "dev";
const buildVersion = rawBuildVersion.slice(0, 7);

export function getBuildLabel() {
  return `v${packageVersion}+${buildVersion}`;
}
