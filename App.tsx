import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { loadFavoritesFromStorage } from './src/redux/favoritesSlice';
import TabNavigator from './src/screens/TabNavigator';
import { store } from './src/redux/store';
import { createStackNavigator } from '@react-navigation/stack';
import Karaoke from './src/screens/Karaoke';
import Toast from 'react-native-toast-message';



const App = () => {
  const dispatch = useDispatch();
  const Stack = createStackNavigator();

  useEffect(() => {
    dispatch(loadFavoritesFromStorage());
  }, [dispatch]);

  

  return (
    <>
    <NavigationContainer>
      <Stack.Navigator>
          <Stack.Screen name="Home" component={Karaoke} />
          <Stack.Screen name="Favorites" component={TabNavigator} />
        </Stack.Navigator>
    </NavigationContainer>
    <Toast />
    </>
  );
};

export default () => (
  <Provider store={store}> 
    <App />
  </Provider>
);
