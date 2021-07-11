import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
const pkg = require('../../package.json');

const MoreScreen = ({navigation}) => {
    
    return (
        <>
            <View style={{ flex: 1, }}>
                <Image
                    source={require('../assets/images/more/letsup.png')}
                    style={{ width: '100%', height: '100%' }}
                />
            </View>
            <View style={{ flex: 1 }}>
                <View style={styles.viewContainer}>
                    <View style={styles.viewLeft}>
                        <Icon size={35} name="log-in-outline" type="ionicon" />
                    </View>
                    <View style={styles.viewRight}>
                        <Text style={styles.textBold}>Login</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.viewContainer}
                    onPress={() => navigation.navigate('Create Profile') }
                >
                    <View style={styles.viewLeft}>
                        <Icon size={35} name="person-circle" type="ionicon" />
                    </View>
                    <View style={styles.viewRight}>
                        <Text style={styles.textBold}>Profil</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.viewContainer}>
                    <View style={styles.viewLeft}>
                        <Icon size={35} name="log-out-outline" type="ionicon" />
                    </View>
                    <View style={styles.viewRight}>
                        <Text style={styles.textBold}>Logout</Text>
                    </View>
                </View>

                <Text style={{textAlign: 'center'}}>{pkg.version}</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        flexDirection: 'row',
        height: 70,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#CCC',
    },
    viewLeft: {
        flex: 1,
        padding: 20,
        // backgroundColor: 'red',
    },
    icon: {
        width: 60,
        height: 60,
    },
    viewRight: {
        flex: 5,
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        // backgroundColor: 'red',
    },
    textBold: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    textDate: {
        paddingTop: 3,
        fontSize: 12,
        color: '#515151'
    },
})

export default MoreScreen;