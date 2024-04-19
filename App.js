// App.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Linking, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [websites, setWebsites] = useState([]);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      const storedWebsites = await AsyncStorage.getItem('websites');
      if (storedWebsites !== null) {
        setWebsites(JSON.parse(storedWebsites));
      }
    } catch (error) {
      console.error('Error loading websites:', error);
    }
  };

  const saveWebsite = async () => {
    try {
      const newWebsite = { websiteUrl };
      let updatedWebsites = [...websites];
      if (editingIndex !== null) {
        updatedWebsites[editingIndex] = newWebsite;
        setEditingIndex(null);
      } else {
        updatedWebsites = [...websites, newWebsite];
      }
      await AsyncStorage.setItem('websites', JSON.stringify(updatedWebsites));
      setWebsites(updatedWebsites);
      setWebsiteUrl('');
    } catch (error) {
      console.error('Error saving website:', error);
    }
  };

  const deleteWebsite = async (index) => {
    try {
      const updatedWebsites = websites.filter((_, i) => i !== index);
      await AsyncStorage.setItem('websites', JSON.stringify(updatedWebsites));
      setWebsites(updatedWebsites);
    } catch (error) {
      console.error('Error deleting website:', error);
    }
  };

  const editWebsite = (index) => {
    const { websiteUrl } = websites[index];
    setWebsiteUrl(websiteUrl);
    setEditingIndex(index);
  };

  const openWebsite = (url) => {
    Linking.openURL(url).catch((error) => {
      console.error('Error opening website:', error);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Website Storage</Text>
      </View>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Website URL"
          value={websiteUrl}
          onChangeText={(text) => setWebsiteUrl(text)}
        />
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={saveWebsite}>
          <Text style={styles.buttonText}>Save Website</Text>
        </TouchableOpacity>
        <ScrollView style={styles.websiteList}>
          {websites.map((website, index) => (
            <View key={index} style={styles.websiteItem}>
              <View style={styles.websiteInfo}>
                <Text style={styles.websiteText}>{website.websiteUrl}</Text>
              </View>
              <TouchableOpacity style={[styles.button, styles.visitButton]} onPress={() => openWebsite(website.websiteUrl)}>
                <Text style={styles.buttonText}>Visit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => editWebsite(index)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => deleteWebsite(index)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 40,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 20, // Add padding top
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
  },
  visitButton: {
    backgroundColor: '#3498db',
  },
  editButton: {
    backgroundColor: '#f1c40f',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#ffffff',
  },
  websiteList: {
    marginBottom: 10,
  },
  websiteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ecf0f1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  websiteInfo: {
    flex: 1,
  },
  websiteText: {
    flex: 1,
  },
});

export default App;
