import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Pre-installed headless Chromium in this container. Remove to let Remotion download its own.
if (process.env.REMOTION_CHROME !== 'download') {
  Config.setBrowserExecutable('/opt/pw-browsers/chromium_headless_shell');
}
