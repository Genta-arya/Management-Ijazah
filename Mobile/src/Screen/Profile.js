import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/EvilIcons';
import Edit from 'react-native-vector-icons/Feather';
import axios from 'axios';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
const Profile = () => {
  const [username, setUsername] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalName, setIsModalName] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [currentName, setCurrentName] = useState('');
  const service = 'http://192.168.1.20:3001';
  const [message, setMessage] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isProfileImageChanged, setIsProfileImageChanged] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
        const storedNewName = await AsyncStorage.getItem('name');
        if (storedNewName) {
          setNewName(storedNewName);
        }

        const storedProfileImage = await AsyncStorage.getItem('profileImage');
        if (storedProfileImage) {
          setProfileImage(storedProfileImage);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChangeImage = async () => {
    try {
      launchImageLibrary({}, response => {
        if (response.assets && response.assets.length > 0) {
          const newProfileImageUrl = response.assets[0].uri;
          setProfileImage(newProfileImageUrl);
          setIsProfileImageChanged(true);
          handleSaveProfileImage();
          AsyncStorage.setItem('profileImage', newProfileImageUrl);
        }
      });
    } catch (error) {
      console.error('Error changing profile image:', error);
      setMessage('An error occurred while changing profile image');
    }
  };

  const handleSaveProfileImage = async () => {
    try {
      const authToken = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('uid');
      const formData = new FormData();
      formData.append('profileImage', {
        uri: profileImage,
        name: 'profileImage.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch(
        `${service}/auth/update-profile-image/${userId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        },
      );

      const data = await response.json();
      setMessage(data.message);
      setIsProfileImageChanged(false);
    } catch (error) {
      console.error('Error updating profile image:', error);
      setMessage('An error occurred while updating profile image');
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setNewPassword('');
  };

  const handleChangePassword = async () => {
    try {
      const authToken = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('uid');

      const response = await fetch(
        `${service}/auth/update-password/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('An error occurred while changing password');
    }
  };

  const handleChangeName = async () => {
    try {
      const authToken = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('uid');

      const response = await axios.put(
        `${service}/auth/update-profile-name/${userId}`,
        {newName},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      if (response.status === 200) {
        // Update the locally stored username and AsyncStorage
        setUsername(newName);
        await AsyncStorage.setItem('name', newName);
        setNewName('');
        setIsModalName(false);
      }
    } catch (error) {}
  };
  const handleCloseModalName = () => {
    setIsModalName(false);
    setNewPassword('');
  };
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {profileImage ? (
            <Image source={{uri: profileImage}} style={styles.profileImage} />
          ) : (
            <Icon name="image" size={200} color="gray" />
          )}
          <TouchableOpacity style={styles.iconEdit} onPress={handleChangeImage}>
            <Edit name="edit" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsModalName(true)}>
          <Text style={styles.buttonText}>Ganti Nama</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsModalVisible(true)}>
          <Text style={styles.buttonText}>Ganti Password</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Ganti Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <View style={styles.sideBySideButtons}>
            <TouchableOpacity
              style={styles.touchableOpacityButton}
              onPress={handleChangePassword}>
              <Text style={styles.touchableOpacityText}>Simpan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchableOpacityButton}
              onPress={handleCloseModal}>
              <Text style={styles.touchableOpacityText}>Batal</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </Modal>

      <Modal visible={isModalName} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Ganti Nama</Text>

          <TextInput
            style={styles.input}
            placeholder="Masukan Nama (Maksimal 15 Karakter)"
            placeholderTextColor="gray"
            value={newName}
            onChangeText={text => {
              if (text.length <= 12) {
                setNewName(text);
              }
            }}
            maxLength={12}
          />
          <View style={styles.sideBySideButtons}>
            <TouchableOpacity
              style={styles.touchableOpacityButton}
              onPress={handleChangeName}>
              <Text style={styles.touchableOpacityText}>Simpan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchableOpacityButton}
              onPress={handleCloseModalName}>
              <Text style={styles.touchableOpacityText}>Batal</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
    backgroundColor: '#F4F4F4',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 50,
    width: '80%',
    borderWidth: 1,
    borderColor: 'skyblue',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'gray',
  },
  username: {
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.59)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    color: 'gray',
  },
  messageText: {
    marginVertical: 10,

    color: 'white',
  },
  sideBySideButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  touchableOpacityButton: {
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    margin: 10,
    width: 100,
  },
  touchableOpacityText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  iconEdit: {
    position: 'absolute',
    bottom: 0,
    right: 50,
    backgroundColor: 'skyblue',
    padding: 5,
    borderRadius: 10,
  },
});

export default Profile;
