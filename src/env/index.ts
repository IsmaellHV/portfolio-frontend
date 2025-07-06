interface IEnvironment {
  ENV: string;
  APP: {
    TITLE: string;
    SYSTEM: string;
    CODE: string;
    VERSION_MAJOR: string;
    VERSION_MEDIUM: string;
    VERSION_LOW: string;
  };
  INDEXEDDB: {
    NAME: string;
    VERSION: number;
  };
  RECAPTCHA: {
    KEY: string;
  };
  INFO: {
    URL: string;
    MAIL: string;
    NAME: string;
    FULLNAME: string;
    LOCATION: string;
  };
  META: {
    TITLE: string;
    DESCRIPTION: string;
    KEYWORDS: string;
    AUTHOR: string;
    CANONICAL: string;
    OG_URL: string;
    OG_TITLE: string;
    OG_DESCRIPTION: string;
    OG_IMAGE: string;
    TW_URL: string;
    TW_TITLE: string;
    TW_DESCRIPTION: string;
    TW_IMAGE: string;
    IN_URL: string;
    IN_TITLE: string;
    IN_DESCRIPTION: string;
    IN_IMAGE: string;
    GITHUB_URL: string;
    GITHUB_TITLE: string;
    GITHUB_DESCRIPTION: string;
    GITHUB_IMAGE: string;
  };
  KEY_ENCRYPT: {
    REQUIRE: string;
    KEY: string;
  };
  ROUTE: {
    MASTER: string;
    MASTERMAIN: string;
    MASTERHOME: string;
    MASTERCONTACT: string;
    MASTERABOUT: string;
    INSPIREHUB: string;
    INSPIREHUBMAIN: string;
    INSPIREHUBHOME: string;
    INSPIREHUBFASTLINK: string;
    INSPIREHUBGAMES: string;
    INSPIREHUBGAMESTETRIS: string;
    INSPIREHUBGAMESSNAKE: string;
    INSPIREHUBLOGIN: string;
  };

  INSPIREHUB_FASTLINK: {
    AUTHBASIC: string;
    URL: string;
    SCHEMA: string;
    ENTITY: string;
    SCHEMA_DESC: string;
    ENTITY_DESC: string;
  };

  INSPIREHUB_GAMES: {
    SCHEMA: string;
    ENTITY: string;
    SCHEMA_DESC: string;
    ENTITY_DESC: string;
  };

  INSPIREHUB_GAMESTETRIS: {
    SCHEMA: string;
    ENTITY: string;
    SCHEMA_DESC: string;
    ENTITY_DESC: string;
  };

  INSPIREHUB_GAMESSNAKE: {
    SCHEMA: string;
    ENTITY: string;
    SCHEMA_DESC: string;
    ENTITY_DESC: string;
  };

  SUPABASE: {
    URL: string;
    ANON_KEY: string;
  };
}

