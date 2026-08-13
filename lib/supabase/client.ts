import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("La configuration Supabase publique est requise pour démarrer EduTech School.");
}

type SecureStoreModule = typeof import("expo-secure-store");

function getSecureStore(): SecureStoreModule {
  return require("expo-secure-store") as SecureStoreModule;
}

const nativeSecureStorage = {
  getItem: (key: string) => getSecureStore().getItemAsync(key),
  setItem: (key: string, value: string) => getSecureStore().setItemAsync(key, value),
  removeItem: (key: string) => getSecureStore().deleteItemAsync(key),
};

const isBrowser = typeof window !== "undefined";
const webStorage = {
  getItem: (key: string) => (isBrowser ? AsyncStorage.getItem(key) : Promise.resolve(null)),
  setItem: (key: string, value: string) => (isBrowser ? AsyncStorage.setItem(key, value) : Promise.resolve()),
  removeItem: (key: string) => (isBrowser ? AsyncStorage.removeItem(key) : Promise.resolve()),
};

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: Platform.OS === "web" ? webStorage : nativeSecureStorage,
    autoRefreshToken: Platform.OS !== "web" || isBrowser,
    persistSession: Platform.OS !== "web" || isBrowser,
    detectSessionInUrl: false,
  },
});
