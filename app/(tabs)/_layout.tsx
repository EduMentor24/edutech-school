import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEduTheme } from "@/lib/edutech/theme-context";

export default function TabLayout() {
  const { colors } = useEduTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, tabBarLabelStyle: { fontSize: 10, fontWeight: "700" }, tabBarStyle: { paddingTop: 7, paddingBottom: bottomPadding, height: tabBarHeight, backgroundColor: colors.tab, borderTopColor: colors.border, borderTopWidth: 1 } }}>
    <Tabs.Screen name="index" options={{ title: "Accueil", tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} /> }} />
    <Tabs.Screen name="courses" options={{ title: "Cours", tabBarIcon: ({ color }) => <MaterialIcons name="menu-book" size={23} color={color} /> }} />
    <Tabs.Screen name="quizzes" options={{ title: "Quiz", tabBarIcon: ({ color }) => <MaterialIcons name="quiz" size={23} color={color} /> }} />
    <Tabs.Screen name="exercises" options={{ title: "Exercices", tabBarIcon: ({ color }) => <MaterialIcons name="edit-note" size={24} color={color} /> }} />
    <Tabs.Screen name="profile" options={{ title: "Profil", tabBarIcon: ({ color }) => <MaterialIcons name="person-outline" size={24} color={color} /> }} />
  </Tabs>;
}
