import React from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import { Icon } from 'react-native-elements';

const noti = [
    {
        id: 0,
        pic: require('assets/img/jogging.png'),
        boldText: 'Koşmaya var mısın?',
        text: 'etkinliğinin güzergahı değişti',
        date: 'April 8', 
        time: '20:00'
    },
    {
        id: 1,
        pic: require('assets/img/hiking.png'),
        boldText: 'Yokuşsever Konyalılar Toplanıyor',
        text: 'etkinliği yarın başlıyor',
        date: 'April 11', 
        time: '23:00'
    },
    {
        id: 2,
        pic: require('assets/img/bcycle.png'),
        boldText: 'İki teker Karaköy Turu',
        text: 'etkinliği iptal edildi',
        date: 'April 18', 
        time: '09:00'
    },
]

const MyActivitiesScreen = () => {
    return (
        <View style={{ marginTop: 10 }}>
            {noti.map(item => (
                <View style={styles.viewContainer}>
                    <View style={styles.viewLeft}>
                        <Image
                            source={item.pic}
                            style={styles.icon}
                        />
                    </View>
                    <View style={styles.viewMiddle}>
                        <Text style={styles.textBold}>{item.boldText}</Text>
                        <View style={styles.viewDateTime}>
                            <Icon size={20} name="calendar-outline" type="ionicon" />
                            <Text style={styles.textDate}> {item.date}      </Text>
                            <Icon size={20} name="time-outline" type="ionicon" />
                            <Text style={styles.textDate}> {item.time}</Text>
                        </View>
                    </View>
                    <View style={styles.viewRight}>
                    <Icon size={20} name="trash-outline" type="ionicon" 
                    onPress={() => Alert.alert('Silim mi :)')}
                    />
                    </View>
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        flexDirection: 'row',
        height: 90,
        borderBottomWidth: 1,
        borderColor: '#CCC'
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
    viewMiddle: {
        flex: 5,
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        // backgroundColor: 'red',
    },
    viewRight: {
        flex: 1,
        justifyContent: 'center',
    },
    textBold: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    viewDateTime: { 
        marginTop: 10,
        flexDirection: 'row', 
        alignItems: 'center', 
    },
    textDate: {
        paddingTop: 3,
        fontSize: 12,
        color: '#515151'
    },
})

export default MyActivitiesScreen;