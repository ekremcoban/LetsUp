import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const noti = [
    {
        id: 0,
        pic: require('assets/img/jogging.png'),
        boldText: 'Koşmaya var mısın?',
        text: 'etkinliğinin güzergahı değişti',
        date: 'April 8, 20:00'
    },
    {
        id: 1,
        pic: require('assets/img/hiking.png'),
        boldText: 'Yokuşsever Konyalılar Toplanıyor',
        text: 'etkinliği yarın başlıyor',
        date: 'April 11, 23:00'
    },
    {
        id: 2,
        pic: require('assets/img/bcycle.png'),
        boldText: 'İki teker Karaköy Turu',
        text: 'etkinliği iptal edildi',
        date: 'April 18, 09:00'
    },
]

const NotificationScreen = () => {
    return (
        <View style={{marginTop: 10}}>
            {noti.map(item => (
                <View 
                key={item.id}
                style={styles.viewContainer}>
                    <View style={styles.viewLeft}>
                        <Image
                            source={item.pic}
                            style={styles.icon}
                        />
                    </View>
                    <View style={styles.viewRight}>
                        <Text style={styles.textBold}>{item.boldText}</Text>
                        <Text> {item.text}</Text>
                        <Text style={styles.textDate}> {item.date}</Text>
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
    },
    textDate: {
        paddingTop: 3,
        fontSize: 12,
        color: '#515151'
    },
})

export default NotificationScreen;