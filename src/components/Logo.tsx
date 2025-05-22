import { Image, View } from "react-native";

export function Logo() {
    return (
        <View className="items-center mb-16">
            <View className="mb-4">
                <Image
                    source={require("../../assets/images/logo.png")}
                    className="w-30 h-30"
                    resizeMode="cover"
                />
            </View>
        </View>
    );
}