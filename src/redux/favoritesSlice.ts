import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  allSongs: [
    { id: '1', title: 'Shape of You', artist: 'Ed Sheeran' },
    { id: '2', title: 'Blinding Lights', artist: 'The Weeknd' },
    { id: '3', title: 'Levitating', artist: 'Dua Lipa' },
    { id: '4', title: 'Despacito', artist: 'Luis fonsi' },
  ],
  favoriteSongs: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action) => {
      state.favoriteSongs = action.payload;
    },
    toggleFavorite: (state, action) => {
      const songId = action.payload;
      const isFavorite = state.favoriteSongs.some((song) => song.id === songId);

      if (isFavorite) {
        state.favoriteSongs = state.favoriteSongs.filter((song) => song.id !== songId);
      } else {
        const songToAdd = state.allSongs.find((song) => song.id === songId);
        if (songToAdd) state.favoriteSongs.push(songToAdd);
      }

      console.log('slice->'+JSON.stringify(state.favoriteSongs));
      // Persist the updated favorite songs to AsyncStorage right after updating the state
      AsyncStorage.setItem('favorites', JSON.stringify(state.favoriteSongs))
        .then(() => {
          console.log('Favorites successfully saved to AsyncStorage');
        })
        .catch((error) => {
          console.error('Error saving favorites to AsyncStorage:', error);
        });
    },
  },
});

// Actions
export const { setFavorites, toggleFavorite } = favoritesSlice.actions;

// Reducer
export default favoritesSlice.reducer;

// Thunks to load and save to AsyncStorage
export const loadFavoritesFromStorage = () => async (dispatch) => {
  try {
    const savedFavorites = await AsyncStorage.getItem('favorites');
    if (savedFavorites) {
      dispatch(setFavorites(JSON.parse(savedFavorites))); // Load saved favorites into Redux state
    }
  } catch (error) {
    console.error('Error loading favorites from AsyncStorage:', error);
  }
};

export const saveFavoritesToStorage = (favorites) => async () => {
  try {
    console.log('favorites -> '+favorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to AsyncStorage:', error);
  }
};