export const ENVIRONMENT: IEnvironment = {
  ENV: import.meta.env.VITE_ENV || '',

  APP: {
    TITLE: import.meta.env.VITE_APP_TITLE || '',
    SYSTEM: import.meta.env.VITE_APP_SYSTEM || '',
    CODE: import.meta.env.VITE_APP_CODE || '',
    VERSION_MAJOR: import.meta.env.VITE_APP_VERSION_MAJOR || '',
    VERSION_MEDIUM: import.meta.env.VITE_APP_VERSION_MEDIUM || '',
    VERSION_LOW: import.meta.env.VITE_APP_VERSION_LOW || '',
  },

  INDEXEDDB: {
    NAME: import.meta.env.VITE_INDEXEDDB_NAME || '',
    VERSION: Number(import.meta.env.VITE_INDEXEDDB_VERSION) || 1,
  },

  RECAPTCHA: {
    KEY: import.meta.env.VITE_RECAPTCHA_KEY || '',
  },

  INFO: {
    URL: import.meta.env.VITE_INFO_URL || '',
    MAIL: import.meta.env.VITE_INFO_MAIL || '',
    NAME: import.meta.env.VITE_INFO_NAME || '',
    FULLNAME: import.meta.env.VITE_INFO_FULLNAME || '',
    LOCATION: import.meta.env.VITE_INFO_LOCATION || '',
  },

  META: {
    TITLE: import.meta.env.VITE_META_TITLE || '',
    DESCRIPTION: import.meta.env.VITE_META_DESCRIPTION || '',
    KEYWORDS: import.meta.env.VITE_META_KEYWORDS || '',
    AUTHOR: import.meta.env.VITE_META_AUTHOR || '',
    CANONICAL: import.meta.env.VITE_META_CANONICAL || '',
    OG_URL: import.meta.env.VITE_META_OG_URL || '',
    OG_TITLE: import.meta.env.VITE_META_OG_TITLE || '',
    OG_DESCRIPTION: import.meta.env.VITE_META_OG_DESCRIPTION || '',
    OG_IMAGE: import.meta.env.VITE_META_OG_IMAGE || '',
    TW_URL: import.meta.env.VITE_META_TW_URL || '',
    TW_TITLE: import.meta.env.VITE_META_TW_TITLE || '',
    TW_DESCRIPTION: import.meta.env.VITE_META_TW_DESCRIPTION || '',
    TW_IMAGE: import.meta.env.VITE_META_TW_IMAGE || '',
    IN_URL: import.meta.env.VITE_META_IN_URL || '',
    IN_TITLE: import.meta.env.VITE_META_IN_TITLE || '',
    IN_DESCRIPTION: import.meta.env.VITE_META_IN_DESCRIPTION || '',
    IN_IMAGE: import.meta.env.VITE_META_IN_IMAGE || '',
    GITHUB_URL: import.meta.env.VITE_META_GITHUB_URL || '',
    GITHUB_TITLE: import.meta.env.VITE_META_GITHUB_TITLE || '',
    GITHUB_DESCRIPTION: import.meta.env.VITE_META_GITHUB_DESCRIPTION || '',
    GITHUB_IMAGE: import.meta.env.VITE_META_GITHUB_IMAGE || '',
  },

  KEY_ENCRYPT: {
    REQUIRE: import.meta.env.VITE_REQUIRE_ENCRYPT || '0',
    KEY: import.meta.env.VITE_KEY_ENCRYPT || '',
  },

  ROUTE: {
    MASTER: '/',
    MASTERMAIN: 'main',
    MASTERHOME: 'home',
    MASTERCONTACT: 'contact',
    MASTERABOUT: 'about',
    INSPIREHUB: '/inspire-hub',
    INSPIREHUBMAIN: '/inspire-hub/main',
    INSPIREHUBHOME: '/inspire-hub/home',
    INSPIREHUBFASTLINK: '/inspire-hub/fastLink',
    INSPIREHUBGAMES: '/inspire-hub/games',
    INSPIREHUBGAMESTETRIS: '/inspire-hub/games/tetris',
    INSPIREHUBGAMESSNAKE: '/inspire-hub/games/snake',
    INSPIREHUBLOGIN: '/inspire-hub/login',
  },

  INSPIREHUB_FASTLINK: {
    AUTHBASIC: import.meta.env.VITE_VAR_INSPIREHUB_FASTLINK_AUTHBASIC || '',
    URL: import.meta.env.VITE_VAR_INSPIREHUB_FASTLINK_URL || '',
    SCHEMA: import.meta.env.VITE_VAR_INSPIREHUB_FASTLINK_SCHEMA || '',
    ENTITY: import.meta.env.VITE_VAR_INSPIREHUB_FASTLINK_ENTITY || '',
    SCHEMA_DESC: import.meta.env.VITE_VAR_INSPIREHUB_FASTLINK_SCHEMA_DESC || '',
    ENTITY_DESC: import.meta.env.VITE_VAR_INSPIREHUB_FASTLINK_ENTITY_DESC || '',
  },

  INSPIREHUB_GAMES: {
    SCHEMA: import.meta.env.VITE_VAR_INSPIREHUB_GAMES_SCHEMA || '',
    ENTITY: import.meta.env.VITE_VAR_INSPIREHUB_GAMES_ENTITY || '',
    SCHEMA_DESC: import.meta.env.VITE_VAR_INSPIREHUB_GAMES_SCHEMA_DESC || '',
    ENTITY_DESC: import.meta.env.VITE_VAR_INSPIREHUB_GAMES_ENTITY_DESC || '',
  },

  INSPIREHUB_GAMESTETRIS: {
    SCHEMA: import.meta.env.VITE_VAR_INSPIREHUB_GAMESTETRIS_SCHEMA || '',
    ENTITY: import.meta.env.VITE_VAR_INSPIREHUB_GAMESTETRIS_ENTITY || '',
    SCHEMA_DESC: import.meta.env.VITE_VAR_INSPIREHUB_GAMESTETRIS_SCHEMA_DESC || '',
    ENTITY_DESC: import.meta.env.VITE_VAR_INSPIREHUB_GAMESTETRIS_ENTITY_DESC || '',
  },

  INSPIREHUB_GAMESSNAKE: {
    SCHEMA: import.meta.env.VITE_VAR_INSPIREHUB_GAMESSNAKE_SCHEMA || '',
    ENTITY: import.meta.env.VITE_VAR_INSPIREHUB_GAMESSNAKE_ENTITY || '',
    SCHEMA_DESC: import.meta.env.VITE_VAR_INSPIREHUB_GAMESSNAKE_SCHEMA_DESC || '',
    ENTITY_DESC: import.meta.env.VITE_VAR_INSPIREHUB_GAMESSNAKE_ENTITY_DESC || '',
  },

  SUPABASE: {
    URL: import.meta.env.VITE_VAR_SUPABASE_URL || '',
    ANON_KEY: import.meta.env.VITE_VAR_SUPABASE_ANON_KEY || '',
  },
};
