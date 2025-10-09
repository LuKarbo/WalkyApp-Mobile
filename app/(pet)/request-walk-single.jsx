import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WalkerSelector from '../../components/pet/WalkRequest/WalkerSelector';
import WalkSchedule from '../../components/pet/WalkRequest/WalkSchedule';

export default function RequestWalkSingleScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const petData = params.petData ? JSON.parse(params.petData) : null;
    
    const [step, setStep] = useState(petData ? 'select-walker' : 'loading');
    const [selectedPet, setSelectedPet] = useState(petData);
    const [selectedWalker, setSelectedWalker] = useState(null);
    const [walkerSettings, setWalkerSettings] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!petData) {
            setError('No se recibió información de la mascota');
        }
    }, [petData]);

    const handleWalkerSelected = (walker, settings) => {
        setSelectedWalker(walker);
        setWalkerSettings(settings);
        setStep('schedule');
    };

    const handleBackToPets = () => {
        router.back();
    };

    const handleBackToWalkers = () => {
        setStep('select-walker');
        setSelectedWalker(null);
        setWalkerSettings(null);
    };

    const handleSuccess = () => {
        router.push('/(pet)');
    };

    if (step === 'loading' || !selectedPet) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error || 'Cargando...'}</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {step === 'select-walker' && (
                <WalkerSelector
                    onWalkerSelect={handleWalkerSelected}
                    onBack={handleBackToPets}
                />
            )}

            {step === 'schedule' && selectedWalker && selectedPet && (
                <WalkSchedule
                    selectedWalker={selectedWalker}
                    walkerSettings={walkerSettings}
                    selectedPets={[selectedPet]}
                    onBack={handleBackToWalkers}
                    onSuccess={handleSuccess}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        color: '#6b7280',
        fontSize: 16,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 16,
        textAlign: 'center',
    },
});