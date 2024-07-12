export class ApiFootBallClientConfig {
  key: string;
  host: string;
}

export class ApiFootBallModuleOptionsAsync {
  inject?: any[];
  useFactory: (...args: any[]) => ApiFootBallClientConfig;
  global?: boolean;
}
