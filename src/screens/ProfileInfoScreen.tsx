import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileInfoScreen = () => {

    return (
        <>
            <View style={styles.viewImg}>
                <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
                    <Ionicons
                            size={40}
                            name="add-circle"
                            style={{ color: '#BBBDBF', marginEnd: 20 }}
                        />
                </TouchableOpacity>
                <Image
                    source={require('assets/images/activities/profile.png')}
                    style={styles.icon}
                />
            </View>
            <View style={styles.viewInfo}>
            <Text style={styles.textTitle}>Maria Sharapova</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    viewImg: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewbuttonAction: {
        height: 40,
        width: 80,
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: '#37CC4A',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 100,
        height: 100,
        borderRadius: 75,
    },

    viewInfo: {
        flex: 3,
        padding: 12,
        // backgroundColor: 'orange'
      },
      textTitle: {
        fontSize: 28,//width * 0.07,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default ProfileInfoScreen;