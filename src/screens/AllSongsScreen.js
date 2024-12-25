import React from 'react';
import { View, Text, FlatList, Button, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, saveFavoritesToStorage } from '../redux/favoritesSlice';

const AllSongsScreen = () => {
  const dispatch = useDispatch();
  const allSongs = useSelector(state => state.favorites.allSongs);
  const favoriteSongs = useSelector(state => state.favorites.favoriteSongs);

  const isFavorite = (songId) => favoriteSongs.some(song => song.id === songId);

  const handleToggleFavorite = (songId) => {
    dispatch(toggleFavorite(songId));
    // dispatch(saveFavoritesToStorage(favoriteSongs));
    console.log('favoriteSongs ->'+JSON.stringify(favoriteSongs));
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={allSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text>{item.title} by {item.artist}</Text>
            <Button
              title={isFavorite(item.id) ? 'Unfavorite' : 'Favorite'}
              onPress={() => handleToggleFavorite(item.id)}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default AllSongsScreen;
