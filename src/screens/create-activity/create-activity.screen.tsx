import React, { useState, createRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Popover from '../../components/popover';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import firestore from '@react-native-firebase/firestore';
import { MenuProvider } from 'react-native-popup-menu';
import RNGooglePlaces from 'react-native-google-places';
import CustomButton from '../../components/buttons/customButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IActionSheet } from 'components/action-sheet/action-sheet';
import { ActivityNameActionSheet } from './action-sheets/activity-name.action-sheet';
import { AgeRangeActionSheet } from './action-sheets/ageRange.action-sheet';
import { QuotaActionSheet } from './action-sheets/quota.action-sheet';
import { GenderActionSheet } from './action-sheets/gender.action-sheet';
import { getSelectedGender } from 'models/genders';
import { activityNames, getSelectedActivityName } from 'models/activity-names';
import { Selector } from 'components/selector/selector';
import { ActivityTypeSelector } from 'components/activity-type-selector/activity-type-selector';
import {
  activityTypes,
  IActivityType,
} from 'components/activity-type-selector/models';
import { MAX_LOCATION_COUNT } from './constants';
import { colors } from 'styles/colors';
import { useNavigation } from '@react-navigation/native';
import { getData } from 'db/localDb';

const activityNameActionSheetRef = createRef<IActionSheet>();
const ageRangeActionSheetRef = createRef<IActionSheet>();
const quotaActionSheetRef = createRef<IActionSheet>();
const genderActionSheetRef = createRef<IActionSheet>();

type Location = {
  id: number;
  location: string;
};

const CreateActivityScreen2 = () => {
  const navigation = useNavigation();
  const [branchName, setBranchName] = useState<string>(String || undefined);
  const [activityName, setActivityName] = useState<string>('');

  const [warningTitle, setWarningTitle] = useState<boolean>(false);
  const [warningStartPlace, setWarningStartPlace] = useState<boolean>(false);
  const [warningDate, setWarningDate] = useState<number>(0);
  const [warningTime, setWarningTime] = useState<number>(0);

  const [locations, setLocations] = useState();

  const [activityDate, setActivityDate] = useState<Date>(undefined);
  const [activityStartTime, setActivityStartTime] = useState<Date>(undefined);
  const [activityFinishTime, setActivityFinishTime] = useState<Date>(undefined);
  const [
    isDateActionSheetVisible,
    setDateActionSheetVisibility,
  ] = useState<boolean>(false);
  const [
    isStartTimeActionSheetVisible,
    setStartTimeActionSheetVisibility,
  ] = useState<boolean>(false);
  const [
    isFinishTimeActionSheetVisible,
    setFinishTimeActionSheetVisibility,
  ] = useState<boolean>(false);

  const [selectedActivityNameValue, setSelectedActivityNameValue] = useState<
    number | null
  >(null);

  const [selectedAgeRange, setSelectedAgeRange] = useState<
    [number | null, number | null]
  >([null, null]);

  const [selectedQuotaRange, setSelectedQuotaRange] = useState<
    [number | null, number | null]
  >([null, null]);

  const [selectedGenderValue, setSelectedGenderValue] = useState<number | null>(
    null
  );

  const [warning, setWarning] = useState({
    activityName: false,
    location: false,
    date: false,
    startTime: false,
    finishTime: false,
  });

  const insertData = (data: Object) => {
    console.log('data1', data);
    firestore()
      .collection('Test')
      .add(data)
      .then(() => {
        console.log('User added!');
      })
      .catch((error) => {
        console.error('Hata', error);
      });
  };

  const save = () => {
    let warningTemp = {
      activityName: false,
      location: false,
      date: false,
      startTime: false,
      finishTime: false,
    };

    let startActivityTime = null;
    let finishActivityTime = null;

    console.log('selectedActivityNameValue', selectedActivityNameValue);
    if (selectedActivityNameValue == null || selectedActivityNameValue === 0) {
      warningTemp.activityName = true;
    }

    if (locations == undefined) {
      warningTemp.location = true;
    }

    if (activityDate == undefined) {
      warningTemp.date = true;
    }

    if (activityStartTime == undefined) {
      warningTemp.startTime = true;
    } else {
    }

    if (activityFinishTime == undefined) {
      warningTemp.finishTime = true;
    }

    if (activityDate != undefined && activityStartTime != undefined) {
      startActivityTime = new Date(
        activityDate.getFullYear(),
        activityDate.getMonth(),
        activityDate.getDate(),
        activityStartTime.getHours(),
        activityStartTime.getMinutes()
      );
    }

    if (activityDate != undefined && activityFinishTime != undefined) {
      finishActivityTime = new Date(
        activityDate.getFullYear(),
        activityDate.getMonth(),
        activityDate.getDate(),
        activityFinishTime.getHours(),
        activityFinishTime.getMinutes()
      );
    }

    if (
      !warningTemp.activityName &&
      !warningTemp.location &&
      !warningTemp.date &&
      !warningTemp.startTime &&
      !warningTemp.finishTime
    ) {
      const activity = {
        type: branchName,
        name: polyglot.t(
          activityNames.filter((a) => a.value === selectedActivityNameValue)[0]
            .text
        ),
        location: locations,
        date: activityDate.getTime(),
        startTime: activityStartTime != null && startActivityTime.getTime(),
        finishTime: activityFinishTime != null && finishActivityTime.getTime(),
        gender: selectedGenderValue === 2 ? 'Man' : 'Woman',
        minAge: selectedAgeRange[0],
        maxAge: selectedAgeRange[1],
        minQuota: selectedQuotaRange[0],
        maxQuota: selectedQuotaRange[1],
      };
      console.log('activity', activity);
    }

    setWarning(warningTemp);

    // getData('Users').then(res => {
    //   console.log('users', res)
    //   if (res == null) {
    //     Alert.alert(
    //       `${polyglot.t('alert.warning')}`,
    //       `${polyglot.t('alert.create_activity.save_text')}`,
    //       [
    //         { text: "OK", onPress: () => navigation.navigate('Login') }
    //       ]
    //     );
    //   }
    //   else if (res.age == null) {
    //     Alert.alert(
    //       `${polyglot.t('alert.warning')}`,
    //       `${polyglot.t('alert.create_activity.save_text')}`,
    //       [
    //         { text: "OK", onPress: () => navigation.navigate('Create Profile') }
    //       ]
    //     );
    //   }
    //   else {
    //     Alert.alert('Kayıt Yapıldı')
    //   }
    // })

    // TODO: Uncomment when we start implementing save functionality
    //
    // console.log('BURDA');
    // let [month, date, year] = new Date().toLocaleDateString('en-US').split('/');
    // let [hour, minute, second] = new Date()
    //   .toLocaleTimeString('tr-TR')
    //   .split(/:| /);
    // date = Number(date) < 10 ? '0' + date : date;
    // month = Number(month) < 10 ? '0' + month : month;
    // let now =
    //   year +
    //   '/' +
    //   month +
    //   '/' +
    //   date +
    //   ' ' +
    //   hour +
    //   ':' +
    //   minute +
    //   ':' +
    //   second;
    // let sendData = null;
    // // console.warn('startplace', startPlace)
    // if (
    //   title.length > 0 &&
    //   startPlace !== startPlacePlaceholder &&
    //   warningDate === 0 &&
    //   activityTime != undefined
    // ) {
    //   setWarningTitle(false);
    //   Alert.alert('Başarılı');
    //   sendData = {
    //     test: {
    //       id: 1,
    //       title: title,
    //       place: startPlace,
    //       activityTime: activityTime,
    //       // activityCreateDate: now,
    //       activityCreateDate: new Date(),
    //     },
    //   };
    //   console.log('send', sendData);
    //   insertData(sendData);
    // } else {
    //   if (title.length == 0) {
    //     setWarningTitle(true);
    //   } else {
    //     setWarningTitle(false);
    //   }
    //   if (startPlace !== startPlacePlaceholder) {
    //     setWarningStartPlace(false);
    //   } else {
    //     setWarningStartPlace(true);
    //   }
    //   if (activityDate != undefined) {
    //     setWarningDate(0);
    //   } else {
    //     setWarningDate(2);
    //   }
    //   if (activityStartTime != undefined) {
    //     setWarningTime(0);
    //   } else {
    //     setWarningTime(2);
    //   }
    //   Alert.alert('Başarısız');
    // }
  };

  const handleDateConfirm = (date: Date) => {
    let warningTemp = warning;
    warningTemp.date = false;
    setWarning(warningTemp);
    setActivityDate(date);
    setDateActionSheetVisibility(false);

    // if (
    //   date.getFullYear() > new Date().getFullYear() ||
    //   (date.getFullYear() == new Date().getFullYear() &&
    //     date.getMonth() > new Date().getMonth()) ||
    //   (date.getFullYear() == new Date().getFullYear() &&
    //     date.getMonth() == new Date().getMonth() &&
    //     date.getDate() >= new Date().getDate())
    // ) {
    //   setActivityDate(date);
    //   setActivityStartTime(null);
    //   setWarningDate(0);
    //   setWarningTime(0);

    //   console.warn('dışarda tarih');
    // } else {
    setActivityStartTime(null);
    setWarningDate(1);
    console.warn('dışarda', activityDate);
    // }
  };

  const showDateText = (activityDate: Date) => {
    let result = 'Seçiniz';

    if (
      activityDate != null &&
      (activityDate.getFullYear() > new Date().getFullYear() ||
        (activityDate.getFullYear() == new Date().getFullYear() &&
          activityDate.getMonth() > new Date().getMonth()) ||
        (activityDate.getFullYear() == new Date().getFullYear() &&
          activityDate.getMonth() == new Date().getMonth() &&
          activityDate.getDate() >= new Date().getDate()))
    ) {
      if (activityDate.getDate() < 10) {
        result = '0' + activityDate.getDate().toString();
      } else {
        result = activityDate.getDate().toString();
      }
      if (activityDate.getMonth() + 2 < 10) {
        result += '.0' + (activityDate.getMonth() + 1).toString();
      } else {
        result += '.' + (activityDate.getMonth() + 1).toString();
      }
      result += '.' + activityDate.getFullYear().toString();
    } else {
      result = 'Seçiniz';
    }
    return result;
  };

  const handleStartTimeConfirm = (date: Date) => {
    console.log('activityDate', date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
    console.log('today', new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes());
    // if (date.getTime() < new Date().getTime() + 7200000) {
    //   Alert.alert(
    //     'Warning',
    //     'You have to select the time at least 2 hours before'
    //   );
    // }
    // else if (activityFinishTime != undefined && date.getTime() > activityFinishTime.getTime()) {
    //   Alert.alert(
    //     'Warning',
    //     'Thw start time must not be after the finish'
    //   );
    // }
    // else {
    //   // if (activityStartTime) {
    //   let warningTemp = warning;
    //   warningTemp.startTime = false;
    //   setWarning(warningTemp);
    //   setActivityStartTime(date);
    //   setWarningTime(0);
    // }

    setStartTimeActionSheetVisibility(false);
    // }

      console.log('1', date.getHours() * 60 + date.getMinutes())
      console.log('2',  new Date().getHours() * 60 + new Date().getMinutes())
    if (
      activityDate != undefined &&
      activityDate.getFullYear() === new Date().getFullYear() &&
      activityDate.getMonth() === new Date().getMonth() &&
      activityDate.getDate() === new Date().getDate() &&
      date.getHours() * 60 + date.getMinutes() >=
        (new Date().getHours()+ 2) * 60 + new Date().getMinutes()
    ) {
      setActivityStartTime(date);
      let warningTemp = warning;
      warningTemp.startTime = false;
      setWarning(warningTemp);
      // console.warn('En az 2 saat olmalı');
      console.log('BURDA 1')
    } 
    else if (
      activityDate != undefined && activityDate.getFullYear() === new Date().getFullYear() &&
      activityDate.getMonth() === new Date().getMonth() &&
      activityDate.getDate() > new Date().getDate()
    ) {
      setActivityStartTime(date);
      let warningTemp = warning;
      warningTemp.startTime = false;
      setWarning(warningTemp);
      console.log('BURDA 2')
    }
    else {
      console.log('BURDA 3')
      Alert.alert(
        'Warning',
        'You have to select the time at least 2 hours before'
      );
    }
  };

  const handleFinishTimeConfirm = (date: Date, activityDate: Date) => {
    console.log('date', date.getTime());
    if (date.getTime() < new Date().getTime() + 7200000) {
      Alert.alert(
        'Warning',
        'You have to select the time at least 2 hours before'
      );
    } else if (
      activityStartTime != undefined &&
      date.getTime() < activityStartTime.getTime()
    ) {
      Alert.alert('Warning', 'The finish time must not be before the start');
    } else {
      let warningTemp = warning;
      warningTemp.finishTime = false;
      setWarning(warningTemp);
      setActivityFinishTime(date);
      setWarningTime(0);
    }

    setFinishTimeActionSheetVisibility(false);
    // if (
    //   activityDate != null &&
    //   activityDate.getFullYear() === new Date().getFullYear() &&
    //   activityDate.getMonth() === new Date().getMonth() &&
    //   activityDate.getDate() === new Date().getDate() &&
    //   date.getHours() * 60 + date.getMinutes() <=
    //     (new Date().getHours() + 2) * 60 + new Date().getMinutes()
    // ) {
    //   setActivityFinishTime(null);
    //   setWarningTime(1);
    //   // console.warn('En az 2 saat olmalı');
    // } else {
    // console.warn('saat');
    // }
  };

  const showTimeText = (activityDate: Date, activityTime: Date) => {
    let result = 'Seçiniz';

    if (
      activityDate != undefined &&
      activityTime != undefined &&
      new Date().getFullYear() === activityDate.getFullYear() &&
      new Date().getMonth() === activityDate.getMonth() &&
      new Date().getDate() === activityDate.getDate() &&
      activityTime.getHours() * 60 + activityTime.getMinutes() <=
        (new Date().getHours() + 2) * 60 + new Date().getMinutes()
    ) {
      result = 'Seçiniz';
    }
    // else if (activityDate != null && activityTime != null && (new Date().getFullYear() !== activityDate.getFullYear()
    //     || new Date().getMonth() !== activityDate.getMonth()
    //     || new Date().getDate() !== activityDate.getDate())) {
    //     result = activityTime.getHours().toString() + ':' + activityTime.getMinutes().toString();
    // }
    else if (activityTime != undefined) {
      console.log('İçerde')
      if (activityTime.getHours() < 10) {
        result = '0' + activityTime.getHours().toString();
      } else {
        result = activityTime.getHours().toString();
      }

      if (activityTime.getMinutes() < 10) {
        result += ':0' + activityTime.getMinutes().toString();
      } else {
        result += ':' + activityTime.getMinutes().toString();
      }
    } else {
      result = 'Seçiniz';
    }
    return result;
  };

  // const addLocation = () => {
  //   if (locations.length === MAX_LOCATION_COUNT) {
  //     return;
  //   }

  //   const newId = locations[locations.length - 1].id + 1;
  //   const updatedLocations = [...locations, { id: newId, location: '' }];
  //   setLocations(updatedLocations);
  // };

  // const removeLocation = (id: number) => {
  //   const updatedLocations = locations.filter((location) => location.id !== id);
  //   setLocations(updatedLocations);
  // };

  // const updateLocation = (id: number, location: string) => {
  //   const indexOldElement = locations.findIndex(
  //     (location) => location.id == id
  //   );
  //   const updatedLocations = Object.assign([...locations], {
  //     [indexOldElement]: { id, location },
  //   });

  //   setLocations(updatedLocations);
  // };

  const openLocationModal = () => {
    RNGooglePlaces.openAutocompleteModal()
      .then((place) => {
        console.log('place', place);
        let warningTemp = warning;
        if (place == null) {
          warningTemp.location = true;
        } else {
          warningTemp.location = false;
        }
        setWarning(warningTemp);
        // updateLocation(id, place);
        setLocations(place);
      })
      .catch((error) => console.log(error.message)); // error is a Javascript Error object
  };

  return (
    <MenuProvider>
      <View style={styles.container}>
        <View style={styles.firstRow}>
          <ActivityTypeSelector>
            {activityTypes.map((activityType: IActivityType) => (
              <ActivityTypeSelector.IconItem
                key={activityType.id}
                id={activityType.id}
                icon={activityType.image}
                text={polyglot.t(activityType.textKey)}
                onItemPress={() => {
                  setSelectedActivityNameValue(null);
                  setBranchName(activityType.image);
                }}
              />
            ))}
          </ActivityTypeSelector>

          <View style={styles.row}>
            <View style={styles.column}>
              <Selector
                warning={warning.activityName}
                onPress={() => {
                  branchName != ''
                    ? activityNameActionSheetRef.current?.open()
                    : Alert.alert(
                        'Warning',
                        'You have to select a branch firstly'
                      );
                }}
                label={`${polyglot.t(
                  'screens.create_activity.inputs.activity_name.label'
                )}*`}
                text={(() => {
                  const selectedActivityName = getSelectedActivityName(
                    selectedActivityNameValue,
                    branchName
                  );
                  if (!selectedActivityName) {
                    return undefined;
                  }
                  return polyglot.t(selectedActivityName.text);
                })()}
              />
            </View>
          </View>
          <ScrollView>
            <View style={styles.locationLabel}>
              <Text style={styles.label}>
                {`${polyglot.t(
                  'screens.create_activity.inputs.location.label'
                )}*`}
              </Text>

              <View style={styles.locationAddMore}>
                <Text style={styles.locationAddMoreLabel}>
                  {polyglot.t(
                    'screens.create_activity.inputs.location.add_more'
                  )}
                </Text>
                <TouchableOpacity
                // onPress={addLocation}
                >
                  <View style={styles.locationIconWrapper}>
                    <Ionicons
                      size={15}
                      name="add-outline"
                      color={colors.white}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.locationWrapper}>
              <View style={[styles.row, styles.rowLocation]}>
                <View style={styles.column}>
                  <Selector
                    warning={warning.location}
                    onPress={() => openLocationModal()}
                    text={locations != null && locations.name}
                  />
                </View>

                {/* {props.showRemove && (
                  <TouchableOpacity
                    onPress={() => props.onLocationRemove(props.location.id)}
                  >
                    <View
                      style={[
                        styles.locationIconWrapper,
                        styles.locationIconRemove,
                      ]}
                    >
                      <Ionicons size={15} name="remove" color={colors.white} />
                    </View>
                  </TouchableOpacity>
                )} */}
              </View>
            </View>
          </ScrollView>
          <View style={styles.row}>
            <View style={styles.column}>
              <Selector
                warning={warning.date}
                labelPosition="center"
                onPress={() => setDateActionSheetVisibility(true)}
                label={`${polyglot.t(
                  'screens.create_activity.inputs.date.label'
                )}*`}
                text={(() => {
                  return showDateText(activityDate);
                })()}
              />
            </View>
            <View style={styles.timesWrapper}>
              <Text style={styles.label}>
                {`${polyglot.t('screens.create_activity.inputs.time.label')}*`}
              </Text>
              <View style={styles.times}>
                <View style={styles.time}>
                  <Selector
                    warning={warning.startTime}
                    noIcon
                    placeholder={polyglot.t(
                      'screens.create_activity.inputs.time.placeholder_start'
                    )}
                    onPress={() => setStartTimeActionSheetVisibility(true)}
                    text={(() => {
                      return showTimeText(activityDate, activityStartTime);
                    })()}
                  />
                </View>
                <Text>-</Text>
                <View style={styles.time}>
                  <Selector
                    warning={warning.finishTime}
                    noIcon
                    placeholder={polyglot.t(
                      'screens.create_activity.inputs.time.placeholder_finish'
                    )}
                    onPress={() => setFinishTimeActionSheetVisibility(true)}
                    text={(() => {
                      return showTimeText(activityDate, activityFinishTime);
                    })()}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Selector
                labelPosition="center"
                onPress={() => genderActionSheetRef.current?.open()}
                label={polyglot.t(
                  'screens.create_activity.inputs.gender.label'
                )}
                text={(() => {
                  const selectedGender = getSelectedGender(selectedGenderValue);
                  if (!selectedGender) {
                    return undefined;
                  }
                  return polyglot.t(selectedGender.text);
                })()}
              />
            </View>

            <View style={styles.column}>
              <Selector
                labelPosition="center"
                onPress={() => ageRangeActionSheetRef.current?.open()}
                label={polyglot.t('screens.create_activity.inputs.age.label')}
                text={
                  !!selectedAgeRange[0] && !!selectedAgeRange[1]
                    ? `${selectedAgeRange[0]} - ${selectedAgeRange[1]}`
                    : undefined
                }
              />
            </View>

            <View style={styles.column}>
              <Selector
                labelPosition="center"
                onPress={() => quotaActionSheetRef.current?.open()}
                label={polyglot.t('screens.create_activity.inputs.quota.label')}
                text={
                  !!selectedQuotaRange[0] && !!selectedQuotaRange[1]
                    ? `${selectedQuotaRange[0]} - ${selectedQuotaRange[1]}`
                    : undefined
                }
              />
            </View>
          </View>
        </View>
        <View style={styles.secondRow}>
          <CustomButton onPress={() => save()} title="Create Activity" />
        </View>

        <DateTimePickerModal
          isVisible={isDateActionSheetVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={() => setDateActionSheetVisibility(false)}
        />

        <DateTimePickerModal
          isVisible={isStartTimeActionSheetVisible}
          mode="time"
          onConfirm={handleStartTimeConfirm}
          onCancel={() => setStartTimeActionSheetVisibility(false)}
        />

        <DateTimePickerModal
          isVisible={isFinishTimeActionSheetVisible}
          mode="time"
          onConfirm={handleFinishTimeConfirm}
          onCancel={() => setFinishTimeActionSheetVisibility(false)}
        />

        <ActivityNameActionSheet
          branchName={branchName}
          ref={activityNameActionSheetRef}
          onSelect={(activityNameValue: number) => {
            if (activityNameValue % 6 === 0) {
              warning.activityName = true;
            } else {
              warning.activityName = false;
            }
            setWarning(warning);
            setSelectedActivityNameValue(activityNameValue);
            activityNameActionSheetRef.current?.close();
          }}
          onCancel={() => {
            activityNameActionSheetRef.current?.close();
          }}
        />
        <AgeRangeActionSheet
          ref={ageRangeActionSheetRef}
          onSelect={([min, max]: [number, number]) => {
            // TODO: Validate selected age values
            setSelectedAgeRange([min, max]);
            ageRangeActionSheetRef.current?.close();
          }}
          onCancel={() => {
            ageRangeActionSheetRef.current?.close();
          }}
        />
        <QuotaActionSheet
          ref={quotaActionSheetRef}
          onSelect={([min, max]: [number, number]) => {
            // TODO: Validate selected quota values
            setSelectedQuotaRange([min, max]);
            quotaActionSheetRef.current?.close();
          }}
          onCancel={() => {
            quotaActionSheetRef.current?.close();
          }}
        />
        <GenderActionSheet
          ref={genderActionSheetRef}
          onSelect={(genderValue: number) => {
            setSelectedGenderValue(genderValue);
            genderActionSheetRef.current?.close();
          }}
          onCancel={() => {
            genderActionSheetRef.current?.close();
          }}
        />
      </View>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    paddingEnd: 5,
    marginBottom: 20,
  },
  column: {
    flex: 1,
    paddingHorizontal: 5,
  },
  rowLocation: {
    marginBottom: 10,
  },
  locationWrapper: {
    marginBottom: 10,
  },
  locationLabel: {
    paddingHorizontal: 10,
    paddingBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationAddMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationAddMoreLabel: {
    marginRight: 10,
    color: colors.brownGrey,
  },
  locationIconWrapper: {
    borderRadius: 40,
    backgroundColor: colors.casper,
    paddingLeft: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIconRemove: {
    marginRight: 5,
  },
  timesWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    fontWeight: '500',
    fontSize: 16,
    color: colors.mortar,
    paddingBottom: 2,
  },
  times: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    width: 100,
    paddingHorizontal: 5,
  },
  firstRow: {
    flex: 10,
  },
  secondRow: {
    flex: 2,
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
});

export default CreateActivityScreen2;
