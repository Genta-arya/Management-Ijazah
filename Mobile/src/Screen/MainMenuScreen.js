import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/Fontisto';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import profil from '../Asset/profile.png';
import image from '../Asset/smk.png';

const MainMenuScreen = () => {
  const navigation = useNavigation();
  const [expiredAlertShown, setExpiredAlertShown] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [startAnimation, setStartAnimation] = useState(false);




  useEffect(() => {
    // Fetch and set username from AsyncStorage
    AsyncStorage.getItem('username')
      .then(value => {
        if (value) {
          setUsername(value);
        }
      })
      .catch(error => {
        console.error('Error fetching username:', error);
      });

    const interval = setInterval(() => {
      checkToken();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (expiredAlertShown) {
      showExpiredAlert();
    }
  }, [expiredAlertShown]);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    const tokenExpiration = await AsyncStorage.getItem('tokenExpiration');
    console.log(token);

    if (!token || !tokenExpiration) {
      return;
    }

    const currentTimestamp = new Date().getTime();
    if (currentTimestamp > parseInt(tokenExpiration) && !expiredAlertShown) {
      setExpiredAlertShown(true);
    }
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const storedProfileImage = await AsyncStorage.getItem('profileImage');
        const storedProfileImages = await AsyncStorage.getItem('name');
        if (storedProfileImage) {
          setProfileImage(storedProfileImage);
        }
        if (storedProfileImages) {
          setUsername(storedProfileImages);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();

    const intervalId = setInterval(fetchProfileImage, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const showExpiredAlert = () => {
    Alert.alert(
      'Sesi Berakhir',
      'Sesi Anda telah berakhir. Harap masuk kembali.',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Login'); // Navigasi ke layar masuk
          },
        },
      ],
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('tokenExpiration');

      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleProfileClick = () => {
    setTimeout(() => {
      setStartAnimation(false);
      navigation.navigate('Profile');
    }, 500);
    setStartAnimation(true);
  };

  const handleIjasahClick = () => {
    navigation.navigate('Ijasah');
  };

  const handleSearchClick = () => {
    navigation.navigate('Search');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <View style={styles.card}>
          <Image source={image} style={styles.logo1} />
        </View>
      </View>

      <Animatable.View
        animation={startAnimation ? 'rubberBand' : null}
        duration={500}
        style={{width: '100%'}}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={handleProfileClick}>
          {profileImage && (
            <Image source={{uri: profileImage}} style={styles.logo} />
          )}
          <Text style={styles.screenName}>{username}</Text>
        </TouchableOpacity>
      </Animatable.View>
        <Text style={styles.screenTitle}></Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon2 name="logout" size={32} color="red" />
        <Text style={styles.logout}>Keluar</Text>
      </TouchableOpacity>

      <Animatable.View
        animation="zoomIn"
        iterationCount={1}
        iterationDelay={350}
        easing="ease-in-out"
        direction="normal">
        <View style={styles.contentContainer}>
          <View style={styles.iconsContainer}>
            <View style={styles.iconRow}>
              <View style={styles.iconCard}>
                <TouchableOpacity onPress={handleIjasahClick}>
                  <Icon
                    name="document"
                    size={50}
                    color="skyblue"
                    style={{alignSelf: 'center'}}
                  />
                  <Text style={styles.text}>Kelola Ijazah</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.iconCard}>
                <TouchableOpacity onPress={handleSearchClick}>
                  <Icon1
                    name="search"
                    size={50}
                    color="skyblue"
                    style={{alignSelf: 'center'}}
                  />
                  <Text style={styles.text}>Cari Ijazah</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Animatable.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
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
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    zIndex: 2,
  },
  menuItem: {
    padding: 10,
    marginRight: 5,
  },

  contentContainer: {
    flex: 1,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: 200,
    height: 70,
    borderColor: 'skyblue',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    alignSelf: 'center',
    top: 130,
    elevation: 25,
  },

  profileButton: {
    position: 'absolute',
    top: 10,
    left: 50,
    padding: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 50,
  },
  logo1: {
    position: 'absolute',
    flex: 1,
    alignSelf: 'center',
    marginTop: 3,
    padding: 5,
    width: 60,
    height: 60,
    borderWidth: 1,
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  screenTitle: {
    fontSize: 23,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: 20,
    color: 'white',
  },
  screenName: {
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: 5,
    color: 'white',
  },


  iconsContainer: {
    flexDirection: 'row',
    borderColor: 'skyblue',
    borderWidth: 1,
    height: 250,
    bottom: '10%',
    backgroundColor: 'white',
    elevation: 20,
    padding: 20,
    borderRadius: 50,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCard: {
    width: 150,
    height: 150,
    borderColor: 'skyblue',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    elevation: 30,
  },
  text: {
    marginTop: 10,
    padding: 5,
    fontSize: 16,
    fontWeight: '500',
    color: 'gray',
  },
  logout: {
    color: 'red',
    fontSize: 12,
    right: 2,
  },
});
export default MainMenuScreen;
