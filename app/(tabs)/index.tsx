import { HOME_BALANCE, HOME_USER } from "@/constants/data";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import "../../global.css";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <View className="home-header">
      <View className="home-user">
        <Image source={images.avatar} className="home-avatar" />
     <Text className="home-user-name">{HOME_USER.name}</Text>
      </View>
      </View>

      <View className="home-balance-card">
        <Text className="home-balance-label">Balance</Text>
        <View className="home-balance-row">
          <Text className="home-balance-amount">{formatCurrency(HOME_BALANCE.amount)}</Text>
        <Text className="home-balance-date">
          {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}
        </Text>
        </View>
      </View>

    </SafeAreaView>
  );
}
