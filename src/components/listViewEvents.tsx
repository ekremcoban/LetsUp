import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { window, colors } from '../utilities/constants/globalValues';
import { Icon } from 'react-native-elements';

const { width, height } = window

const listViewEvents = (props: Props) => {
    const { id, title, place, date, icon } : Props = props;

    return (
        <View
            style={
                
                id % 2 === 0
                    ? styles.mainFrame
                    : [styles.mainFrame, { backgroundColor: '#F1F1F1' }]
            }>
            <View style={styles.leftFrame}>
                <Image style={styles.logoEvent} source={icon} />
            </View>
            <View style={styles.rightFrame}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.row}>
                    <Icon name="location" type="ionicon" />
                    <Text style={styles.textRow}>{place}</Text>
                    <Icon name="time-outline" type="ionicon" />
                    <Text style={styles.textRow}>{date}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainFrame: {
        flexDirection: 'row',
        height: height * (120 / height),
        backgroundColor: 'white',
        borderBottomWidth: 1,
    },
    leftFrame: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'yellow'
    },
    rightFrame: {
        flex: 4,
        // backgroundColor: 'purple'
    },
    logoEvent: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
    },
    title: {
        flex: 1,
        fontSize: height * (17 / height),
        fontWeight: 'bold',
        paddingLeft: width * (12 / width),
        paddingTop: height * (30 / height),
        // backgroundColor: 'red',
    },
    textRow: {
        flex: 1,
        fontSize: height * (15 / height),
        paddingTop: height * (3 / height),
        // backgroundColor: 'purple',
    },
    row: {
        flex: 2,
        flexDirection: 'row',
        paddingLeft: width * (10 / width),
    },
});

type Props = {
    id: number,
    title: string,
    place: string,
    date: string,
    icon: any,
    start: string,
    finish: string,
    user: string,
    key: number,
};

export default listViewEvents;