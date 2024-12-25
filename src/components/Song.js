import React from 'react';
import { Button, Text, View } from 'react-native';

const Song = ({ song, onAdd, onRemove }) => (
  <View style={{ padding: 10, borderBottomWidth: 1 }}>
    <Text>{song.title} by {song.artist}</Text>
    <Button
      title="Add to Favorites"
      onPress={() => onAdd(song)}
    />
    <Button
      title="Remove from Favorites"
      onPress={() => onRemove(song.id)}
    />
  </View>
);

export default Song;
