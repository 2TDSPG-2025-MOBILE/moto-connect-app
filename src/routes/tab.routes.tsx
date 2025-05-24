import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesign from '@expo/vector-icons/AntDesign';

// Telas reais baseadas nas pastas visíveis
import Home from "../screens/Home";
import MotorcycleRegistration from "../screens/MotorcycleRegistration";
import Register from "../screens/Register";

// Tipagem segura para as rotas do Tab
export type TabParamList = {
  Home: undefined;
  MotorcycleRegistration: undefined;
  Register: undefined;
  Plus: undefined; // botão customizado que navega para outra rota (ex: Login)
};

const { Navigator, Screen } = createBottomTabNavigator<TabParamList>();

export default function TabRoutes() {
  const navigation = useNavigation();

  const routes = [
    {
      id: 0,
      name: "Home",
      label: "Início",
      component: Home,
      icon: "home",
    },
    {
      id: 1,
      name: "MotorcycleRegistration",
      label: "Moto",
      component: MotorcycleRegistration,
      icon: "car",
    },
    {
      id: 2,
      name: "Plus",
      label: "Plus",
      component: () => null, 
      icon: "plus",
    },
    {
      id: 3,
      name: "Register",
      label: "Perfil",
      component: Register,
      icon: "user",
    },
  ];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#131417",
          borderTopColor: "#040404",
        },
        tabBarActiveTintColor: "#ED145B",
      }}
    >
      {routes.map((route) => {
        if (route.name === "Plus") {
          return (
            <Screen
              key={route.id}
              name={route.name as keyof TabParamList}
              component={route.component}
              options={{
                tabBarIcon: () => null,
                tabBarButton: () => (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#ED145B",
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      justifyContent: "center",
                      alignItems: "center",
                      top: -30,
                      alignSelf: "center",
                    }}
                    onPress={() => navigation.navigate("Login" as never)} // <- ajustar destino
                  >
                    <AntDesign name="plus" size={34} color="#000" />
                  </TouchableOpacity>
                ),
              }}
            />
          );
        }

        return (
          <Screen
            key={route.id}
            name={route.name as keyof TabParamList}
            component={route.component}
            options={{
              tabBarIcon: ({ color, size }) => (
                <AntDesign name={route.icon as any} size={size} color={color} />
              ),
              tabBarLabel: route.label,
              tabBarLabelStyle: {
                fontFamily: "secondary_regular",
                fontSize: 16,
              },
            }}
          />
        );
      })}
    </Navigator>
  );
}
