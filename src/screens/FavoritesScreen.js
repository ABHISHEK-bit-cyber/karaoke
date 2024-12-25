import React, { useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';

const FavoritesScreen = () => {
  const favoriteSongs = useSelector(state => state.favorites.favoriteSongs);

  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      {favoriteSongs.length === 0 ? (
        <Text>No favorite songs yet</Text>
      ) : (
        <FlatList
          data={favoriteSongs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10 }}>
              <Text>{item.title} by {item.artist}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default FavoritesScreen;
