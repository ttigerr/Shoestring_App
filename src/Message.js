import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

export function Message ( props ) {
  return (
    <View>
      <Text style={styles.text}>{ props.message }</Text>
    </View>
  )
}

const styles= StyleSheet.create({
  text: {
    color: 'red',
    textAlign: 'center',
    padding: 10,
  },
})