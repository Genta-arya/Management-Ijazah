import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainMenuScreen from '../Screen/MainMenuScreen';
import LoginScreen from '../Screen/LoginScreen';
import React from 'react';
import {StatusBar} from 'react-native';
import ManageIjasah from '../Screen/ManageIjasah';
import SearchIjasah from '../Screen/SearchIjasah';
import Profile from '../Screen/Profile';
import UploadScreen from '../Screen/UploadScreen';
import Icon2 from 'react-native-vector-icons/Ionicons';
import HandleDokumen from '../Screen/HandleDokumen';
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{statusBarColor: 'skyblue', statusBarStyle: 'dark'}}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Menu"
        component={MainMenuScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Ijasah"
        component={ManageIjasah}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
         name="Search"
         component={SearchIjasah}
         options={({navigation}) => ({
           headerShown: true,
           title: 'Cari  Ijazah',
           headerStyle: {
             backgroundColor: 'skyblue',
           },
           
           headerTitleStyle: {
             color: 'white',
           },
           headerTitleAlign: 'center', // Center-align the title
           headerLeft: () => (
             <Icon2
               name="chevron-back-circle-sharp"
               size={40}
               color="white"
               style={{marginLeft: 10}}
               onPress={() => {
                 navigation.goBack();
               }}
             />
           ),
         })}
       
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={({navigation}) => ({
            headerShown: true,
            title: 'Profile',
            headerStyle: {
              backgroundColor: 'skyblue',
            },
            headerTitleStyle: {
              color: 'white',
            },
            headerTitleAlign: 'center', 
            headerLeft: () => (
              <Icon2
                name="chevron-back-circle-sharp"
                size={40}
                color="white"
                style={{marginLeft: 10}}
                onPress={() => {
                  navigation.goBack();
                }}
              />
            ),
          })}
        
      />

      <Stack.Screen
        name="Upload"
        component={UploadScreen}
        options={({navigation}) => ({
          headerShown: true,
          title: 'Halaman Upload',
          headerStyle: {
            backgroundColor: 'skyblue',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerTitleAlign: 'center', 
          headerLeft: () => (
            <Icon2
              name="chevron-back-circle-sharp"
              size={40}
              color="white"
              style={{marginLeft: 10}}
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
        })}
      />

<Stack.Screen
        name="Dokumen"
        component={HandleDokumen}
        options={({navigation}) => ({
          headerShown: true,
          title: 'Arsip',
          headerStyle: {
            backgroundColor: 'skyblue',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerTitleAlign: 'center', 
          headerLeft: () => (
            <Icon2
              name="chevron-back-circle-sharp"
              size={40}
              color="white"
              style={{marginLeft: 10}}
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
export default MyStack;
