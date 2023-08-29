import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {searchDocuments} from '../Service/ServiceApi';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = () => {
  const [nisn, setNISN] = useState('');
  const [searchedDocuments, setSearchedDocuments] = useState([]);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [isDataNotFound, setIsDataNotFound] = useState(false);
  const service = 'http://192.168.1.20:3001';

  const handleSearch = async () => {
    try {
      const authToken = await AsyncStorage.getItem('token');

      if (nisn) {
        setIsSearchClicked(true);

        const response = await searchDocuments(authToken, nisn);

        if (response.data.length > 0) {
          setSearchedDocuments(response.data);
          setIsDataNotFound(false);
        } else {
          setSearchedDocuments([]);
          setIsDataNotFound(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = filename => {
    const fileUrl = `${service}/download/${filename}`;
    Linking.openURL(fileUrl);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Masukan NISN siswa"
          placeholderTextColor="gray"
          value={nisn}
          onChangeText={setNISN}
          keyboardType="numeric"
        />
        <Icon
          name="search1"
          size={30}
          color="black"
          onPress={handleSearch}
          style={styles.searchIcon}
        />
      </View>
      {isSearchClicked && (
        <View style={styles.resultContainer}>
          {isDataNotFound ? (
            <Text style={styles.notFoundText}>Data tidak ditemukan</Text>
          ) : (
            <FlatList
              data={searchedDocuments}
              keyExtractor={item => item.id_dokumen.toString()}
              renderItem={({item}) => (
                <View style={styles.documentItem}>
                  <View style={styles.documentInfo}>
                    <Text style={styles.infoLabel}>Nama</Text>
                    <Text style={styles.infoValue}>{item.nama_siswa}</Text>
                  </View>
                  <View style={styles.documentInfo}>
                    <Text style={styles.infoLabel}>File</Text>
                    <Text style={styles.infoValue}>{item.ijasah}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDownload(item.ijasah)}
                    style={styles.downloadButtonContainer}>
                    <Text style={styles.downloadButton}>Download</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabel: {
    fontWeight: 'bold',
    marginRight: 8,
    color: 'gray',
  },
  infoValue: {
    flex: 1,
    color: 'gray',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    color: 'gray',
  },
  searchIcon: {
    marginLeft: 8,
    right: 8,
  },
  resultContainer: {
    flex: 1,
  },
  documentItem: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
  },
  filename: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notFoundText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 12,
  },
  downloadButtonContainer: {
    backgroundColor: 'skyblue',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  downloadButton: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SearchScreen;
