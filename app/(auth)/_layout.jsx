import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function AuthLayout() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
        router.replace(user.role === "walker" ? "/(walker)" : "/(client)");
        }
    }, [user]);

    return <Stack screenOptions={{ headerShown: false }} />;
}
