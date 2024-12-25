import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AllSongsScreen from './AllSongsScreen';
import FavoritesScreen from './FavoritesScreen';

const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="All Songs" component={AllSongsScreen} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
