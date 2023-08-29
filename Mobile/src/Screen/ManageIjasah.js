import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import image from '../Asset/smk.png';
import HandleDokumen from './HandleDokumen';


const ManageIjasah = () => {
  const navigation = useNavigation();
  const handleback = () => {
    navigation.navigate('Menu');
  };

  const handleUpload = () => {
    navigation.navigate('Upload');
  };

  const handleDokumen= () => {
    navigation.navigate('Dokumen');
  };
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 20,
              color: 'gray',
              fontWeight: 'bold',
              padding: 20,
            }}>
            Pilih Menu
          </Text>
        </View>
        <TouchableOpacity onPress={handleback}>
          <Icon2
            name="chevron-back-circle-sharp"
            size={45}
            color="white"
            style={{left: 40, bottom: '50%'}}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.gridContainer}>
        <Animatable.View
          style={styles.gridItem}
          animation="slideInLeft"
          iterationCount={1}
          iterationDelay={350}
          easing="ease-in-out">
          <Text style={styles.title}>Upload Ijazah</Text>
          <TouchableOpacity style={styles.button} onPress={handleUpload}>
            <Icon name="upload" size={24} color="white" />
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View
          style={styles.gridItem}
          animation="slideInRight"
          iterationCount={1}
          iterationDelay={350}
          easing="ease-in-out">
          <Text style={styles.title}>Arsip</Text>
          <TouchableOpacity style={styles.button}  onPress={handleDokumen}>
            <Icon1 name="cursor-default-click" size={24} color="white" />
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '80%',
    backgroundColor: 'skyblue',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  gridItem: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    margin: 10,
    elevation: 25,
    borderWidth: 1,
    borderColor: 'skyblue',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    color:"gray",
  },
  button: {
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    width: 200,
    height: 70,
    borderColor: 'skyblue',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    top: 130,
    left: 115,
    elevation: 25,
  },
});

export default ManageIjasah;
