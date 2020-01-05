import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import { Alert, SafeAreaView, ScrollView, RefreshControl, StyleSheet, Image, AsyncStorage, TouchableOpacity, Text } from 'react-native';

import SpotList from '../components/SpotList';

import logo from '../img/logo.png';

import Constants from 'expo-constants';

function wait (timeout) {
   return new Promise (resolve => {
      setTimeout (resolve, timeout);
   });
}

export default function List( { navigation }) {
   const [techs, setTechs] = useState([]);
   const [refreshing, setRefreshing] = React.useState (false);

   const onRefresh = React.useCallback(() => {
      setRefreshing(true);

      wait(2000).then(() => setRefreshing (false));
   }, [refreshing]);

   useEffect(() => {
      AsyncStorage.getItem('user').then(user_id => {
         const socket = socketio('http://192.168.1.6:3333', {
            query: { user_id }
         })

         socket.on('booking_response', booking => {
            Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'APROVADA' : 'REJEITADA'}`);
         })
      })
   }, []);

   useEffect (() => {
      AsyncStorage.getItem('techs').then(storagedTechs => {
         const techsArray = storagedTechs.split(',').map(tech => tech.trim());

         setTechs(techsArray);
      })
   }, []);

   function handleVoltar() {
      navigation.navigate('Login');
   }

   return (
      <>
         <SafeAreaView style = {styles.container}>
            <ScrollView
               contentContainerStyle = {styles.scrollView}
               refreshControl = {
                  <RefreshControl refreshing = { refreshing } onRefresh = { onRefresh } />
               }
            >
               <TouchableOpacity onPress = {handleVoltar} style = {[styles.button, styles.backButton]}>
                  <Text style = {styles.buttonText}> Voltar </Text>
               </TouchableOpacity>

               <Image style = {styles.logo} source = {logo} />
               <ScrollView>
                  {techs.map(tech => <SpotList key = {tech} tech = {tech} />)}
               </ScrollView>
            </ScrollView>
         </SafeAreaView>
      </>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      marginTop: Constants.statusBarHeight,
   },

   logo: {
      height: 32,
      resizeMode: "contain",
      alignSelf: "center",
      marginTop: 10
   },
   button: {
      height: 32,
      backgroundColor: '#f05a5b',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 2,
      marginTop: 15,
      borderRadius: 25,
   },

   buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 15,
      borderRadius: 25,
   },

   backButton: {
      backgroundColor: '#f01',
      marginBottom: 10,
      marginLeft: 5,
      width: 120,
      borderRadius: 25,
   },

   updateButton: {
      backgroundColor: 'green',
      marginTop: -42,
      marginLeft: 900,
      width: 120,
      borderRadius: 25,
   },
});
