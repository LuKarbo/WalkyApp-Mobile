import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useToast } from '../../backend/Context/ToastContext';
import { PetsController } from '../../backend/Controllers/PetsController';
import LoadingScreen from '../../components/common/LoadingScreen';
import EmptyPets from '../../components/pet/EmptyPets';
import PetHeader from '../../components/pet/PetHeader';
import PetList from '../../components/pet/PetList';
import { useAuth } from '../../hooks/useAuth';

export default function PetsIndexScreen() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const { showSuccess, showError } = useToast();

    const loadPets = async () => {
        try {
            setLoading(true);
            if (!user?.id) return;
            const data = await PetsController.fetchPetsByOwner(user.id);
            setPets(data);
        } catch (err) {
            
            showError('Error al cargar las mascotas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPets();
    }, [user?.id]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadPets();
        setRefreshing(false);
    };

    const handleAddPet = () => {
        router.push('/(pet)/add-pet');
    };

    const handleEditPet = (pet) => {
        router.push({
            pathname: '/(pet)/edit-pet',
            params: { petId: pet.id }
        });
    };

    const handleRequestWalk = (pet) => {
        router.push({
            pathname: '/(pet)/request-walk-single',
            params: { 
                petId: pet.id,
                petData: JSON.stringify(pet)
            }
        });
    };

    if (loading) {
        return <LoadingScreen message="Cargando mascotas..." />;
    }

    return (
        <ScrollView 
            style={styles.container}
            refreshing={refreshing}
            onRefresh={handleRefresh}
        >
            <PetHeader 
                onAddPet={handleAddPet}
            />

            {pets.length === 0 ? (
                <EmptyPets onAddPet={handleAddPet} />
            ) : (
                <PetList 
                    pets={pets}
                    onEditPet={handleEditPet}
                    onRequestWalk={handleRequestWalk}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
});