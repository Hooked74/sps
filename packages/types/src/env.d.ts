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
    readonly VITE_REACT_CONTEXT_STORAGE_LOG_LEVEL: 0 | 1 | 2 | 3;
    readonly VITE_STORAGE_DEVTOOLS_ENABLE: boolean;
  }
}

declare interface ImportMeta {
  readonly env: NodeJS.CustomProcessEnv;
}
