import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import gambar from '../Asset/header-smk.png';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {loginUser} from '../Service/ServiceApi';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    checkToken();

    AsyncStorage.getItem('rememberedUsername').then(storedUsername => {
      setUsername(storedUsername || '');
    });
    AsyncStorage.getItem('rememberedPassword').then(storedPassword => {
      setPassword(storedPassword || '');
    });

    AsyncStorage.getItem('rememberedUsername').then(storedUsername => {
      if (storedUsername) {
        setRememberMe(true);
      }
    });
  }, []);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    const tokenExpiration = await AsyncStorage.getItem('tokenExpiration');

    if (token && tokenExpiration) {
      const currentTimestamp = new Date().getTime();
      if (currentTimestamp > parseInt(tokenExpiration)) {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('tokenExpiration');
        navigation.navigate('Login');
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'Menu'}],
        });
      }
    } else {
      navigation.navigate('Login');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isDisabled = !username || !password || loading;

  const handleLogin = async () => {
    setTimeout(() => {
      setStartAnimation(false);
    }, 500);

    if (loading) return;
    setError('');
    setLoading(true);
    setStartAnimation(true);

    try {
      const response = await loginUser(username, password);

      const token = response.token;
      const uid = response.uid
      const img = response.image
      console.log(response)
      await AsyncStorage.setItem('username', username);

      if (rememberMe) {
        await AsyncStorage.setItem('rememberedUsername', username);
        await AsyncStorage.setItem('rememberedPassword', password);
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('uid', uid);
        
        const expirationTime = new Date().getTime() + 21600000;
        await AsyncStorage.setItem(
          'tokenExpiration',
          expirationTime.toString(),
        );
      } else {
        // Clear remembered username and password if "Ingat Saya" is not checked
        await AsyncStorage.removeItem('rememberedUsername');
        await AsyncStorage.removeItem('rememberedPassword');
      }
      navigation.reset({
        index: 0,
        routes: [{name: 'Menu'}],
      });
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
        setStartAnimation(true);
      } else {
        setError('Terjadi kesalahan koneksi pada server');
      }
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="skyblue" barStyle="dark-content" />
      <View style={styles.background} />

      <Animatable.View
        style={styles.formContainer}
        animation="slideInUp"
        iterationCount={1}
        iterationDelay={500}
        easing="ease-in-out"
        direction="normal">
        <Image source={require('../Asset/smk.png')} style={styles.logo} />

        <Animatable.View ref={usernameInputRef} style={{width: '100%'}}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="gray"
            value={username}
            onChangeText={setUsername}
            // onPressIn={() => {
            //   usernameInputRef.current?.bounce(800);
            // }}
          />
        </Animatable.View>

        <Animatable.View
          animation="pulse"
          duration={800}
          ref={passwordInputRef}
          style={{width: '100%'}}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            //   onPressIn={() => {
            //     passwordInputRef.current?.bounce(800);
            //   }}
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={togglePasswordVisibility}>
              <Icon
                name={showPassword ? 'eye-slash' : 'eye'}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </Animatable.View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Animatable.View
          animation={startAnimation ? 'rubberBand' : null} // Apply pulse animation when startAnimation is true
          duration={800}
          style={{width: '100%'}}>
          <TouchableOpacity
            style={[styles.loginButton, isDisabled && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isDisabled}>
            <Text style={styles.buttonText}>Masuk</Text>
          </TouchableOpacity>
        </Animatable.View>
        <View style={styles.rememberMeContainer}>
          <TouchableOpacity
            style={styles.rememberMeIcon}
            onPress={() => setRememberMe(!rememberMe)}>
            <Icon
              name={rememberMe ? 'check-square' : 'square-o'}
              size={20}
              color={rememberMe ? 'green' : 'gray'}
            />
          </TouchableOpacity>
          <Text style={styles.rememberMeText}>Ingat Saya</Text>
        </View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '50%',
    backgroundColor: 'skyblue',
    borderBottomLeftRadius: 450,
    borderBottomRightRadius: 400,
    transform: [{scaleX: 1.5}],
  },
  formContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 4,
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    height: 100,
    width: 100,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    elevation: 15,
    color: 'black',
    animation: 'bounceInRight',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    elevation: 16,
  },
  passwordInput: {
    width: '100%',
    height: 40,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    elevation: 15,
    color: 'black',
  },
  eyeIconContainer: {
    paddingHorizontal: 10,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#1b53fd',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  rememberMeIcon: {
    marginRight: 5,
  },
  rememberMeText: {
    color: 'gray',
  },
});
export default LoginScreen;
