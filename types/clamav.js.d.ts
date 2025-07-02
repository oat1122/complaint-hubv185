declare module 'clamav.js' {
  import { Readable } from 'stream';

  export interface Scanner {
    port: number;
    host: string;
    scan(
      target: Readable | string,
      callback: (err?: Error, file?: string, virus?: string) => void
    ): void;
  }

  export function createScanner(port?: number, host?: string): Scanner;
  export function ping(
    port: number,
    host: string,
    timeout: number,
    callback: (err?: Error) => void
  ): void;
  export function version(
    port: number,
    host: string,
    timeout: number,
    callback: (err?: Error, version?: string) => void
  ): void;

  const clamav: {
    createScanner: typeof createScanner;
    ping: typeof ping;
    version: typeof version;
  };

  export default clamav;
}
