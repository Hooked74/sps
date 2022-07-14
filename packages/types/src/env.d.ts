declare namespace NodeJS {
  interface CustomProcessEnv {
    readonly ConEmuTask: "{cmd::Cmder}";
    readonly TERM_PROGRAM: "vscode";
    readonly TERM: "linux" | "xterm-256color" | "alacritty";
    readonly CI: boolean;
    readonly WT_SESSION: boolean;
    readonly NODE_ENV: "development" | "production" | "test";
    readonly VITE_TEST_BUILD: boolean;
    readonly VITE_DEBUG_BUILD: boolean;
    readonly NODE_NO_WARNINGS: int;
    readonly SPS_API_PREFIX: string;
    readonly SPS_FETCHER_LOG_LEVEL: string;
  }
}

declare interface ImportMeta {
  readonly env: NodeJS.CustomProcessEnv;
}
