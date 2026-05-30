import {View, Text, StyleSheet} from "react-native";
import MapView, {Marker, Polyline} from "react-native-maps";
import {useEffect, useRef, useState, useCallback, useMemo} from "react";
import {Checkbox} from "expo-checkbox";

export type LatLng = {
    latitude: number;
    longitude: number;
};

export type MapMarker = {
    title: string;
    coordinate: LatLng;
};

const INITIAL_COORD = {
    latitude: 32.2,
    longitude: 34.8,
};

const Map = () => {
    const [addMarkers, setAddMarkers] = useState(true);
    const [markers, setMarkers] = useState<MapMarker[]>([]);
    const [appTimerTime, setAppTimerTime] = useState(1);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // ✅ stable timer
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setAppTimerTime((t) => t + 1);
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // ✅ stable marker creation
    useEffect(() => {
        const newMarker: MapMarker = {
            title: `${appTimerTime}. Added ${new Date().toLocaleTimeString()}`,
            coordinate: {
                latitude: INITIAL_COORD.latitude + appTimerTime / (200 * Math.sin(appTimerTime) + 400),
                longitude: INITIAL_COORD.longitude + appTimerTime / (200 * Math.cos(appTimerTime) + 400),
            },
        };

        setMarkers((prev) => [...prev, newMarker]);
    }, [appTimerTime]);

    // ✅ memoized polylines
    const polylines = useMemo(() => {
        if (!addMarkers || markers.length < 2) return null;

        return markers.slice(1).map((m, i) => {
            const prev = markers[i];

            return (
                <Polyline
                    key={`line_${i}`}
                    coordinates={[prev.coordinate, m.coordinate]}
                    strokeColor="magenta"
                    strokeWidth={4}
                />
            );
        });
    }, [markers, addMarkers]);

    // ✅ memoized markers
    const renderedMarkers = useMemo(() => {
        if (!addMarkers) return null;

        return markers.map((m, i) => (
            <Marker
                key={`marker_${i}`}
                coordinate={m.coordinate}
                title={m.title}
                anchor={{x: 0.5, y: 0.5}}
            />
        ));
    }, [markers, addMarkers]);

    const onMapReady = useCallback(() => {
        console.log(new Date(), "onMapReady");
    }, []);

    return (
        <View style={styles.header}>
            <MapView
                style={styles.map}
                showsUserLocation={true}
                onMapReady={onMapReady}
                showsCompass={true}
                zoomControlEnabled={true}
                toolbarEnabled={true}
                showsScale={true}
                initialRegion={{
                    ...INITIAL_COORD,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                {/* fixed main marker */}
                <Marker
                    coordinate={INITIAL_COORD}
                    pinColor="blue"
                    title="Initial"
                />

                {renderedMarkers}
                {polylines}
            </MapView>

            <View style={styles.controls}>
                <Text style={styles.text}>Show Markers and Polylines </Text>
                <Checkbox
                    value={addMarkers}
                    onValueChange={setAddMarkers}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flex: 1,
        backgroundColor: "oldlace",
    },
    map: {
        flex: 1,
    },
    controls: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    text: {
        fontWeight: "bold",
    },
});

export default Map;