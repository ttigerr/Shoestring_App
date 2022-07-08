import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import components
import { Login } from './components/Login';
import { Register } from './components/Register';
import { LandingPage } from './components/LandingPage';

// Initialize the stack
const Stack = createNativeStackNavigator()

// Import Firebase
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './Config'
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { initializeFirestore, getFirestore, setDoc, doc, addDoc, getDoc, query, onSnapshot, collection } from 'firebase/firestore'

// Initialize the firebase variable
const FBapp = initializeApp( firebaseConfig)
const FSdb = initializeFirestore(FBapp, {useFetchStreams: false})
const FBauth = getAuth()


// Main application
export default function App() {

  // Initialize
const[ auth, setAuth ] = useState()
const[ user, setUser ] = useState()
const [ data, setData ] = useState()
const [registerError, setRegisterError ] = useState()
const [loginError, setLoginError ] = useState()

// useEffect(() => {
//   const unsubscribe = onAuthStateChanged( FBauth, (user) => {
//     if( user ) { 
//       setAuth(true) 
//       setUser(user)
//       if( !data ) { getData() }
//     }
//     else {
//       setAuth(false)
//       setUser(null)
//     }
//   })
//   unsubscribe()
// })

// get user's auth status
const getAuthStatus = () => {
  return new Promise( ( resolve, reject ) => {
    if( FBauth.currentUser ) {
      resolve( true )
    }
    else {
      reject( false )
    }
  })
}

// Registration
const RegisterHandler = ( email, password ) => {
  setRegisterError(null)
  createUserWithEmailAndPassword( FBauth, email, password )
  .then( ( userCredential ) => { 
    setUser(userCredential.user)
    setAuth( true )
  } )
  .catch( (error) => { setRegisterError(error.code) })
}

// Log in
const LoginHandler = ( email, password ) => {
  signInWithEmailAndPassword( FBauth, email, password )
  .then( (userCredential) => {
    setUser(userCredential.user)
    setAuth(true)
  })
  .catch( (error) => { 
    const message = (error.code.includes('/') ) ? error.code.split('/')[1].replace(/-/g, ' ') : error.code
    setLoginError(message) 
  })
}

// // Add users in DB
// const addUserData = async( FScollection , data ) => {
//   const ref = await addDoc( collection( FSdb, FScollection) , data )

// }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" options={{title:'Log In'}}>
            { (props) => 
                <Login {...props} 
                handler={LoginHandler} 
                auth={auth} 
                error={loginError} 
            /> }
        </Stack.Screen>
        <Stack.Screen name="Register" options={{title: 'Registration'}}>
          { (props) => 
            <Register {...props} 
            handler={RegisterHandler} 
            auth={auth} 
            error={registerError} 
          /> }
        </Stack.Screen>
        <Stack.Screen name="LandingPage" component={LandingPage}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
