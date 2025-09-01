import * as Location from 'expo-location';
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Alert, Button, Linking, Platform, StyleSheet, Text, View } from 'react-native';
import { getListDetails } from './(tabs)/spaceXService';


// export default function ListDetailsScreen() {
//     const { id } = useLocalSearchParams();

//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text>List Details Page</Text>
//             <Text>ID: {id}</Text>
//         </View>
//     );
// }


export default function ListDetails(Props) {
    console.log("cccccccccccccccc", Props)

    const { launchpad } = useLocalSearchParams<{ launchpad: string }>();
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission denied. Cannot show your location.");
                return;
            }
            let userLocation = await Location.getCurrentPositionAsync({});
            // setLocation(userLocation);
        })();
    }, []);

    const getDataList = async () => {
        const data = await getListDetails(id).then((res) => {
            console.log("ressssssss", res);
        }).catch((err) => {
            console.log("errrrrrrr", err);
        })
    }

    useEffect(() => {
        // console.log("launchpad", JSON.parse(launchpad))
        getDataList()
    }, []);

    const openMaps = () => {
        // const lat = launchpad.latitude;
        // const lng = launchpad.longitude;
        const label = encodeURIComponent(launchpad.name);

        let url = "";
        if (Platform.OS === "ios") {
            url = `http://maps.apple.com/?daddr=${lat},${lng}&q=${label}`;
        } else {
            url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
        }

        Linking.openURL(url).catch(() =>
            Alert.alert("Error", "Could not open the maps app.")
        );
    };

    return (
        <View style={styles.container}>
            {/* <Text style={styles.title}>{launchpad.name}</Text> */}
            {/* <Text style={styles.details}>{launchpad.details}</Text> */}

            <View style={styles.mapContainer}>
                {/* <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: launchpad.latitude,
                        longitude: launchpad.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                    showsUserLocation={!!location}
                >
                    <Marker
                        coordinate={{ latitude: launchpad.latitude, longitude: launchpad.longitude }}
                        title={launchpad.name}
                        description={launchpad.details}
                    />
                </MapView> */}
            </View>

            <Button title="Get Directions" onPress={openMaps} />

            {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
    },
    details: {
        fontSize: 16,
        color: "#555",
        marginBottom: 16,
    },
    mapContainer: {
        flex: 1,
        marginBottom: 16,
        borderRadius: 12,
        overflow: "hidden",
    },
    map: {
        flex: 1,
    },
    error: {
        color: "red",
        marginTop: 8,
    },
});
