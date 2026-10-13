import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const SubscriptionDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }> ()
  return (
    <View>
      <Text>Subscription Details for {id}</Text>
    </View>
  )
}

export default SubscriptionDetails