import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import MenuItems from "./MenuItems";
import {MaterialCommunityIcons} from '@expo/vector-icons';
import Map from "./Map";

import React from "react";

const Drawer = createDrawerNavigator();

const drawerComponents: Record<string, React.ComponentType<any>> = {
    'Map': Map,
};

const App = () => {

    return (
        <NavigationContainer>
            <Drawer.Navigator
                //id={'DrawerNavigator'}
                initialRouteName="Map"
                backBehavior={'firstRoute'}
                detachInactiveScreens={false}
                screenOptions={{
                    drawerType: 'front',
                    freezeOnBlur: false,
                }}
            >
                {
                    MenuItems.map((drawer) => {
                        return (
                            <Drawer.Screen
                                key={drawer.name}
                                name={drawer.name}
                                component={drawerComponents[drawer.name]}
                                options={{
                                    title: drawer.title,
                                    drawerLabel: drawer.name,
                                    drawerIcon: ({focused}) =>
                                        <MaterialCommunityIcons
                                            name={drawer.iconName as React.ComponentProps<typeof MaterialCommunityIcons>["name"]}
                                            size={24}
                                            color={focused ? "#e91e63" : "black"}
                                        />
                                }}
                            />
                        );
                    })
                }
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
export default App;
