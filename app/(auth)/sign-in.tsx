import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const Signin = () => {
  return (
    <View>
      <Text>Signin Screen</Text>
      <Link href="/(auth)/sign-up">Go to Signup</Link>
    </View>
  )
}

export default Signin