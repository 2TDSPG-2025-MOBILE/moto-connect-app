
// routes/index.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";


export default function Routes() {
  return (
    <NavigationContainer>
      <Login />
    </NavigationContainer >
  )
}