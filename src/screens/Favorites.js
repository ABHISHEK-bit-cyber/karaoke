import { FlatList, Text, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite, loadFavoritesFromStorage, saveFavoritesToStorage } from '../redux/favoritesSlice';
import Song from "../components/Song";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Favorites = () => {
    const dispatch = useDispatch();
    const favorites = useSelector(state => state.favorites.favorites);
  
    useEffect(() => {
      dispatch(loadFavoritesFromStorage());
    }, [dispatch]);
  
    const handleAddFavorite = (song) => {
      dispatch(addFavorite(song));
      dispatch(saveFavoritesToStorage([...favorites, song]));
    };
  
    const handleRemoveFavorite = (songId) => {
      const updatedFavorites = favorites.filter(song => song.id !== songId);
      dispatch(removeFavorite(songId));
      dispatch(saveFavoritesToStorage(updatedFavorites));
    };
  
    return (
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text>{item.title} by {item.artist}</Text>
          )}
        />
        <Song
          song={{ id: '123', title: 'Shape of You', artist: 'Ed Sheeran' }}
          onAdd={handleAddFavorite}
          onRemove={handleRemoveFavorite}
        />
      </SafeAreaView>
    );
  };

export default Favorites;