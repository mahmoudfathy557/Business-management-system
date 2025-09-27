import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Dimensions } from 'react-native';
import { Text, Button, Card, Title } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { MaterialIcons } from '@expo/vector-icons';

interface QRScannerProps {
    onScan: (data: string) => void;
    onClose: () => void;
    title?: string;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose, title = 'Scan QR/Barcode' }) => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        getBarCodeScannerPermissions();
    }, []);

    const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScanned(true);
        Alert.alert(
            'Barcode Scanned',
            `Type: ${type}\nData: ${data}`,
            [
                {
                    text: 'Cancel',
                    onPress: () => setScanned(false),
                    style: 'cancel',
                },
                {
                    text: 'Use Data',
                    onPress: () => {
                        onScan(data);
                        onClose();
                    },
                },
            ]
        );
    };

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text>Requesting camera permission...</Text>
                    </Card.Content>
                </Card>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Camera Permission Required</Title>
                        <Text style={styles.permissionText}>
                            This app needs camera access to scan QR codes and barcodes.
                        </Text>
                        <Button
                            mode="contained"
                            onPress={getBarCodeScannerPermissions}
                            style={styles.permissionButton}
                        >
                            Grant Permission
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            Close
                        </Button>
                    </Card.Content>
                </Card>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Title style={styles.headerTitle}>{title}</Title>
                <Button
                    mode="text"
                    onPress={onClose}
                    icon="close"
                    style={styles.closeButton}
                >
                    Close
                </Button>
            </View>

            <View style={styles.scannerContainer}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={styles.scanner}
                />

                <View style={styles.overlay}>
                    <View style={styles.scanArea}>
                        <View style={styles.corner} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                </View>

                <View style={styles.instructions}>
                    <MaterialIcons name="qr-code-scanner" size={48} color="#6200ea" />
                    <Text style={styles.instructionText}>
                        Position the QR code or barcode within the frame
                    </Text>
                    <Text style={styles.subInstructionText}>
                        The scan will happen automatically
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    mode="outlined"
                    onPress={() => setScanned(false)}
                    disabled={!scanned}
                    style={styles.rescanButton}
                >
                    Scan Again
                </Button>
            </View>
        </View>
    );
};

const { width, height } = Dimensions.get('window');
const scanAreaSize = width * 0.7;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        elevation: 4,
    },
    headerTitle: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        marginLeft: 8,
    },
    scannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanner: {
        width: width,
        height: height * 0.6,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        width: scanAreaSize,
        height: scanAreaSize,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#6200ea',
        borderWidth: 3,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        top: 0,
        left: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        left: 'auto',
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        top: 'auto',
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        top: 'auto',
        left: 'auto',
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
    instructions: {
        position: 'absolute',
        bottom: 100,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    instructionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 16,
    },
    subInstructionText: {
        color: '#ccc',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
    footer: {
        padding: 16,
        backgroundColor: '#fff',
        elevation: 4,
    },
    rescanButton: {
        marginBottom: 8,
    },
    card: {
        margin: 16,
        elevation: 4,
    },
    permissionText: {
        marginVertical: 16,
        textAlign: 'center',
        color: '#666',
    },
    permissionButton: {
        marginVertical: 8,
    },
});

export default QRScanner;
