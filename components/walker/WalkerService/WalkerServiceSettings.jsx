import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

const WalkerServiceSettings = ({ settings, onSettingsChange, onSave, isSaving }) => {
    const handleLocationChange = (text) => {
        onSettingsChange({ location: text });
    };

    const handlePriceChange = (text) => {
        const price = text === '' ? 0 : parseFloat(text) || 0;
        onSettingsChange({ pricePerPet: price });
    };

    const handleDiscountToggle = (value) => {
        onSettingsChange({
            hasDiscount: value,
            discountPercentage: value ? settings.discountPercentage : 0
        });
    };

    const handleDiscountPercentageChange = (text) => {
        const value = text === '' ? 0 : Number(text);
        if (value >= 0 && value <= 100) {
            onSettingsChange({ discountPercentage: value });
        }
    };

    return (
        <View>
            <View style={styles.titleContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="settings" size={24} color="#ffffff" />
                </View>
                <Text style={styles.title}>Configuración</Text>
            </View>

            <View style={styles.settingsContainer}>
                <View style={styles.settingGroup}>
                    <Text style={styles.label}>Localidad</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="location" size={20} color="#3b82f6" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={settings.location || ''}
                            onChangeText={handleLocationChange}
                            placeholder="Ingresa tu localidad"
                            placeholderTextColor="#9ca3af"
                            editable={!isSaving}
                        />
                    </View>
                </View>

                <View style={styles.settingGroup}>
                    <Text style={styles.label}>Precio por paseo por mascota</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="cash" size={20} color="#10b981" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={settings.pricePerPet ? String(settings.pricePerPet) : '0'}
                            onChangeText={handlePriceChange}
                            placeholder="0"
                            placeholderTextColor="#9ca3af"
                            keyboardType="numeric"
                            editable={!isSaving}
                        />
                    </View>
                </View>

                <View style={styles.settingGroup}>
                    <Text style={styles.label}>Sistema de descuentos</Text>
                    <View style={styles.switchContainer}>
                        <View style={styles.switchLeft}>
                            <Ionicons name="pricetag" size={20} color="#f97316" />
                            <Text style={styles.switchLabel}>Activar descuento</Text>
                        </View>
                        <Switch
                            value={settings.hasDiscount}
                            onValueChange={handleDiscountToggle}
                            disabled={isSaving}
                            trackColor={{ false: "#d1d5db", true: "#f97316" }}
                            thumbColor="#ffffff"
                        />
                    </View>

                    {settings.hasDiscount && (
                        <View style={[styles.inputContainer, styles.percentageInput]}>
                            <TextInput
                                style={styles.input}
                                value={settings.discountPercentage ? String(settings.discountPercentage) : '0'}
                                onChangeText={handleDiscountPercentageChange}
                                placeholder="Porcentaje de descuento"
                                placeholderTextColor="#9ca3af"
                                keyboardType="numeric"
                                editable={!isSaving}
                            />
                            <Text style={styles.percentSymbol}>%</Text>
                        </View>
                    )}
                </View>
            </View>

            <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                onPress={onSave}
                disabled={isSaving}
            >
                <Text style={styles.saveButtonText}>
                    {isSaving ? 'Guardando...' : 'Guardar Configuración'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#8b5cf6",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1f2937",
    },
    settingsContainer: {
        gap: 24,
    },
    settingGroup: {
        gap: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#1f2937",
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        padding: 16,
    },
    switchLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    switchLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: "#1f2937",
        marginLeft: 12,
    },
    percentageInput: {
        marginTop: 12,
    },
    percentSymbol: {
        fontSize: 16,
        fontWeight: "700",
        color: "#f97316",
        marginLeft: 8,
    },
    saveButton: {
        backgroundColor: "#3b82f6",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 24,
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonDisabled: {
        backgroundColor: "#9ca3af",
        shadowOpacity: 0,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#ffffff",
    },
});

export default WalkerServiceSettings;