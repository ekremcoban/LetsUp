import React, { useEffect, useState } from 'react';
import {
    StyleSheet, View, Text, ScrollView, TouchableOpacity,
    Image, TextInput, Alert, Keyboard, TouchableNativeFeedback
} from 'react-native';
import { colors, window } from '../utilities/constants/globalValues';
import Popover from '../components/popover';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firestore from '@react-native-firebase/firestore';
import { MenuProvider } from 'react-native-popup-menu';
import RNGooglePlaces from 'react-native-google-places';
import CustomButton from '../components/buttons/customButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionSheetMenu from '../components/actionSheetMenu';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const { width, height } = window;
const startPlacePlaceholder = 'Please Select';

const CreateActivityScreen2 = () => {
    const [branchNo, setBranchNo] = useState<number>(1);
    const [title, setTitle] = useState<string>('');
    const [startPlace, setStartPlace] = useState<string>(startPlacePlaceholder);
    const [isFinishLocation, setIsFinishLocation] = useState(false)
    const [finishPlace, setFinishPlace] = useState<string>('Finish');
    const [warningTitle, setWarningTitle] = useState<boolean>(false);
    const [warningStartPlace, setWarningStartPlace] = useState<boolean>(false);
    const [warningDate, setWarningDate] = useState<number>(0);
    const [warningTime, setWarningTime] = useState<number>(0);
    const [activityStartDate, setActivityStartDate] = useState<Date>(undefined);
    const [activityStartTime, setActivityStartTime] = useState<Date>(undefined);
    const [activityFinishDate, setActivityFinishDate] = useState<Date>(undefined);
    const [activityFinishTime, setActivityFinishTime] = useState<Date>(undefined);
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState<boolean>(false);
    const [isFinishDatePickerVisible, setFinishDatePickerVisibility] = useState<boolean>(false);
    const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState<boolean>(false);
    const [isFinishTimePickerVisible, setFinishTimePickerVisibility] = useState<boolean>(false);
    const [showMore, setShowMore] = useState<boolean>(true);
    const [showMoreText, setShowMoreText] = useState<boolean>('More...');
    const [ageStart, setAgeStart] = useState<number>(0);
    const [gender, setGender] = useState<string>(null);
    const [quota, setQuota] = useState<number>(0);

    useEffect(() => {

    });

    const insertData = (data: Object) => {
        console.log('data1', data)
        firestore()
            .collection('Test')
            .add(data)
            .then(() => {
                console.log('User added!');
            }).catch(error => {
                console.error('Hata', error)
            });
    }

    const setActivityTitle = (text: string) => {
        if (text.length > 0) {
            setWarningTitle(false)
        }
        setTitle(text)
    }

    const setActityStartPlace = () => {
        setWarningStartPlace(false);
        openSearchModal()
    }

    const save = () => {
        console.log('BURDA')
        let [month, date, year] = new Date().toLocaleDateString("en-US").split("/")
        let [hour, minute, second] = new Date().toLocaleTimeString("tr-TR").split(/:| /)
        date = Number(date) < 10 ? '0' + date : date;
        month = Number(month) < 10 ? '0' + month : month;
        let now = year + '/' + month + '/' + date + ' ' + hour + ':' + minute + ':' + second;
        let sendData = null;

        // console.warn('startplace', startPlace)
        if (title.length > 0 && startPlace !== startPlacePlaceholder && warningDate === 0 && activityTime != undefined) {
            setWarningTitle(false)
            Alert.alert('Başarılı')
            sendData = {
                test: {
                    id: 1,
                    title: title,
                    place: startPlace,
                    activityTime: activityTime,
                    // activityCreateDate: now,
                    activityCreateDate: new Date(),
                }

            }
            console.log('send', sendData)
            insertData(sendData)
        }
        else {
            if (title.length == 0) {
                setWarningTitle(true);
            }
            else {
                setWarningTitle(false);
            }

            if (startPlace !== startPlacePlaceholder) {
                setWarningStartPlace(false)
            }
            else {
                setWarningStartPlace(true);
            }

            if (activityStartDate != undefined) {
                setWarningDate(0);
            }
            else {
                setWarningDate(2);
            }

            if (activityStartTime != undefined) {
                setWarningTime(0);
            }
            else {
                setWarningTime(2);
            }
            Alert.alert('Başarısız')
        }
    }

    const openStartSearchModal = () => {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
                console.log(place);
                setStartPlace(place.name)
                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
            })
            .catch(error => console.log(error.message)) // error is a Javascript Error object
    }

    const openFinishSearchModal = () => {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
                console.log(place);
                setFinishPlace(place.name)
                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
            })
            .catch(error => console.log(error.message)) // error is a Javascript Error object
    }

    const openSearchFinishModal = () => {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
                console.log(place.name);
                p = place.name;
                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
            })
            .catch(error => console.log(error.message)) // error is a Javascript Error object
            .finally(a => setFinishPlace(p))
    }

    const finishPlaceTextInput =
        <TouchableOpacity
            onPress={() => openSearchFinishModal()}
        >
            <Text style={{ textAlign: 'center' }}>{finishPlace}</Text>
        </TouchableOpacity>

    const showStartDatePicker = () => {
        setStartDatePickerVisibility(true);
    }

    const handleStartDateConfirm = (date: Date) => {
        setActivityStartDate(date)
        setStartDatePickerVisibility(false)

        if (date.getFullYear() > new Date().getFullYear()
            || date.getFullYear() == new Date().getFullYear() && date.getMonth() > new Date().getMonth()
            || (date.getFullYear() == new Date().getFullYear() && date.getMonth() == new Date().getMonth()
                && date.getDate() >= new Date().getDate())) {
            setActivityStartDate(date);
            setActivityStartTime(null);
            setWarningDate(0);
            setWarningTime(0)

            // console.warn('dışarda tarih');
        }
        else {
            setActivityStartDate(date);
            setActivityStartTime(null);
            setWarningDate(1);
        }
    };

    const handleFinishDateConfirm = (date: Date) => {
        setActivityFinishDate(date)
        setFinishDatePickerVisibility(false)

        if (date.getFullYear() > new Date().getFullYear()
            || date.getFullYear() == new Date().getFullYear() && date.getMonth() > new Date().getMonth()
            || (date.getFullYear() == new Date().getFullYear() && date.getMonth() == new Date().getMonth()
                && date.getDate() >= new Date().getDate())) {
            setActivityFinishDate(date);
            setActivityFinishTime(null);
            setWarningDate(0);
            setWarningTime(0)

            // console.warn('dışarda tarih');
        }
        else {
            setActivityFinishDate(date);
            setActivityFinishTime(null);
            setWarningDate(1);
        }
    };

    const showDateText = (activityDate: Date) => {
        let result = "Seçiniz";

        if (activityDate != null
            && (activityDate.getFullYear() > new Date().getFullYear()
                || activityDate.getFullYear() == new Date().getFullYear() && activityDate.getMonth() > new Date().getMonth()
                || (activityDate.getFullYear() == new Date().getFullYear() && activityDate.getMonth() == new Date().getMonth()
                    && activityDate.getDate() >= new Date().getDate()))) {
            if (activityDate.getDate() < 10) {
                result = '0' + activityDate.getDate().toString();
            }
            else {
                result = activityDate.getDate().toString();
            }
            if (activityDate.getMonth() + 1 < 10) {
                result += '.0' + (activityDate.getMonth() + 1).toString()
            }
            else {
                result += '.' + (activityDate.getMonth() + 1).toString()
            }
            result += '.' + activityDate.getFullYear().toString();
        }
        else {
            result = "Seçiniz";
        }
        return result;
    }

    const handleStartTimeConfirm = (date: Date, activityDate: Date) => {
        setStartTimePickerVisibility(false)

        if (activityDate != null
            && activityDate.getFullYear() === new Date().getFullYear()
            && activityDate.getMonth() === new Date().getMonth()
            && activityDate.getDate() === new Date().getDate()
            && date.getHours() * 60 + date.getMinutes() <= (new Date().getHours() + 2) * 60 + new Date().getMinutes()) {
            setActivityStartTime(null);
            setWarningTime(1);
            // console.warn('En az 2 saat olmalı');
        }
        else {
            setActivityStartTime(date);
            setWarningTime(0);
            // console.warn('saat');
        }
    };

    const handleFinishTimeConfirm = (date: Date, activityDate: Date) => {
        setFinishTimePickerVisibility(false)

        if (activityDate != null
            && activityDate.getFullYear() === new Date().getFullYear()
            && activityDate.getMonth() === new Date().getMonth()
            && activityDate.getDate() === new Date().getDate()
            && date.getHours() * 60 + date.getMinutes() <= (new Date().getHours() + 2) * 60 + new Date().getMinutes()) {
            setActivityFinishTime(null);
            setWarningTime(1);
            // console.warn('En az 2 saat olmalı');
        }
        else {
            setActivityFinishTime(date);
            setWarningTime(0);
            // console.warn('saat');
        }
    };

    const showTimeText = (activityDate: Date, activityTime: Date) => {
        let result = "Seçiniz";

        if (activityDate != null && activityTime != null
            && new Date().getFullYear() === activityDate.getFullYear()
            && new Date().getMonth() === activityDate.getMonth()
            && new Date().getDate() === activityDate.getDate()
            && activityTime.getHours() * 60 + activityTime.getMinutes() <= (new Date().getHours() + 2) * 60 + new Date().getMinutes()) {
            result = 'Seçiniz'
        }
        // else if (activityDate != null && activityTime != null && (new Date().getFullYear() !== activityDate.getFullYear()
        //     || new Date().getMonth() !== activityDate.getMonth()
        //     || new Date().getDate() !== activityDate.getDate())) {
        //     result = activityTime.getHours().toString() + ':' + activityTime.getMinutes().toString();
        // }
        else if (activityTime != null) {
            if (activityTime.getHours() < 10) {
                result = '0' + activityTime.getHours().toString();
            }
            else {
                result = activityTime.getHours().toString();
            }

            if (activityTime.getMinutes() < 10) {
                result += ':0' + activityTime.getMinutes().toString()
            }
            else {
                result += ':' + activityTime.getMinutes().toString()
            }
        }
        else {
            result = 'Seçiniz'
        }
        return result
    }

    const changeLocation = () => {
        setIsFinishLocation(!isFinishLocation);
        if (isFinishLocation) {
            startPlace === 'Start' && setStartPlace('Please Select');
        }
        else {
            startPlace === 'Please Select' && setStartPlace('Start');
        }
    }

    const changeText = (value: Boolean) => {
        setShowMore(value);
        if (!value) {
            setShowMoreText('Less...');
        }
        else {
            setShowMoreText('More...')
        }
    }

    const dateView = (
        <View style={styles.dateTimeSelectedView}>
            {/* <Button title={activityDate === null ? "Show Date Picker" : activityDate.getDate().toString()} onPress={() => setDatePickerVisibility(true)} /> */}
            <CustomButton
                onPress={showStartDatePicker}
                title={showDateText(activityStartDate)}
                styleText={styles.selectedText}
            />
            {warningDate === 1 && <Popover iconName={'alert'} text={'Seçtiğiniz Tarih Güncel Değil!'} />}
            {warningDate === 2 && <Popover iconName={'alert'} text={'Bu Alan Boş Bırakılamaz'} />}
            <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                mode="date"
                onConfirm={handleStartDateConfirm}
                onCancel={() => setStartDatePickerVisibility(false)}
            />
        </View>
    )

    const timeView = (
        <View style={styles.dateTimeSelectedView}>
            <CustomButton
                onPress={() => setStartTimePickerVisibility(true)}
                title={showTimeText(activityStartDate, activityStartTime)}
                styleText={styles.selectedText}
            />
            {warningTime === 1 && <Popover iconName={'alert'} text={'En az 2 saat zaman olmalı!'} />}
            {warningTime === 2 && <Popover iconName={'alert'} text={'Bu Alan Boş Bırakılamaz'} />}
            <DateTimePickerModal
                isVisible={isStartTimePickerVisible}
                mode="time"
                onConfirm={handleStartTimeConfirm}
                onCancel={() => setStartTimePickerVisibility(false)}
            />
        </View>
    )

    const location = (
        <TouchableNativeFeedback onPress={openStartSearchModal}>
            <View style={{
                height: height * 0.06, borderWidth: 1, flexDirection: 'row', alignSelf: 'center',
                borderRadius: 10, borderColor: '#CCC', backgroundColor: 'white', justifyContent: 'center',
            }}>
                <View style={{ flex: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: width * 0.045, }}>{startPlace}</Text>
                </View>
                <Ionicons size={25} name="caret-down"
                    style={{ alignSelf: 'center', color: '#CCC' }}
                />
            </View>
        </TouchableNativeFeedback>
    )

    const finishLocation = (
        <View style={{
            flexDirection: 'row',
            // backgroundColor: 'yellow'
        }}>
            <TouchableNativeFeedback onPress={openStartSearchModal}>
                <View style={{
                    height: height * 0.06, borderWidth: 1, flexDirection: 'row', alignSelf: 'center',
                    borderRadius: 10, borderColor: '#CCC', backgroundColor: 'white',
                    justifyContent: 'space-between', flex: 10,
                }}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        // backgroundColor: 'red'
                    }}>
                        <Text style={{ fontSize: width * 0.045, textAlign: 'center' }}>{startPlace}</Text>
                    </View>
                    <Ionicons size={25} name="caret-down"
                        style={{ alignSelf: 'center', color: '#CCC', backgroundColor: 'white', }}
                    />
                </View>
            </TouchableNativeFeedback>
            <View style={{ flex: 1, backgroundColor: '#EEE', }} />
            <TouchableNativeFeedback onPress={openFinishSearchModal}>
                <View style={{
                    height: height * 0.06, borderWidth: 1, flexDirection: 'row', alignSelf: 'center',
                    borderRadius: 10, borderColor: '#CCC', backgroundColor: 'white',
                    justifyContent: 'space-between', flex: 10
                }}>
                    <View style={{
                        flex: 1, justifyContent: 'center',
                    }}>
                        <Text style={{ fontSize: width * 0.045, textAlign: 'center' }}>{finishPlace}</Text>
                    </View>
                    <Ionicons size={25} name="caret-down"
                        style={{ alignSelf: 'center', color: '#CCC' }}
                    />
                </View>
            </TouchableNativeFeedback>
        </View>
    )

    const more = (
        <TouchableNativeFeedback onPress={() => changeText(!showMore)}>
            <View style={{
                flexDirection: 'row-reverse',
                margin: 15,
                // backgroundColor: 'red'
            }}>
                <Text
                    style={{
                        textDecorationLine: 'underline',
                        fontWeight: 'bold',
                    }}>{showMoreText}</Text>
            </View>
        </TouchableNativeFeedback>
    )

    const showFinishDateTime = (
        <View style={{ flexDirection: 'row', marginTop: 10, }}>
            <View style={{
                flex: 10,
                height: height * 0.1, paddingLeft: 10,
                // backgroundColor: 'red',
            }}>
                <Text style={{ fontWeight: 'bold', paddingBottom: 7, paddingLeft: 10 }}>Finish Date</Text>
                <TouchableNativeFeedback onPress={() => setFinishDatePickerVisibility(true)}>
                    <View style={{
                        height: height * 0.06, borderWidth: 1, flexDirection: 'row', alignSelf: 'center',
                        borderRadius: 10, backgroundColor: 'white', justifyContent: 'center', borderColor: '#CCC'
                    }}>
                        <View style={{ width: '90%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: width * 0.045, }}>{showDateText(activityFinishDate)}</Text>
                        </View>
                        <Ionicons size={25} name="caret-down"
                            style={{ alignSelf: 'center', color: '#CCC' }}
                        />
                        <DateTimePickerModal
                            isVisible={isFinishDatePickerVisible}
                            mode="date"
                            onConfirm={handleFinishDateConfirm}
                            onCancel={() => setFinishDatePickerVisibility(false)}
                        />
                    </View>
                </TouchableNativeFeedback>
            </View>
            <View style={{ flex: 1, backgroundColor: '#EEE', }} />
            <View style={{
                flex: 10,
                height: height * 0.08, paddingRight: 12,
                // backgroundColor: 'red',
            }}>
                <Text style={{ fontWeight: 'bold', paddingBottom: 7, paddingLeft: 10 }}>Finish Time</Text>
                <TouchableNativeFeedback onPress={() => setFinishTimePickerVisibility(true)}>
                    <View style={{
                        height: height * 0.06, borderWidth: 1, flexDirection: 'row', alignSelf: 'center',
                        borderRadius: 10, backgroundColor: 'white', justifyContent: 'center', borderColor: '#CCC'
                    }}>
                        <View style={{ width: '90%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: width * 0.045, }}>{showTimeText(activityFinishDate, activityFinishTime)}</Text>
                        </View>
                        <Ionicons size={25} name="caret-down"
                            style={{ alignSelf: 'center', color: '#CCC' }}
                        />
                        <DateTimePickerModal
                            isVisible={isFinishTimePickerVisible}
                            mode="time"
                            onConfirm={handleFinishTimeConfirm}
                            onCancel={() => setFinishTimePickerVisibility(false)}
                        />
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    )

    const showGender = (
        <View style={{
            height: height * 0.1,
            paddingLeft: 15, paddingRight: 15,
            marginTop: 10
            // backgroundColor: 'red' 
        }}
        >
            <ActionSheetMenu
                label={'Gender'}
                title={'Select'}
                items={[
                    'Man', 'Woman',
                    'Cancel']} onPress={() => console.log('TEST')} />
        </View>
    )

    const showAge = (
        <View style={{ flexDirection: 'row', marginTop: 10, }}>
            <View style={{
                flex: 10,
                height: height * 0.1, paddingLeft: 15,
                paddingRight: 5,
                // backgroundColor: 'red',
            }}>
                <ActionSheetMenu
                    label={'Age Min'}
                    title={'Select'}
                    items={[
                        '7', '8', '9',
                        '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                        '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
                        '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
                        '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
                        '50', '51', '52', '53', '54', '55', '56', '57', '58', '59',
                        '60', '61', '62', '63', '64', '65', '66', '67', '68', '69',
                        '70', '71', '72', '73', '74', '75', '76', '77',
                        'Cancel']} onPress={() => console.log('TEST')} />
            </View>
            <View style={{ flex: 1, backgroundColor: '#EEE', }} />
            <View style={{
                flex: 10,
                height: height * 0.08, paddingRight: 15,
                // backgroundColor: 'red',
            }}>
                <ActionSheetMenu
                    label={'Age Max'}
                    title={'Select'}
                    items={[
                        '7', '8', '9',
                        '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                        '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
                        '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
                        '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
                        '50', '51', '52', '53', '54', '55', '56', '57', '58', '59',
                        '60', '61', '62', '63', '64', '65', '66', '67', '68', '69',
                        '70', '71', '72', '73', '74', '75', '76', '77',
                        'Cancel']} onPress={() => console.log('TEST')} />
            </View>
        </View>
    )

    const showQuota = (
        <View style={{ flexDirection: 'row', marginTop: 10, }}>
            <View style={{
                flex: 10,
                height: height * 0.08, paddingLeft: 15,
                marginBottom: 10,
                paddingRight: 5,
                // backgroundColor: 'red',
            }}>
                <ActionSheetMenu
                    label={'Quota Min'}
                    title={'Select'}
                    items={[
                        '1', '2', '3', '4', '5', '6', '7', '8', '9',
                        '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                        '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
                        '30', 'more',
                        'Cancel']} onPress={() => console.log('TEST')} />
            </View>
            <View style={{ flex: 1, backgroundColor: '#EEE', }} />
            <View style={{
                flex: 10,
                height: height * 0.08, paddingRight: 15,
                // backgroundColor: 'red',
            }}>
                <ActionSheetMenu
                    label={'Quota Max'}
                    title={'Select'}
                    items={[
                        '1', '2', '3', '4', '5', '6', '7', '8', '9',
                        '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                        '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
                        '30', 'more',
                        'Cancel']} onPress={() => console.log('TEST')} />
            </View>
        </View>
    )

    return (
        <MenuProvider>
            <View style={styles.container}>
                <View style={styles.firstRow}>
                    <View style={styles.branch}>
                        <ScrollView horizontal={true}>
                            <TouchableOpacity style={styles.branchIcon} onPress={() => setBranchNo(0)}>
                                <Image style={styles.imgBranch} source={require('../assets/img/jogging.png')} />
                                <Text style={styles.textBranch}>Jogging</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.branchIcon} onPress={() => setBranchNo(1)}>
                                <Image style={styles.imgBranch} source={require('../assets/img/basketball.png')} />
                                <Text style={styles.textBranch}>Basketball</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.branchIcon} onPress={() => setBranchNo(1)}>
                                <Image style={styles.imgBranch} source={require('../assets/img/bcycle.png')} />
                                <Text style={styles.textBranch}>Bcycle</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.branchIcon} onPress={() => setBranchNo(1)}>
                                <Image style={styles.imgBranch} source={require('../assets/img/hiking.png')} />
                                <Text style={styles.textBranch}>Hiking</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.branchIcon} onPress={() => setBranchNo(1)}>
                                <Image style={styles.imgBranch} source={require('../assets/img/tableTennis.png')} />
                                <Text style={styles.textBranch}>Table Tennis</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.branchIcon} onPress={() => setBranchNo(1)}>
                                <Image style={styles.imgBranch} source={require('../assets/img/hiking.png')} />
                                <Text style={styles.textBranch}>Bowling</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.branchIcon} onPress={() => setBranchNo(1)}>
                                <Image style={styles.imgBranch} source={require('../assets/img/tableTennis.png')} />
                                <Text style={styles.textBranch}>Frisbee</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <ScrollView>
                        <View style={{
                            height: height * 0.1, paddingLeft: 15, paddingRight: 15,
                        }}
                        >
                            <ActionSheetMenu
                                label={'Activity Name*'}
                                title={'Select'}
                                items={['Bisiklet Bizim İşimiz', 'Koşmaya Var Mısın?',
                                    'Bisiklet Turu', 'Basketbol Maçı',
                                    'Test 1', 'Test 2',
                                    'Test 3', 'Test 4',
                                    'Test 5', 'Test 6',
                                    'Test 7', 'Test 8',
                                    'Test 9', 'Test 10',
                                    'Test 11', 'Test 12',
                                    'Cancel']} onPress={() => console.log('TEST')} />
                        </View>
                        <View style={{
                            height: height * 0.11,
                            paddingLeft: 10,
                            paddingRight: 10,
                            marginTop: 5,
                            // backgroundColor: 'yellow',
                            justifyContent: 'center'
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                height: height * 0.03,
                                marginBottom: 5,
                                // backgroundColor: 'orange', 
                                alignItems: 'center',
                            }}>
                                <View style={{ flex: 1, paddingLeft: 10 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Location*</Text>
                                </View>
                                <View style={{
                                    flex: 1,
                                    alignItems: 'flex-end',
                                    paddingRight: 10,
                                }}>
                                    <Text>Add Finish Location</Text>
                                </View>
                                <BouncyCheckbox
                                    size={20}
                                    textColor="#000"
                                    fillColor={colors.bar}
                                    onPress={(checked) => changeLocation()}
                                />
                            </View>
                            {isFinishLocation ? finishLocation : location}
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            height: height * 0.1,
                            marginTop: 5,
                            // backgroundColor: 'red',
                        }}>
                            <View style={{
                                flex: 10,
                                // height: height * 0.1, 
                                paddingLeft: 10,
                                // backgroundColor: 'red',
                            }}>
                                <Text style={{ fontWeight: 'bold', paddingBottom: 7, paddingLeft: 10 }}>Start Date*</Text>
                                <TouchableNativeFeedback onPress={() => setStartDatePickerVisibility(true)}>
                                    <View style={{
                                        height: height * 0.06, borderWidth: 1, flexDirection: 'row', alignSelf: 'center',
                                        borderRadius: 10, backgroundColor: 'white', justifyContent: 'center', borderColor: '#CCC'
                                    }}>
                                        <View style={{ width: '90%', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: width * 0.045, }}>{showDateText(activityStartDate)}</Text>
                                        </View>
                                        <Ionicons size={25} name="caret-down"
                                            style={{ alignSelf: 'center', color: '#CCC' }}
                                        />
                                        <DateTimePickerModal
                                            isVisible={isStartDatePickerVisible}
                                            mode="date"
                                            onConfirm={handleStartDateConfirm}
                                            onCancel={() => setStartDatePickerVisibility(false)}
                                        />
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                            <View style={{ flex: 1, backgroundColor: '#EEE', }} />
                            <View style={{
                                flex: 10,
                                height: height * 0.1,
                                paddingRight: 12,
                                // backgroundColor: 'red',
                            }}>
                                <Text style={{ fontWeight: 'bold', paddingBottom: 7, paddingLeft: 10 }}>Start Time*</Text>
                                <TouchableNativeFeedback onPress={() => setStartTimePickerVisibility(true)}>
                                    <View style={{
                                        height: height * 0.06, borderWidth: 1, flexDirection: 'row', alignSelf: 'center',
                                        borderRadius: 10, backgroundColor: 'white', justifyContent: 'center', borderColor: '#CCC'
                                    }}>
                                        <View style={{ width: '90%', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: width * 0.045, }}>{showTimeText(activityStartDate, activityStartTime)}</Text>
                                        </View>
                                        <Ionicons size={25} name="caret-down"
                                            style={{ alignSelf: 'center', color: '#CCC' }}
                                        />
                                        <DateTimePickerModal
                                            isVisible={isStartTimePickerVisible}
                                            mode="time"
                                            onConfirm={handleStartTimeConfirm}
                                            onCancel={() => setStartTimePickerVisibility(false)}
                                        />
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </View>
                        {showMore ? more : showFinishDateTime}
                        {!showMore && showGender}
                        {!showMore && showAge}
                        {!showMore && showQuota}
                        {!showMore && more}
                    </ScrollView>
                </View>
                <View style={styles.secondRow}>
                    <CustomButton onPress={() => save()}
                        title='Create Activity'
                    />
                </View>
            </View >
        </MenuProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEE'
    },
    firstRow: {
        flex: 10,
    },
    secondRow: {
        flex: 1,
        justifyContent: 'center',
        // backgroundColor: 'red'
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        shadowOpacity: 1,
    },
    branch: {
        // flex: 1,
        height: '18%',
        // borderBottomWidth: 1,
        // backgroundColor: 'yellow',
    },
    branchTitleView: {
        paddingLeft: width * 0.05,
        justifyContent: 'center',
        paddingTop: 1,
        height: '22%',
        // backgroundColor: 'red',
    },
    branchTitleText: {
        fontSize: width * 0.045,
        color: 'gray',
    },
    branchIcon: {
        paddingTop: 10,
        width: 74,
        // backgroundColor: 'yellow'
    },
    imgBranch: {
        height: 54,
        width: 54,
        alignSelf: 'center',
        // marginLeft: 20,
    },
    textBranch: {
        textAlign: 'center',
    },
    activityTitleText: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: width * 0.045,
    },
    rowActivity: {
        width: '88%',
        height: 50,
        marginTop: 5,
        alignSelf: 'center',
    },
    rowLocation: {
        marginTop: 10,
        height: 85,
        // backgroundColor: 'red'
    },
    locationView: {
        flexDirection: 'row',
        width: '30%',
        height: 35,
        backgroundColor: '#37CC4A',
        alignSelf: 'center',
        borderRadius: 10,
    },
    locationText: {
        flex: 1,
        fontSize: width * 0.045,
        color: 'white',
        textAlign: 'center',
        alignSelf: 'center'
    },
    locationIcon: {
        alignSelf: 'center',
        paddingEnd: 5,
    },
    selectedText: {
        textAlign: 'center',
        fontSize: width * 0.045,
        color: 'black',
    },
    dateColView: {
        width: '30%',
        // backgroundColor: 'blue'
    },
    dateView: {
        flexDirection: 'row',
        height: 35,
        backgroundColor: '#37CC4A',
        borderRadius: 10,
    },
    selectedTitle: {
        flex: 1,
        fontSize: width * 0.045,
        color: 'white',
        textAlign: 'center',
        alignSelf: 'center',
    },
    dateTimeSelectedView: {
        flexDirection: 'row',
        paddingLeft: '10%',
        paddingRight: '10%',
        marginTop: 5,
        justifyContent: 'center',
    },
    timeColView: {
        width: '30%',
        // backgroundColor: 'purple'
    },
    timeView: {
        flexDirection: 'row',
        height: 35,
        backgroundColor: '#37CC4A',
        borderRadius: 10,
    },
    rowDateTime: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 85,//height - 150,
        // backgroundColor: 'red',
    },
    rowProperty: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 85,
    },
    ageColView: {
        width: '25%',
        // backgroundColor: 'blue'
    },
    ageView: {
        flexDirection: 'row',
        height: 35,
        backgroundColor: '#37CC4A',
        borderRadius: 10,
    },
    genderColView: {
        width: '25%',
        // backgroundColor: 'blue'
    },
    genderView: {
        flexDirection: 'row',
        height: 35,
        backgroundColor: '#37CC4A',
        borderRadius: 10,
    },
    quotaColView: {
        width: '25%',
        // backgroundColor: 'blue'
    },
    quotaView: {
        flexDirection: 'row',
        height: 35,
        backgroundColor: '#37CC4A',
        borderRadius: 10,
    },
    rowHorizontal: {
        flex: 1,
        marginTop: 5,
        alignItems: 'center',
        flexDirection: 'row',
    },
    editText: {
        flex: 1,
        height: 40,
        // paddingTop: '2%',
        paddingLeft: 10,
        fontSize: 15,
        borderColor: 'gray',
        backgroundColor: '#DDD',
        borderRadius: 5,
        shadowOpacity: .3,
        // borderBottomWidth: 1,
        paddingBottom: 2,
    },
});

export default CreateActivityScreen2;