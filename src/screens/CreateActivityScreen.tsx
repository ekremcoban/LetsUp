import React, { useEffect, useState } from 'react';
import {
    StyleSheet, View, Text, ScrollView, TouchableOpacity,
    Image, TextInput, Alert, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { window } from '../utilities/constants/globalValues';
import Popover from '../components/popover';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firestore from '@react-native-firebase/firestore';
import { MenuProvider } from 'react-native-popup-menu';
import RNGooglePlaces from 'react-native-google-places';
import CustomButton from '../components/buttons/customButton';

const { width, height } = window;
const startPlacePlaceholder = 'Aktivite Başlangıç Konumu İçin Tıklayın';

const CreateActivityScreen = () => {
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
        let result = "Tarihi Seçiniz";

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
            result = "Tarihi Seçiniz";
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
        let result = "Saat Seçiniz";

        if (activityDate != null && activityTime != null
            && new Date().getFullYear() === activityDate.getFullYear()
            && new Date().getMonth() === activityDate.getMonth()
            && new Date().getDate() === activityDate.getDate()
            && activityTime.getHours() * 60 + activityTime.getMinutes() <= (new Date().getHours() + 2) * 60 + new Date().getMinutes()) {
            result = 'Saat Seçiniz'
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
            result = 'Saat Seçiniz'
        }
        return result
    }

    const dateView = (
        <View style={{
            flex: 1, paddingLeft: '10%', paddingRight: '10%', flexDirection: 'row',
            justifyContent: 'center', alignItems: 'center'
        }}>
            {/* <Button title={activityDate === null ? "Show Date Picker" : activityDate.getDate().toString()} onPress={() => setDatePickerVisibility(true)} /> */}
            <CustomButton
                onPress={showDatePicker}
                title={showDateText()}
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
        <View style={{
            flex: 1, paddingLeft: '10%', paddingRight: '10%', flexDirection: 'row',
            justifyContent: 'center', alignItems: 'center'
        }}>
            <CustomButton
                onPress={() => setTimePickerVisibility(true)}
                title={showTimeText()}
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
                    <View style={styles.border} />
                    <Text style={styles.activityTitleText}>Etkinlik Adı</Text>
                    <View style={styles.row}>
                        <View style={styles.rowHorizontal}>
                            <TextInput
                                style={styles.editText}
                                onChangeText={text => setActivityTitle(text)}
                                placeholder={'Etkinlik Adı Giriniz'}
                                value={title}
                                autoCorrect={false}
                            />
                            {warningTitle && <Popover iconName={'alert'} text={'Bu Alanı Boş Bırakamazsınız!'} />}
                        </View>
                    </View>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={branchNo === 0 ? [styles.location, { height: 100, }] : styles.location}>
                            <View style={styles.rowPlace}>
                                <TouchableOpacity
                                    onPress={setActityStartPlace}
                                >
                                    <Text style={{ textAlign: 'center' }}>{startPlace}</Text>
                                </TouchableOpacity>
                                {warningStartPlace ? <Popover iconName={'alert'} text={'Bu Alanı Boş Bırakamazsınız!'} /> : null}
                            </View>
                            {branchNo === 0 && finishPlaceTextInput}
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.rowDateTime}>
                            {dateView}
                            {timeView}
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.rowTrait}>
                            <View style={{
                                flex: 1, flexDirection: 'column', alignItems: 'center',
                                shadowOpacity: .2, marginLeft: 10, marginEnd: 10,
                            }}>
                                <Text style={{
                                    backgroundColor: '#37CC4A', padding: 5, color: 'white',
                                    fontSize: 16, width: '80%', height: '50%', textAlign: 'center',
                                }}>Yaş Aralığı</Text>
                                <TextInput
                                    style={{
                                        width: '80%', height: '50%', shadowOpacity: .2, marginTop: 5, textAlign: 'center',
                                        marginLeft: 20, marginRight: 20, backgroundColor: '#EEE', borderRadius: 5,
                                    }}
                                    onChangeText={text => setAgeStart(text)}
                                    value={ageStart}
                                    keyboardType={'numeric'}
                                    autoCorrect={false}
                                />
                            </View>
                            <View style={{
                                flex: 1, flexDirection: 'column', alignItems: 'center',
                                shadowOpacity: .2, marginLeft: 10, marginEnd: 10,
                            }}>
                                <Text style={{
                                    backgroundColor: '#37CC4A', padding: 5, color: 'white',
                                    fontSize: 16, width: '80%', height: '50%', textAlign: 'center',
                                }}>Cinsiyet</Text>
                                <TextInput
                                    style={{
                                        width: '80%', height: '50%', shadowOpacity: .2, marginTop: 5, textAlign: 'center',
                                        marginLeft: 20, marginRight: 20, backgroundColor: '#EEE', borderRadius: 5,
                                    }}
                                    onChangeText={text => setGender(text)}
                                    value={gender}
                                    autoCorrect={false}
                                />
                            </View>
                            <View style={{
                                flex: 1, flexDirection: 'column', alignItems: 'center',
                                shadowOpacity: .2, marginLeft: 10, marginEnd: 10,
                            }}>
                                <Text style={{
                                    backgroundColor: '#37CC4A', padding: 5, color: 'white',
                                    fontSize: 16, width: '80%', height: '50%', textAlign: 'center',
                                }}>Kontenjan</Text>
                                <TextInput
                                    style={{
                                        width: '80%', height: '50%', shadowOpacity: .2, marginTop: 5, textAlign: 'center',
                                        marginLeft: 20, marginRight: 20, backgroundColor: '#EEE', borderRadius: 5,
                                    }}
                                    onChangeText={text => setQuota(text)}
                                    value={quota}
                                    keyboardType={'numeric'}
                                    autoCorrect={false}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
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
        height: '22%',
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
    location: {
        // flex: 1,
        marginTop: 20,
        height: 50,//height - 150,
        // backgroundColor: 'green',
    },
    rowPlace: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,//height - 150,
        // backgroundColor: 'red',
    },
    rowFinishPlace: {
        // flex: 1,
        height: 40,//height - 150,
        // backgroundColor: 'red',
    },
    rowDateTime: {
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 100,//height - 150,
        // backgroundColor: 'red',
    },
    tarih: {
        flex: 1,
        backgroundColor: 'green',
    },
    row: {
        width: '88%',
        height: 50,
        marginTop: 5,
        alignSelf: 'center',
    },
    rowTrait: {
        flexDirection: 'row',
        height: 70,
    },
    rowHorizontal: {
        flex: 1,
        marginTop: 10,
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

export default CreateActivityScreen;