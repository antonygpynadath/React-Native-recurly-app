import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const Signup = () => {
  return (
    <View>
      <Text>Signup Screen</Text>
      <Link href="/(auth)/sign-in">Go to Signin</Link>
    </View>
  )
}

export default Signup