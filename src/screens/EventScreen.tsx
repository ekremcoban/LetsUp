import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import { window, colors } from '../utilities/constants/globalValues';
import ListViewEvents from '../components/listViewEvents';
import { SearchBar } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import { Icon } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const { width, height } = window

// let data = [
let now = new Date()

const EventScreen = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState<string>();
    const [period, setPeriod] = useState<Object>();
    const [data, setData] = useState<Object>();

    useEffect(() => {
        calculatePeriod();
        getList();
    }, []);

    const getList = async () => {
        const activities = await firestore()
            .collection('Test')
            .get();
        // .then(querySnapshot => {
        //     console.log('Total users: ', querySnapshot.docs);
        // });

        let tempData: Object = [];
        activities.forEach(res => {
            const { id, title, place, activityTime } = res.data().test;
            let dateTemp = new Date(activityTime.toDate())
            let day = dateTemp.getDate() < 10 ? '0' + dateTemp.getDate() : dateTemp.getDate();
            let mounth = dateTemp.getMonth() < 9 ? '0' + (dateTemp.getMonth() + 1) : (dateTemp.getMonth() + 1);
            let userArr =
            {
                id: id,
                title: title,
                place: place,
                date: day + '.' + mounth + '.' + dateTemp.getFullYear(),
                icon: Number(day) % 2 === 0 ? require(`../assets/img/basketball.png`) : require(`../assets/img/jogging.png`),
            }
            tempData.push(userArr)
        })
        setData(tempData)
        console.log(data)
    }

    let temp: Array<Object> = [];
    const calculatePeriod = async () => {
        let next = new Date(now.setDate(now.getDate()));
        temp.push({
            day: next.getDate() < 10 ? '0' + next.getDate() : next.getDate(),
            mounth: next.getMonth() < 9 ? '0' + (next.getMonth() + 1) : (next.getMonth() + 1),
            year: next.getFullYear(),
            date: next.getDate() < 10 ? '0' + next.getDate() + '.'
                + (next.getMonth() < 9 ? '0' + (next.getMonth() + 1) : next.getMonth() + 1) + '.'
                + next.getFullYear() : next.getDate() + '.'
                + (next.getMonth() < 9 ? '0' + (next.getMonth() + 1) : next.getMonth() + 1) + '.'
                + next.getFullYear()
        })

        for (let i = 0; i < 30; i++) {
            next = new Date(now.setDate(now.getDate() + 1));
            temp.push({
                day: next.getDate() < 10 ? '0' + next.getDate() : next.getDate(),
                mounth: next.getMonth() < 9 ? '0' + (next.getMonth() + 1) : (next.getMonth() + 1),
                year: next.getFullYear(),
                date: next.getDate() < 10 ? '0' + next.getDate() + '.'
                    + (next.getMonth() < 9 ? '0' + (next.getMonth() + 1) : next.getMonth() + 1) + '.'
                    + next.getFullYear() : next.getDate() + '.'
                    + (next.getMonth() < 9 ? '0' + (next.getMonth() + 1) : next.getMonth() + 1) + '.'
                    + next.getFullYear()
            })
        }
        setPeriod(temp);
    }

    const dateItems = period != undefined && period.map((item, index) => (
        <View key={index} style={styles.titleView}>
            <Text style={styles.titleText}>{item.day}.{item.mounth}.{item.year}</Text>
            {data != undefined && data.filter(d => d.date === item.date).map((item, index) => (
                <ListViewEvents
                    key={index}
                    {...item}
                />
            ))}
        </View>
    ))

    // const items1 = data.filter(d => d.date === '26.10.2020, Pazar').map((item) => (
    //     <ListViewEvents
    //         key={item.id}
    //         {...item}
    //     />
    // ));
    // const items2 = data.filter(d => d.date === '27.10.2020, Pazartesi').map((item) => (
    //     <ListViewEvents
    //         key={item.id}
    //         {...item}
    //     />
    // ));
    // const items3 = data.filter(d => d.date === '29.10.2020, Çarşamba').map((item) => (
    //     <ListViewEvents
    //         key={item.id}
    //         {...item}
    //     />
    // ));
    // const items4 = data.filter(d => d.date === '02.11.2020, Cumartesi').map((item) => (
    //     <ListViewEvents
    //         key={item.id}
    //         {...item}
    //     />
    // ));

    const test = () => {
        navigation.navigate('CreateActivity');
        auth().signOut();
    }

    return (
        <ScrollView>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '90%' }}>
                    <SearchBar round
                        containerStyle={styles.searchBarView}
                        inputContainerStyle={{ backgroundColor: 'white' }}
                        placeholder="Aktivite Arayabilirsiniz.."
                        onChangeText={setSearch}
                        value={search}
                    />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', backgroundColor: colors.bar}}>
                    <Icon size={40} name="add-circle" type="ionicon" onPress={() => test()} />
                </View>

                {/* <Button title='Oluştur' onPress={() => navigation.navigate('CreateActivity')} /> */}
            </View>

            {dateItems}
            {/* <View style={styles.titleView}>
                <Text style={styles.titleText}>26 Ekim Pazar</Text>
                {items1}
            </View>
            <View style={styles.titleView}>
                <Text style={styles.titleText}>27 Ekim Pazartesi</Text>
                {items2}
            </View>
            <View style={styles.titleView}>
                <Text style={styles.titleText}>29 Ekim Çarşamba</Text>
                {items3}
            </View>
            <View style={styles.titleView}>
                <Text style={styles.titleText}>29 Ekim Çarşamba</Text>
                {items4}
            </View> */}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    searchBarView: {
        height: 100,
        paddingTop: height * 0.03,
        paddingLeft: width * 0.05,
        backgroundColor: colors.bar
    },
    titleView: {
        backgroundColor: '#231F20',
        justifyContent: 'center',
    },
    titleText: {
        color: 'white',
        height: height * (30 / height),
        paddingTop: height * (5 / height),
        paddingLeft: width * (30 / width),
    },
})

export default EventScreen;