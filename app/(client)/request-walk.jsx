import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PetSelector from '../../components/pet/WalkRequest/PetSelector';
import WalkerSelector from '../../components/pet/WalkRequest/WalkerSelector';
import WalkSchedule from '../../components/pet/WalkRequest/WalkSchedule';

export default function RequestWalkScreen({ navigation }) {
    const [step, setStep] = useState('select-pets');
    const [selectedPets, setSelectedPets] = useState([]);
    const [selectedWalker, setSelectedWalker] = useState(null);
    const [walkerSettings, setWalkerSettings] = useState(null);
    const router = useRouter(); 

    const handlePetsSelected = () => {
        if (selectedPets.length > 0) {
            setStep('select-walker');
        }
    };

    const handleWalkerSelected = (walker, settings) => {
        setSelectedWalker(walker);
        setWalkerSettings(settings);
        setStep('schedule');
    };

    const handleBackToWalkers = () => {
        setStep('select-walker');
        setSelectedWalker(null);
        setWalkerSettings(null);
    };

    const handleBackToPets = () => {
        setStep('select-pets');
        setSelectedWalker(null);
        setWalkerSettings(null);
    };

    const handleSuccess = () => {
        setStep('select-pets');
        setSelectedPets([]);
        setSelectedWalker(null);
        setWalkerSettings(null);
        router.push('/(client)');
    };

    return (
        <View style={styles.container}>
            {step === 'select-pets' && (
                <PetSelector
                    selectedPets={selectedPets}
                    onPetsChange={setSelectedPets}
                    onContinue={handlePetsSelected}
                />
            )}

            {step === 'select-walker' && (
                <WalkerSelector
                    onWalkerSelect={handleWalkerSelected}
                    onBack={handleBackToPets}
                />
            )}

            {step === 'schedule' && selectedWalker && (
                <WalkSchedule
                    selectedWalker={selectedWalker}
                    walkerSettings={walkerSettings}
                    selectedPets={selectedPets}
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
});