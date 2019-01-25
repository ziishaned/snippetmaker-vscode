import * as os from 'os';
import {join} from 'path';
import {env} from 'vscode';

export const getVSCodeUserPath = (): string => {
  const appName = env.appName || '';
  const isDev = /dev/i.test(appName);
  const isOSS = isDev && /oss/i.test(appName);
  const isInsiders = /insiders/i.test(appName);

  const vscodePath = getVSCodePath();
  const vscodeAppName = getVSCodeAppName(isInsiders, isOSS, isDev);
  const vscodeAppUserPath = join(vscodePath, vscodeAppName, 'User');

  return vscodeAppUserPath;
};

const getVSCodeAppName = (isInsiders: boolean, isOSS: boolean, isDev: boolean): string => {
  return process.env.VSCODE_PORTABLE
    ? 'user-data'
    : isInsiders
      ? 'Code - Insiders'
      : isOSS
        ? 'Code - OSS'
        : isDev
          ? 'code-oss-dev'
          : 'Code';
};

const getVSCodePath = (): string => {
  switch (process.platform) {
    case 'darwin':
      return `${os.homedir()}/Library/Application Support`;
    case 'linux':
      return `${os.homedir()}/.config`;
    case 'win32':
      return process.env.APPDATA as string;
    default:
      return '/var/local';
  }
};
