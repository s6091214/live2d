declare global {
  interface Window {
    MSStream: string;
  }
}

const getMobileOperatingSystem = (): "Android" | "iOS" | "unknown" => {
  const userAgent = window?.navigator.userAgent;

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }

  return "unknown";
};

const deviceName = getMobileOperatingSystem();

export default deviceName;