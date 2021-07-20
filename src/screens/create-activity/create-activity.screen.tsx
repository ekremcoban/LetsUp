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
import { v4 as uuidv4 } from 'uuid';
import { colors } from 'styles/colors';
import { useNavigation } from '@react-navigation/native';
import { getData } from 'db/localDb';
import { convertLowerString } from 'components/functions/common';

const activityNameActionSheetRef = createRef<IActionSheet>();
const ageRangeActionSheetRef = createRef<IActionSheet>();
const quotaActionSheetRef = createRef<IActionSheet>();
const genderActionSheetRef = createRef<IActionSheet>();

const CreateActivityScreen2 = () => {
  const navigation = useNavigation();
  const [branchName, setBranchName] = useState<string>(String || undefined);

  const [location0, setLocation0] = useState(null);
  const [location1, setLocation1] = useState(null);
  const [location2, setLocation2] = useState(null);
  const [location3, setLocation3] = useState(null);
  const [location4, setLocation4] = useState(null);
  const [showLocation1, setShowLocation1] = useState(null);
  const [showLocation2, setShowLocation2] = useState(null);
  const [showLocation3, setShowLocation3] = useState(null);
  const [showLocation4, setShowLocation4] = useState(null);
  const [numberShowLocation, setNumberShowLocation] = useState(1);

  const [activityDate, setActivityDate] = useState<Date>(new Date());
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
    location0: false,
    location1: false,
    location2: false,
    location3: false,
    location4: false,
    date: false,
    startTime: false,
    finishTime: false,
  });

  const convertLocation = (
    location: any,
    activityId: string,
    nodeNumber: number
  ) => {
    let isState = false;
    let country = null;
    let city = null;
    let district = null;

    for (let i = location.addressComponents.length - 1; 0 <= i; i--) {
      if (location.addressComponents[i].types[0] === 'country') {
        country = location.addressComponents[i].name;
      }
      // Eyalet sistemi var mı bilgisi icin
      else if (location.addressComponents[i].types[0] === 'locality') {
        isState = true;
      }
    }

    for (let i = 0; i < location.addressComponents.length; i++) {
      // Eyalet sistemi varsa sehir bilgisi
      if (isState) {
        if (location.addressComponents[i].types[0] === 'locality') {
          city = location.addressComponents[i].name;
        } else if (
          location.addressComponents[i].types[0] === 'sublocality_level_1'
        ) {
          district = location.addressComponents[i].name;
        }
      } else {
        if (
          location.addressComponents[i].types[0] ===
          'administrative_area_level_1'
        ) {
          city = location.addressComponents[i].name;
        } else if (
          location.addressComponents[i].types[0] ===
          'administrative_area_level_2'
        ) {
          district = location.addressComponents[i].name;
        }
      }
    }

    const activityAddress = {
      id: uuidv4(),
      activityId: activityId,
      country: country,
      city: city,
      cityEng: convertLowerString(city),
      district: district,
      districtEng: convertLowerString(district),
      geoCode: location.location,
      details: null,
      fullAddress: location.address,
      nodeNumber: nodeNumber,
      nodeCount: numberShowLocation,
      createdTime: new Date().getTime(),
    };
    return activityAddress;
  };

  const convertAndSendAddressToServer = (parentId: string) => {
    if (location0 != null) {
      const post = convertLocation(location0, parentId, 1);
      fireStoreFunction('ActivityAddress', post.id, post);
      console.log('1 kayıt', post);
    }
    if (location1 != null) {
      const post = convertLocation(location1, parentId, 2);
      fireStoreFunction('ActivityAddress', post.id, post);
      console.log('2 kayıt', post);
    }
    if (location2 != null) {
      const post = convertLocation(location2, parentId, 3);
      fireStoreFunction('ActivityAddress', post.id, post);
      console.log('3 kayıt', post);
    }
    if (location3 != null) {
      const post = convertLocation(location3, parentId, 4);
      fireStoreFunction('ActivityAddress', post.id, post);
      console.log('4 kayıt', post);
    }
    if (location4 != null) {
      const post = convertLocation(location4, parentId, 5);
      fireStoreFunction('ActivityAddress', post.id, post);
      console.log('5 kayıt', post);
    }
  };

  const fireStoreFunction = (title: string, id: string, data: Object) => {
    firestore()
      .collection(title)
      .doc(id)
      .set(data)
      .then(() => {
        console.log('Adress insert!');
      })
      .catch((e) => {
        console.log('insert Adress', e);
      });
  };

  const save = async () => {
    let warningTemp = {
      activityName: false,
      location0: false,
      location1: false,
      location2: false,
      location3: false,
      location4: false,
      date: false,
      startTime: false,
      finishTime: false,
    };

    let startActivityTime = null;
    let finishActivityTime = null;

    if (selectedActivityNameValue == null || selectedActivityNameValue === 0) {
      warningTemp.activityName = true;
    }

    console.log('location0', location0);
    if (location0 == null) {
      warningTemp.location0 = true;
      console.log('BİR');
    }

    if (location1 == null && showLocation1) {
      warningTemp.location1 = true;
      console.log('İKİ');
    }

    if (location2 == null && showLocation2) {
      warningTemp.location2 = true;
      console.log('ÜÇ');
    }

    if (location3 == null && showLocation3) {
      warningTemp.location3 = true;
      console.log('DÖRT');
    }

    if (location4 == null && showLocation4) {
      warningTemp.location4 = true;
      console.log('BEŞ');
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
      !warningTemp.location0 &&
      !warningTemp.location1 &&
      !warningTemp.location2 &&
      !warningTemp.location3 &&
      !warningTemp.location4 &&
      !warningTemp.date &&
      !warningTemp.startTime &&
      !warningTemp.finishTime
    ) {
      getData('Users').then((user) => {
        console.log(user);
        const activityId = uuidv4();
        const activity = {
          id: activityId,
          type: branchName,
          name: polyglot.t(
            activityNames.filter(
              (a) => a.value === selectedActivityNameValue
            )[0].text
          ),
          ownerId: user.id,
          date: activityDate.getTime(),
          startTime: activityStartTime != null && startActivityTime.getTime(),
          finishTime:
            activityFinishTime != null && finishActivityTime.getTime(),
          gender:
            selectedGenderValue === 2
              ? 'Man'
              : selectedGenderValue === 2
              ? 'Woman'
              : null,
          minAge: selectedAgeRange[0],
          maxAge: selectedAgeRange[1],
          minQuota: selectedQuotaRange[0],
          maxQuota: selectedQuotaRange[1],
          createdTime: new Date().getTime(),
        };
        console.log('activity', activity);

        // Activity bilgisini sunucuya yazar
        fireStoreFunction('Activities', activity.id, activity);
        convertAndSendAddressToServer(activityId);
      });
    } else {
      console.error('GİRİŞ YAPILAMADI', numberShowLocation);
    }

    setWarning(warningTemp);
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
    setActivityStartTime(undefined);
    setActivityFinishTime(undefined);
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
    setStartTimeActionSheetVisibility(false);
    let warningTemp = warning;
    warningTemp.startTime = false;
    setWarning(warningTemp);
    // console.log('1', date.getHours() * 60 + date.getMinutes());
    // console.log('2', new Date().getHours() * 60 + new Date().getMinutes());
    if (
      activityDate != undefined &&
      activityDate.getFullYear() === new Date().getFullYear() &&
      activityDate.getMonth() === new Date().getMonth() &&
      activityDate.getDate() === new Date().getDate() &&
      date.getHours() * 60 + date.getMinutes() >=
        (new Date().getHours() + 2) * 60 + new Date().getMinutes()
    ) {
      setActivityStartTime(date);
      // console.warn('En az 2 saat olmalı');
      console.log('BURDA 1', warningTemp);
    } else if (
      activityDate != undefined &&
      activityDate.getFullYear() === new Date().getFullYear() &&
      activityDate.getMonth() === new Date().getMonth() &&
      activityDate.getDate() > new Date().getDate()
    ) {
      setActivityStartTime(date);
      let warningTemp = warning;
      warningTemp.startTime = false;
      setWarning(warningTemp);
      console.log('BURDA 2');
    } else {
      console.log('BURDA 3');
      const selectedHour =
        date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      const selectedMinute =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      const minHour =
        new Date().getHours() + 2 < 10
          ? '0' + (new Date().getHours() + 2)
          : new Date().getHours() + 2;
      const minMinute =
        new Date().getMinutes() < 10
          ? '0' + new Date().getMinutes()
          : new Date().getMinutes();
      Alert.alert(
        'Warning',
        `You selected: ${selectedHour}:${selectedMinute}\nThe time must be minimum: ${minHour}:${minMinute}\n\nNote: You must select the time at least 2 hours before. `
      );
    }
  };

  const handleFinishTimeConfirm = (date: Date) => {
    setFinishTimeActionSheetVisibility(false);
    let warningTemp = warning;
    warningTemp.finishTime = false;
    setWarning(warningTemp);

    console.log('1', date.getHours() * 60 + date.getMinutes());
    console.log('2', new Date().getHours() * 60 + new Date().getMinutes());
    console.log('activityFinishTime', activityStartTime);
    if (
      activityDate != undefined &&
      activityStartTime != undefined &&
      activityDate.getFullYear() === new Date().getFullYear() &&
      activityDate.getMonth() === new Date().getMonth() &&
      activityDate.getDate() === new Date().getDate() &&
      date.getHours() * 60 + date.getMinutes() >=
        (activityStartTime.getHours() + 1) * 60 + activityStartTime.getMinutes()
    ) {
      setActivityFinishTime(date);
      // console.warn('En az 2 saat olmalı');
      console.log('BURDA 1');
    } else if (
      activityDate != undefined &&
      activityStartTime != undefined &&
      activityDate.getFullYear() === activityStartTime.getFullYear() &&
      activityDate.getMonth() === activityStartTime.getMonth() &&
      activityDate.getDate() > activityStartTime.getDate() &&
      date.getHours() * 60 + date.getMinutes() >=
        (activityStartTime.getHours() + 1) * 60 + activityStartTime.getMinutes()
    ) {
      setActivityFinishTime(date);
      let warningTemp = warning;
      warningTemp.finishTime = false;
      setWarning(warningTemp);
      console.log('BURDA 2');
    } else if (activityStartTime != undefined) {
      console.log('BURDA 3');
      const selectedHour =
        date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      const selectedMinute =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      const minHour =
        activityStartTime.getHours() + 1 < 10
          ? '0' + (activityStartTime.getHours() + 1)
          : activityStartTime.getHours() + 1;
      const minMinute =
        activityStartTime.getMinutes() < 10
          ? '0' + activityStartTime.getMinutes()
          : activityStartTime.getMinutes();
      Alert.alert(
        'Warning',
        `You selected: ${selectedHour}:${selectedMinute}\nThe time must be minimum: ${minHour}:${minMinute}\n\nNote: You must select the time at least 1 hour. `
      );
    } else if (activityStartTime == undefined) {
      Alert.alert('Warning', `You must select start time firstly`);
    } else {
      console.log('burda 4');
    }
  };

  const showTimeText = (activityDate: Date, activityTime: Date) => {
    let result = 'Seçiniz';

    if (
      activityDate != undefined &&
      activityTime != undefined &&
      new Date().getFullYear() === activityDate.getFullYear() &&
      new Date().getMonth() === activityDate.getMonth() &&
      new Date().getDate() === activityDate.getDate() &&
      activityTime.getHours() * 60 + activityTime.getMinutes() <
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

  const addLocation = async () => {
    if (numberShowLocation > 0) {
      setShowLocation1(true);
    }
    if (numberShowLocation > 1) {
      setShowLocation2(true);
    }
    if (numberShowLocation > 2) {
      setShowLocation3(true);
    }
    if (numberShowLocation > 3) {
      setShowLocation4(true);
    }

    if (numberShowLocation < 5) {
      let t = numberShowLocation + 1;
      await setNumberShowLocation(t);
      console.log('add', numberShowLocation);
    }
  };

  const removeLocation = async (index: number) => {
    let t = numberShowLocation - 1;
    await setNumberShowLocation(t);
    console.log('----', t);
    if (index === 1) {
      setLocation1(null);
      setShowLocation1(false);
    } else if (index === 2) {
      setLocation2(null);
      setShowLocation2(false);
    } else if (index === 3) {
      setLocation3(null);
      setShowLocation3(false);
    } else if (index === 4) {
      setLocation4(null);
      setShowLocation4(false);
    }

    console.log('numberShowLocation', numberShowLocation);
  };

  const openLocationModal = (itemNo: number) => {
    console.log('itemNo', itemNo);
    RNGooglePlaces.openAutocompleteModal()
      .then((place) => {
        console.log('place', place);

        if (itemNo === 0) {
          setLocation0(place);
        } else if (itemNo === 1) {
          setLocation1(place);
        } else if (itemNo === 2) {
          setLocation2(place);
        } else if (itemNo === 3) {
          setLocation3(place);
        } else if (itemNo === 4) {
          setLocation4(place);
        }
      })
      .catch((error) => console.log(error.message)); // error is a Javascript Error object
  };

  const openLocation = async (index: number) => {
    const warningTemp = warning;

    if (index === 0) {
      warningTemp.location0 = false;
    } else if (index === 1) {
      warningTemp.location1 = false;
    } else if (index === 2) {
      warningTemp.location2 = false;
    } else if (index === 3) {
      warningTemp.location3 = false;
    } else if (index === 4) {
      warningTemp.location4 = false;
    }

    await setWarning(warningTemp);
    openLocationModal(index);
  };

  const locationArea0 = (
    <View style={[styles.row, styles.rowLocation]}>
      {(branchName === 'jogging' ||
        branchName === 'bicycle' ||
        branchName === 'hiking') && (
        <View style={styles.locationTitle}>
          <Text>START</Text>
        </View>
      )}
      <View style={styles.column}>
        <Selector
          warning={warning.location0}
          onPress={() => openLocation(0)}
          text={location0 != null && location0.name}
        />
      </View>
    </View>
  );

  const locationArea1 = (
    <View style={[styles.row, styles.rowLocation]}>
      <View style={styles.locationTitle}>
        {numberShowLocation === 2 && !showLocation3 && !showLocation4 ? (
          <Text>FINISH 1</Text>
        ) : (
          <Text>DEST 1</Text>
        )}
      </View>
      <View style={styles.column}>
        <Selector
          warning={warning.location1}
          onPress={() => openLocation(1)}
          text={location1 != null && location1.name}
        />
      </View>
      {(numberShowLocation !== 2 || showLocation4) && (
        <Ionicons
          size={20}
          name="remove-circle-outline"
          onPress={() => removeLocation(1)}
          color={colors.darkRed}
        />
      )}
    </View>
  );

  const locationArea2 = (
    <View style={[styles.row, styles.rowLocation]}>
      <View style={styles.locationTitle}>
        {(numberShowLocation === 3 || numberShowLocation === 2) &&
        !showLocation3 &&
        !showLocation4 ? (
          <Text>FINISH 2</Text>
        ) : (
          <Text>DEST 2</Text>
        )}
      </View>
      <View style={styles.column}>
        <Selector
          warning={warning.location2}
          onPress={() => openLocation(2)}
          text={location2 != null && location2.name}
        />
      </View>
      {(numberShowLocation !== 2 || numberShowLocation !== 3) &&
        (showLocation3 || showLocation4) && (
          <Ionicons
            size={20}
            name="remove-circle-outline"
            onPress={() => removeLocation(2)}
            color={colors.darkRed}
          />
        )}
    </View>
  );

  const locationArea3 = (
    <View style={[styles.row, styles.rowLocation]}>
      <View style={styles.locationTitle}>
        {(numberShowLocation === 4 ||
          numberShowLocation === 3 ||
          numberShowLocation === 2) &&
        !showLocation4 ? (
          <Text>FINISH 3</Text>
        ) : (
          <Text>DEST 3</Text>
        )}
      </View>
      <View style={styles.column}>
        <Selector
          warning={warning.location3}
          onPress={() => openLocation(3)}
          text={location3 != null && location3.name}
        />
      </View>
      {(numberShowLocation !== 2 ||
        numberShowLocation !== 3 ||
        numberShowLocation !== 4) &&
        showLocation4 && (
          <Ionicons
            size={20}
            name="remove-circle-outline"
            onPress={() => removeLocation(3)}
            color={colors.darkRed}
          />
        )}
    </View>
  );

  const locationArea4 = (
    <View style={[styles.row, styles.rowLocation]}>
      <View style={styles.locationTitle}>
        <Text>FINISH 4</Text>
      </View>
      <View style={styles.column}>
        <Selector
          warning={warning.location4}
          onPress={() => openLocation(4)}
          text={location4 != null && location4.name}
        />
      </View>
    </View>
  );

  const addMoreButton = (
    <View style={styles.locationAddMore}>
      <Text style={styles.locationAddMoreLabel}>
        {polyglot.t('screens.create_activity.inputs.location.add_more')}
      </Text>
      <TouchableOpacity onPress={addLocation}>
        <View style={styles.locationIconWrapper}>
          <Ionicons size={15} name="add-outline" color={colors.white} />
        </View>
      </TouchableOpacity>
    </View>
  );

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
                  setNumberShowLocation(2);
                  if (
                    activityType.image !== 'jogging' &&
                    activityType.image !== 'bicycle' &&
                    activityType.image !== 'hiking'
                  ) {
                    setShowLocation1(false);
                    setShowLocation2(false);
                    setShowLocation3(false);
                    setShowLocation4(false);
                    setLocation1(null);
                    setLocation2(null);
                    setLocation3(null);
                    setLocation4(null);
                    setNumberShowLocation(2);
                  } else {
                    setShowLocation1(true);
                  }
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
                        'You must select a branch firstly'
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
              {(branchName === 'jogging' ||
                branchName === 'bicycle' ||
                branchName === 'hiking') &&
                addMoreButton}
            </View>
            <View style={styles.locationWrapper}>
              {locationArea0}
              {showLocation1 && locationArea1}
              {showLocation2 && locationArea2}
              {showLocation3 && locationArea3}
              {showLocation4 && locationArea4}
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
  locationTitle: {
    paddingStart: 10,
    width: 70,
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
