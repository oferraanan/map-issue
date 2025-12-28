// noinspection JSValidateTypes

import {View, Text, StyleSheet} from "react-native";
import MapView, {Marker} from "react-native-maps";
import {useEffect, useState} from "react";
import {Checkbox} from "expo-checkbox";

let isDebug = true;
let appTimerId = null;
let markersList = [];

export default function App() {

    const [addMarkers, setAddMarkers] = useState(true);
    const [markers, setMarkers] = useState([]);

    const [appTimerTime, setAppTimerTime] = useState(1)

    const startAppTimer = () => {
        if (appTimerId) clearInterval(appTimerId);
        appTimerId = setInterval(() => {
            setAppTimerTime((previousTime) => previousTime + 1);
        }, 100);
    }

    const onMapReady = async () => {
        isDebug && console.log(new Date(), 'onMapReady');
        startAppTimer();
    };

    function addMarker() {
        markersList.push({
            title: appTimerTime + '. Added ' + new Date().toLocaleTimeString(),
            coordinate: {
                latitude: 32.2 + appTimerTime / 10,
                longitude: 34.8 + appTimerTime / 10,
            }
        })
    }

    useEffect(() => {
        addMarker();
        setMarkers(markersList);
    }, [appTimerTime]);

    return (
        <View
            style={styles.header}
        >
            <MapView
                style={{
                    width: "100%",
                    height: "80%",
                }}
                showsUserLocation={true}
                onMapReady={onMapReady}
            >
                <Marker key={'main_marker'}
                        zIndex={2}
                        coordinate={{
                            latitude: 32.2,
                            longitude: 34.8,
                        }}
                        anchor={{x: 0.5, y: 0.5}}
                        pinColor={'blue'}
                        title={'Initial'}
                >
                </Marker>
                {addMarkers && markers?.length > 0 &&
                    markers.map((m, i) => {
                        return (
                            <Marker key={'marker_' + i}
                                    zIndex={3}
                                    coordinate={m.coordinate}
                                    anchor={{x: 0.5, y: 0.5}}
                                    title={m.title}
                            >
                            </Marker>
                        )
                    })
                }
            </MapView>
            <Text style={{
                padding: 10,
                fontWeight: 'bold',
                height: 50,
            }}>
                {'Show Markers'}
            </Text>
            <Checkbox
                value={addMarkers}
                onValueChange={(value) => setAddMarkers(value)}
                color={addMarkers ? 'blue' : undefined}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'oldlace'
    },
});
