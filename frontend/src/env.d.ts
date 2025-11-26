interface ImportMetaEnv {
    readonly VITE_API_BASE: string;
    readonly DEV: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }