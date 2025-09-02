import * as Location from 'expo-location';
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { getListDetails } from './(tabs)/spaceXService';

export default function ListDetails() {
    const { launchpad } = useLocalSearchParams<{ launchpad: string }>();
    const launchpadData = JSON.parse(launchpad);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [launchpadCoords, setLaunchpadCoords] = useState({
        latitude: launchpadData.latitude,
        longitude: launchpadData.longitude,
        name: launchpadData.name,
    });

    /** Request location permissions */
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission denied. Cannot show your location.");
            }
        })();
    }, []);

    /** Fetch updated launchpad details */
    const getDataList = useCallback(async () => {
        try {
            const res = await getListDetails(launchpadData?.launchpad);
            if (res?.data) {
                setLaunchpadCoords({
                    latitude: res.data.latitude,
                    longitude: res.data.longitude,
                    name: res.data.name,
                });
            }
        } catch (err) {
            console.error("Error fetching launchpad details:", err);
        }
    }, [launchpadData?.launchpad]);

    useEffect(() => {
        getDataList();
    }, []);

    /** Open native maps app */
    const openMaps = useCallback(() => {
        const { latitude, longitude, name } = launchpadCoords;
        const label = encodeURIComponent(name);
        const url =
            Platform.OS === "ios"
                ? `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${label}`
                : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

        Linking.openURL(url).catch(() =>
            Alert.alert("Error", "Could not open the maps app.")
        );
    }, [launchpadCoords]);

    /** Generate Google Maps embed HTML */
    const renderMapHtml = () => `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      </head>
      <body style="margin:0;padding:0">
        <iframe 
          width="100%" 
          height="100%" 
          frameborder="0" 
          style="border:0" 
          src="https://maps.google.com/maps?q=${launchpadCoords.latitude},${launchpadCoords.longitude}&z=15&output=embed" 
          allowfullscreen>
        </iframe>
      </body>
    </html>
  `;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{launchpadCoords.name}</Text>
            <View style={styles.mapContainer}>
                <WebView
                    style={styles.map}
                    originWhitelist={['*']}
                    source={{ html: renderMapHtml() }}
                />
            </View>
            <TouchableOpacity style={styles.directionsButton} onPress={openMaps}>
                <Text style={styles.directionsButtonText}>Get Directions</Text>
            </TouchableOpacity>
            {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
    mapContainer: { flex: 1, width: '100%' },
    map: { flex: 1 },
    error: { color: "red", marginTop: 8 },
    directionsButton: {
        backgroundColor: '#ff9933',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 16,
    },
    directionsButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
