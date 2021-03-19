import React, { useEffect, useState } from 'react';
import {
    StyleSheet, View, Text, ScrollView, TouchableOpacity,
    Image, TextInput, Alert, TouchableWithoutFeedback, Keyboard, TouchableNativeFeedback
} from 'react-native';
import { window } from '../utilities/constants/globalValues';
import Popover from '../components/popover';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firestore from '@react-native-firebase/firestore';
import { MenuProvider } from 'react-native-popup-menu';
import RNGooglePlaces from 'react-native-google-places';
import CustomButton from '../components/buttons/customButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableHighlight } from 'react-native-gesture-handler';

const { width, height } = window;
const startPlacePlaceholder = 'Seçiniz';

const CreateActivityScreen2 = () => {
    const [branchNo, setBranchNo] = useState<number>(1);
    const [title, setTitle] = useState<string>('');
    const [startPlace, setStartPlace] = useState<string>(startPlacePlaceholder);
    const [finishPlace, setFinishPlace] = useState<string>('Aktivite Bitiş Konumu İçin Tıklayın');
    const [warningTitle, setWarningTitle] = useState<boolean>(false);
    const [warningStartPlace, setWarningStartPlace] = useState<boolean>(false);
    const [warningDate, setWarningDate] = useState<number>(0);
    const [warningTime, setWarningTime] = useState<number>(0);
    const [activityDate, setActivityDate] = useState<Date>(undefined);
    const [activityTime, setActivityTime] = useState<Date>(undefined);
    const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState<boolean>(false);
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

            if (activityDate != undefined) {
                setWarningDate(0);
            }
            else {
                setWarningDate(2);
            }

            if (activityTime != undefined) {
                setWarningTime(0);
            }
            else {
                setWarningTime(2);
            }
            Alert.alert('Başarısız')
        }
    }

    const openSearchModal = () => {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
                console.log(place);
                p = place.name;
                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
            })
            .catch(error => console.log(error.message)) // error is a Javascript Error object
            .finally(a => setStartPlace(p))
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

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    }

    const handleDateConfirm = (date: Date) => {
        setActivityDate(date)
        setDatePickerVisibility(false)

        if (date.getFullYear() > new Date().getFullYear()
            || date.getFullYear() == new Date().getFullYear() && date.getMonth() > new Date().getMonth()
            || (date.getFullYear() == new Date().getFullYear() && date.getMonth() == new Date().getMonth()
                && date.getDate() >= new Date().getDate())) {
            setActivityDate(date);
            setActivityTime(null);
            setWarningDate(0);
            setWarningTime(0)

            // console.warn('dışarda tarih');
        }
        else {
            setActivityDate(date);
            setActivityTime(null);
            setWarningDate(1);
        }
    };

    const showDateText = () => {
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

    const handleTimeConfirm = (date: Date) => {
        setTimePickerVisibility(false)

        if (activityDate != null
            && activityDate.getFullYear() === new Date().getFullYear()
            && activityDate.getMonth() === new Date().getMonth()
            && activityDate.getDate() === new Date().getDate()
            && date.getHours() * 60 + date.getMinutes() <= (new Date().getHours() + 2) * 60 + new Date().getMinutes()) {
            setActivityTime(null);
            setWarningTime(1);
            // console.warn('En az 2 saat olmalı');
        }
        else {
            setActivityTime(date);
            setWarningTime(0);
            // console.warn('saat');
        }
    };

    const showTimeText = () => {
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

    const dateView = (
        <View style={styles.dateTimeSelectedView}>
            {/* <Button title={activityDate === null ? "Show Date Picker" : activityDate.getDate().toString()} onPress={() => setDatePickerVisibility(true)} /> */}
            <CustomButton
                onPress={showDatePicker}
                title={showDateText()}
                styleText={styles.selectedText}
            />
            {warningDate === 1 && <Popover iconName={'alert'} text={'Seçtiğiniz Tarih Güncel Değil!'} />}
            {warningDate === 2 && <Popover iconName={'alert'} text={'Bu Alan Boş Bırakılamaz'} />}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={() => setDatePickerVisibility(false)}
            />
        </View>
    )

    const timeView = (
        <View style={styles.dateTimeSelectedView}>
            <CustomButton
                onPress={() => setTimePickerVisibility(true)}
                title={showTimeText()}
                styleText={styles.selectedText}
            />
            {warningTime === 1 && <Popover iconName={'alert'} text={'En az 2 saat zaman olmalı!'} />}
            {warningTime === 2 && <Popover iconName={'alert'} text={'Bu Alan Boş Bırakılamaz'} />}
            <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={() => setTimePickerVisibility(false)}
            />
        </View>
    )

    return (
        <MenuProvider>
            <View style={styles.container}>
                <View style={styles.firstRow}>
                    <View style={styles.branch}>
                        <View style={styles.branchTitleView}>
                            <Text style={styles.branchTitleText}>Branş Seçiniz</Text>
                        </View>
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
                    <View style={{ height: height * 0.07, paddingLeft: 15, paddingRight: 15, }}>
                        <Text style={{ fontWeight: 'bold', paddingBottom: 7 }}>Activity Name*</Text>
                        <TouchableNativeFeedback onPress={() => console.warn('TEST')}>
                            <View style={{
                                height: height * 0.05, borderWidth: 1,
                                borderRadius: 10, backgroundColor: 'white', justifyContent: 'center'
                            }}>
                                <Ionicons size={25} name="caret-down"
                                    style={{ alignSelf: 'flex-end' }}
                                />
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
                <View style={styles.secondRow}>
                    <CustomButton onPress={() => save()}
                        title='Etkinlik Oluştur'
                    />
                </View>
            </View >
        </MenuProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    firstRow: {
        flex: 5,
    },
    secondRow: {
        flex: 1,
        justifyContent: 'center',
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        shadowOpacity: 1,
    },
    branch: {
        // flex: 1,
        height: '20%',
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