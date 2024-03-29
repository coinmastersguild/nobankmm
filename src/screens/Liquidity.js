import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Button, Modal, ScrollView, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Liquidity({ navigation, GlobalState }) {

    const { chosenTask } = GlobalState;
    const [cashCounts, setCashCounts] = useState({});
    const [totalCash, setTotalCash] = useState(0);
    const renderBillImages = () => {
        return Object.entries(cashCounts).map(([amount, count]) => (
            <View key={amount} style={styles.billImageContainer}>
                <Image source={billImages[amount]} style={styles.billImage} />
                <Text style={styles.billText}>{`${count}x ${amount} USD`}</Text>
            </View>
        ));
    };

    const billImages = {
        1: require('../../assets/cash/1USD.png'),
        5: require('../../assets/cash/5USD.png'),
        10: require('../../assets/cash/10USD.png'),
        20: require('../../assets/cash/20USD.png'),
        50: require('../../assets/cash/50USD.png'),
        100: require('../../assets/cash/100USD.png'),
    };

    let inventory = {
        "1": 0,
        "5": 0,
        "10": 0,
        "20": 0,
        "50": 0,
        "100": 0
    }
    const addCashAmount = (amount) => {

        switch(amount){
            case 1:
                inventory["1"]+=1;
                break;
            case 5:
                inventory["5"]+=1;
                break;
            case 10:
                inventory["10"]+=1;
                break;
            case 20:
                inventory["20"]+=1;
                break;
            case 50:
                inventory["50"]+=1;
                break;
            case 100:
                inventory["100"]+=1;
                break;
            default:
        }
        let currentCash = totalCash;
        currentCash += amount;
        setTotalCash(currentCash);
        setCashCounts((prevCounts) => ({
            ...prevCounts,
            [amount]: (prevCounts[amount] || 0) + 1,
        }));
    };

    const confirmTotal = (totalCash) => {
        AsyncStorage.setItem('cash', totalCash.toString());
        AsyncStorage.setItem('1', inventory["1"].toString());
        AsyncStorage.setItem('5', inventory["5"].toString());
        AsyncStorage.setItem('10', inventory["10"].toString());
        AsyncStorage.setItem('20', inventory["20"].toString());
        AsyncStorage.setItem('50', inventory["50"].toString());
        AsyncStorage.setItem('100', inventory["100"].toString());
        navigation.navigate('Home');
    };

    return (
        <View style={styles.screen}>
            <Header />
            <View style={styles.body}>
                <Modal animationType="slide" transparent={true}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <ScrollView contentContainerStyle={styles.billsGrid}>
                                {renderBillImages()}
                            </ScrollView>
                            <View style={styles.suggestionButtonsContainer}>
                                {[1, 5, 10, 20, 50, 100].map((amount) => (
                                    <TouchableOpacity key={amount} style={styles.suggestionButton} onPress={() => addCashAmount(amount)}>
                                        <Text style={styles.suggestionButtonText}>+{amount}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <Text style={styles.modalText}>{totalCash}</Text>
                            <TouchableOpacity style={styles.pickupButton} onPress={() => setCashCounts({})}>
                                <Text style={styles.buttonText}>Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.pickupButton} onPress={() => navigation.navigate('Home')}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.pickupButton} onPress={() => confirmTotal(totalCash)}>
                                <Text style={styles.buttonText}>Set Cash Reserve</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal >
            </View>
            <Footer navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    body: {
        flex: 8,
        width: '100%',
        backgroundColor: '#14141410',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: 'tomato',
        width: '60%',
        alignSelf: 'center',
        marginTop: 10, // Ensure spacing between buttons
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '80%',
    },
    pickupButton: {
        padding: 10,
        backgroundColor: 'blue',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    suggestionButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    suggestionButton: {
        backgroundColor: 'lightgrey',
        padding: 10,
        borderRadius: 5,
        margin: 5,
    },
    suggestionButtonText: {
        fontSize: 16,
        color: 'black',
    },
    billsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    billImageContainer: {
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    billImage: {
        width: 100,
        height: 50,
        resizeMode: 'contain',
    },
    billText: {
        marginTop: 5,
    }
})