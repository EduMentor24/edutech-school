import { PropsWithChildren, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import { useEduTheme } from "@/lib/edutech/theme-context";
type AppScreenProps = PropsWithChildren<{ edges?: Edge[]; withPadding?: boolean }>;
export function AppScreen({ children, edges = ["top", "left", "right"], withPadding = true }: AppScreenProps) { const { colors } = useEduTheme(); const styles = useMemo(() => createStyles(colors.background, withPadding), [colors.background, withPadding]); return <View style={styles.outer}><SafeAreaView edges={edges} style={styles.safeArea}><View style={styles.content}>{children}</View></SafeAreaView></View>; }
const createStyles = (background: string, withPadding: boolean) => StyleSheet.create({ outer: { flex: 1, backgroundColor: background }, safeArea: { flex: 1 }, content: { flex: 1, paddingHorizontal: withPadding ? 20 : 0 } });
