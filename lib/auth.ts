export const AUTH_STORAGE_KEY = "assetIntegrityAuth";
export const AUTH_USER_KEY = "assetIntegrityUser";
export const AUTH_REMEMBER_ME_KEY = "assetIntegrityRememberMe";
export const AUTH_LOGIN_AT_KEY = "assetIntegrityLoginAt";
export const AUTH_EXPIRES_AT_KEY = "assetIntegrityExpiresAt";
export const AUTH_EXPIRED_MESSAGE_KEY = "assetIntegritySessionExpired";
export const DUMMY_USERNAME = "superadmin";
export const DUMMY_PASSWORD = "superadmin";
export const SESSION_DURATION_MS = 60 * 60 * 1000;

export const AUTH_KEYS = {
  auth: AUTH_STORAGE_KEY,
  user: AUTH_USER_KEY,
  rememberMe: AUTH_REMEMBER_ME_KEY,
  loginAt: AUTH_LOGIN_AT_KEY,
  expiresAt: AUTH_EXPIRES_AT_KEY,
  expiredMessage: AUTH_EXPIRED_MESSAGE_KEY
} as const;

export interface AuthUser {
  username: string;
  name: string;
  role: string;
  organization: string;
}

export interface AuthSession {
  authenticated: boolean;
  user: AuthUser;
  rememberMe: boolean;
  loginAt: number;
  expiresAt?: number;
  expired: boolean;
}

export interface LoginPayload {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

interface ClearSessionOptions {
  preserveExpiredMessage?: boolean;
}

export const DUMMY_USER: AuthUser = {
  username: DUMMY_USERNAME,
  name: "Budi Santoso",
  role: "Superadmin",
  organization: "SUCOFINDO"
};

export function isDummyCredentialValid(username: string, password: string) {
  return username.trim() === DUMMY_USERNAME && password === DUMMY_PASSWORD;
}

function canUseStorage() {
  if (typeof window === "undefined") return false;

  try {
    return Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function readNumber(key: string) {
  if (!canUseStorage()) return undefined;

  const value = window.localStorage.getItem(key);
  if (!value) return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function readUser() {
  if (!canUseStorage()) return DUMMY_USER;

  try {
    const stored = window.localStorage.getItem(AUTH_USER_KEY);
    return stored ? ({ ...DUMMY_USER, ...JSON.parse(stored) } as AuthUser) : DUMMY_USER;
  } catch {
    return DUMMY_USER;
  }
}

export function login(payload: LoginPayload): LoginResult;
export function login(username: string, password: string, rememberMe: boolean): LoginResult;
export function login(payloadOrUsername: LoginPayload | string, passwordValue?: string, rememberMeValue?: boolean): LoginResult {
  const payload =
    typeof payloadOrUsername === "string"
      ? {
          username: payloadOrUsername,
          password: passwordValue ?? "",
          rememberMe: Boolean(rememberMeValue)
        }
      : payloadOrUsername;
  const { username, password, rememberMe } = payload;

  if (!isDummyCredentialValid(username, password)) {
    return { success: false, error: "Invalid email/username or password." };
  }

  if (!canUseStorage()) {
    return { success: false, error: "Secure session storage is not available in this browser." };
  }

  const loginAt = Date.now();
  window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DUMMY_USER));
  window.localStorage.setItem(AUTH_REMEMBER_ME_KEY, rememberMe ? "true" : "false");
  window.localStorage.setItem(AUTH_LOGIN_AT_KEY, String(loginAt));
  window.localStorage.removeItem(AUTH_EXPIRED_MESSAGE_KEY);

  if (rememberMe) {
    window.localStorage.removeItem(AUTH_EXPIRES_AT_KEY);
  } else {
    window.localStorage.setItem(AUTH_EXPIRES_AT_KEY, String(loginAt + SESSION_DURATION_MS));
  }

  return { success: true };
}

export function clearSession(options: ClearSessionOptions = {}) {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  window.localStorage.removeItem(AUTH_REMEMBER_ME_KEY);
  window.localStorage.removeItem(AUTH_LOGIN_AT_KEY);
  window.localStorage.removeItem(AUTH_EXPIRES_AT_KEY);

  if (!options.preserveExpiredMessage) {
    window.localStorage.removeItem(AUTH_EXPIRED_MESSAGE_KEY);
  }
}

export function markSessionExpired() {
  if (!canUseStorage()) return;
  window.localStorage.setItem(AUTH_EXPIRED_MESSAGE_KEY, "true");
}

export function consumeSessionExpiredMessage() {
  if (!canUseStorage()) return false;

  const expired = window.localStorage.getItem(AUTH_EXPIRED_MESSAGE_KEY) === "true";
  window.localStorage.removeItem(AUTH_EXPIRED_MESSAGE_KEY);
  return expired;
}

export function hasSessionExpiredMessage() {
  if (!canUseStorage()) return false;
  return window.localStorage.getItem(AUTH_EXPIRED_MESSAGE_KEY) === "true";
}

export function logout() {
  clearSession();
}

export function getSession(): AuthSession | null {
  if (!canUseStorage()) return null;

  const authenticated = window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  if (!authenticated) return null;

  const rememberValue = window.localStorage.getItem(AUTH_REMEMBER_ME_KEY);
  const rememberMe = rememberValue !== "false";
  const loginAt = readNumber(AUTH_LOGIN_AT_KEY) ?? Date.now();
  const expiresAt = rememberMe ? undefined : readNumber(AUTH_EXPIRES_AT_KEY) ?? loginAt + SESSION_DURATION_MS;
  const expired = !rememberMe && typeof expiresAt === "number" && Date.now() > expiresAt;

  return {
    authenticated,
    user: readUser(),
    rememberMe,
    loginAt,
    expiresAt,
    expired
  };
}

export function isSessionValid() {
  const session = getSession();
  return Boolean(session?.authenticated && !session.expired);
}

export function getSessionExpiry() {
  return getSession()?.expiresAt;
}

export function getCurrentUser() {
  return getSession()?.user ?? null;
}
