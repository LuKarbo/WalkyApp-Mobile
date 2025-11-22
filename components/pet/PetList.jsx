import { FlatList, StyleSheet, View } from 'react-native';
import PetCard from './PetCard';

export default function PetList({ pets, onEditPet, onRequestWalk }) {
    return (
        <View style={styles.container}>
            <FlatList
                data={pets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PetCard
                        pet={item}
                        onEditPet={onEditPet}
                        onRequestWalk={onRequestWalk}
                    />
                )}
                contentContainerStyle={styles.listContent}
                numColumns={1}
                scrollEnabled={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    listContent: {
        padding: 16,
        gap: 16,
    },
});