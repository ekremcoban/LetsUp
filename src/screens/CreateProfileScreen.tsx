import React, { useContext, useState, createRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Selector } from 'components/selector/selector';
import { IActionSheet } from '../components/action-sheet/action-sheet';
import { getSelectedGender } from 'models/genders';
import { GenderActionSheet } from './create-activity/action-sheets/gender.action-sheet';
import { AgeActionSheet } from './create-activity/action-sheets/age.action-sheet';
import { HeightActionSheet } from './create-activity/action-sheets/height.action-sheet';
import { WeightActionSheet } from './create-activity/action-sheets/weight.action-sheet';
import firestore from '@react-native-firebase/firestore';
import { useEffect } from 'react';
import { getData, storeData } from 'db/localDb';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePickerCropper from 'react-native-image-crop-picker';
import DisplaySpinner from '../components/spinner';
import storage from '@react-native-firebase/storage';
import ContextApi from 'context/ContextApi';
import { useNavigation, useRoute } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { convertLowerString } from 'components/functions/common';

Geocoder.init('AIzaSyAokz8FcAIgsV0JbJZijJ5ypH-2bvQgC0U');

const genderActionSheetRef = createRef<IActionSheet>();
const ageActionSheetRef = createRef<IActionSheet>();
const heightActionSheetRef = createRef<IActionSheet>();
const weightActionSheetRef = createRef<IActionSheet>();

const CreateProfilScreen = () => {
  const { user, setUser, location, setUserPhoto } = useContext(ContextApi);
  const [photo, setPhoto] = useState(null);
  const [fullName, onChangeFullName] = useState('');
  const [selectedGenderValue, setSelectedGenderValue] = useState<string | null>(
    null
  );
  const [selectedAge, setSelectedAge] = useState<number>();
  const [selectedHeight, setSelectedHeight] = useState<
    [number | null, number | null]
  >([null, null]);
  const [selectedWeight, setSelectedWeight] = useState<
    [number | null, number | null]
  >([null, null]);
  const [branchNo, setBranchNo] = useState<number | null>(null);
  const [uploadUri, setUploadUri] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [spinner, setSpinner] = useState<boolean>(true);
  const [warning, setWarning] = useState<number>(0);
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState(null);
  const [district, setDistrict] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { from } = route.params;

  useEffect(() => {
    // if (from !== 'Profile Info') {
    //   getCurrentUser();
    // }

    console.log('Girdi', location);

    // Kullanici resim eklemediyse
    if (user == null) {
      getData('Users').then((user) => {
        if (user.surname != null) {
          onChangeFullName(user.name + ' ' + user.surname);
        } else {
          onChangeFullName(user.name);
        }

        setUser(user);
        user.age != null && setSelectedAge(user.age);
        user.gender != null &&
          setSelectedGenderValue(
            user.gender === 'Male' ? 2 : user.gender === 'Female' ? 1 : 0
          );
        user.height != null && setSelectedHeight(user.height);
        user.weight != null && setSelectedWeight(user.weight);
        if (user.photo == null) {
          // Kullanici resim eklediyse
          getData('Photo').then((res) => {
            if (res == null) {
              console.log('Burda 2', res);
              getImage();
            } else {
              console.log('Burda 3');
              setPhoto(res);
            }
          });
        } else {
          console.log('girmedi', photo);
          setPhoto(user.photo);
        }
        setSpinner(false);
        // getImage(user.email, user.photo);
      });
    } else {
      if (user.surname != null) {
        onChangeFullName(user.name + ' ' + user.surname);
      } else {
        onChangeFullName(user.name);
      }
      setPhoto(user.photo);
      user.age != null && setSelectedAge(user.age);
      user.gender != null &&
        setSelectedGenderValue(
          user.gender === 'Male' ? 2 : user.gender === 'Female' ? 1 : 0
        );
      user.height != null && setSelectedHeight(user.height);
      user.weight != null && setSelectedWeight(user.weight);
      storeData('Users', user);
      setSpinner(false);
      // getImage(user.email, user.photo);
    }
  }, []);

  const updateLocation = () => {

    let country: any = null;
    let city: any = null;
    let district: any = null;
    let latitude: any = null;
    let longitude: any = null;

    Geolocation.getCurrentPosition((info) => {
      latitude = info.coords.latitude;
      longitude = info.coords.longitude;

      setSpinner(true);
     
      Geocoder.from(info.coords.latitude, info.coords.longitude)
        .then((place) => {
          // var basic = json.results[json.results.length - 1].address_components;
          console.log('-----location', place);

          let indexAddress = place.results.length - 1;
          let findCOuntry = false;

          // Ulkeye gore filtrelemek icin once ulke bulunur
          while (0 <= indexAddress && !findCOuntry) {
            if (
              place.results[indexAddress].types[0] === 'country'
            ) {
              findCOuntry = true;
              country = place.results[indexAddress].address_components[0].long_name;
            }
            indexAddress--;
          }

          indexAddress = place.results.length - 1;

          switch (country) {
            case 'Turkey':
              case 'Turkiye':
              for (let i = 0; i <= indexAddress; i++) {
                if (
                  place.results[i].types[0] ===
                  'administrative_area_level_1'
                ) {
                  city = place.results[i].address_components[0].long_name;
                } else if (
                  place.results[i].types[0] ===
                  'administrative_area_level_2'
                ) {
                  district = place.results[i].address_components[0].long_name;
                }
              }
              break;
      
            default:
              for (let i = 0; i <= indexAddress; i++) {
                if (
                  place.results[i].types[0] ===
                  'administrative_area_level_1'
                ) {
                  city = place.results[i].address_components[0].long_name;
                } else if (
                  place.results[i].types[0] ===
                  'administrative_area_level_2'
                ) {
                  district = place.results[i].address_components[0].long_name;
                }
              }
              break;
          }
          
          console.log('country', country)
          console.log('city', city)
          console.log('district', district)
          // const city = 'Ekrem'; //basic[basic.length - 2].long_name;
          // const latitude = info.coords.latitude;
          // const longitude = info.coords.longitude;

          setCity(city);
          setCountry(country);
          setDistrict(district);
          setLatitude(latitude);
          setLongitude(longitude);
          setSpinner(false);

        })
        .catch((error) => console.warn(error));

      console.log('loc', info);
    });
  };

  const create = async () => {
    const token = await messaging().getToken();

    let data = {
      id: user.id,
      token: token,
      email: user.email,
      nick: user.nick,
      name: user.name,
      surname: user.surname,
      age: selectedAge,
      gender:
        selectedGenderValue === 2
          ? 'Male'
          : selectedGenderValue === 1
          ? 'Female'
          : undefined,
      height: selectedHeight,
      weight: selectedWeight,
      interestedIn: user.interestedIn,
      photo: photo,
      geoCode: {
        latitude: latitude != null ? latitude : location.latitude,
        longitude: longitude != null ? longitude : location.longitude,
      },
      country: country != null ? country : location.country_name,
      countryEng:
        country != null
          ? convertLowerString(country)
          : convertLowerString(location.country_name),
      city: city != null ? city : location.city,
      cityEng:
        city != null
          ? convertLowerString(city)
          : convertLowerString(location.city),
      district: district != null ? district : null,
      distinctEng: district != null
      ? convertLowerString(district)
      : null,
      postal:
        location.zip_code != undefined ? location.zip_code : location.postal,
      type: 0,
      createdTime: user.createdTime,
    };

    if (data.age == undefined && data.gender == undefined) {
      setWarning(1);
    } else if (data.age == undefined) {
      setWarning(2);
    } else if (data.gender == undefined) {
      setWarning(3);
    } else {
      setSpinner(true);
      setWarning(0);

      // Kullanici kayitli mi bilgisi
      const usersCollection = await firestore()
        .collection('Users')
        .doc(user.email)
        .get();

      // Resim değiştiyse sunucuya gonderx
      if (uploadUri != null) {
        // Resim sunucuya gonderildi
        await sendImage(user.email + '.jpeg', uploadUri, usersCollection, data);
      } else {
        // Veriler sunucuya gonderildi
        sendData(usersCollection, data);

        // Veri lokalde kayit edildi.
        storeData('Users', data);
        setUser(data);
      }

      storeData('Photo', photo);
      setUserPhoto(photo);

      //   console.log('----usersCollection00000', usersCollection)

      // console.log('data 1', data);

      setSpinner(false);
      if (from === 'Login') {
        navigation.goBack();
        navigation.goBack();
      } else if (from === 'Profile Info' || from === 'Create Activity') {
        navigation.goBack();
      }
    }
  };

  const getCurrentUser = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();

    onChangeFullName(
      currentUser?.user.givenName + ' ' + currentUser?.user.familyName
    );
  };

  // Foto degistirilmek istendiginde
  const photoUpdate = () => {
    ImagePickerCropper.openPicker({
      width: 200,
      height: 200,
      cropping: true,
    })
      .then((image) => {
        let uri = image.path;
        //generating image name
        let imageNameTemp = `${user.email}.jpeg`;
        //to resolve file path issue on different platforms
        let uploadUriTemp = uri.replace('file://', '');
        // let uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        //setting the image name and image uri in the state

        // storage().ref(user.email + '.jpeg')
        // .getDownloadURL()
        // .then(result => {
        //   console.log('url', result)
        //   setUploadUri(result);
        // })

        setUploadUri(uploadUriTemp);
        setImageName(imageNameTemp);
        // setPhoto(image.path);

        setPhoto(uri);
        console.log('uri', uri);
      })
      // .then((x) => {
      //   getImage();
      // })
      .catch((e) => {
        if (e.code === 'E_NO_IMAGE_DATA_FOUND') {
          Alert.alert('Warning', 'Selected photo must be png or jpeg format');
        }
        console.error('photo error', e.code);
      });
  };

  const sendData = (usersCollection: any, data: Object) => {
    console.log('-------usersCollection ', usersCollection);
    if (usersCollection.exists) {
      firestore()
        .collection('Users')
        .doc(user.email)
        .update(data)
        .then(() => {
          console.log('User updated!');
        })
        .catch((e) => {
          console.log('update users', e);
        });
    } else {
      firestore()
        .collection('Users')
        .doc(user.email)
        .set(data)
        .then(() => {
          console.log('User insert!');
        })
        .catch((e) => {
          console.log('insert users', e);
        });
    }
  };

  const sendImage = (
    imageName: any,
    uploadUri: any,
    usersCollection: any,
    data: Object
  ) => {
    console.log('image', imageName);
    if (imageName != null) {
      storage()
        .ref(imageName)
        .putFile(uploadUri)
        .then((snapshot) => {
          //You can check the image is now uploaded in the storage bucket
          console.log(`${imageName} has been successfully uploaded.`);

          storage()
            .ref(user.email + '.jpeg')
            .getDownloadURL()
            .then((photoUrl) => {
              data.photo = photoUrl;
              console.log('------phtotos', photoUrl);
              // Veriler sunucuya gonderildi
              sendData(usersCollection, data);

              // Veri lokalde kayit edildi.
              storeData('Users', data);
              setUser(data);
            })
            .catch((e) => {
              console.error('photo adres alinamadi', e);
            });
        })
        .catch((e) => console.log('uploading image error => ', e));
    }
  };

  const getImage = async () => {
    // const currentUser = await GoogleSignin.getCurrentUser();

    let imageRef = storage().ref(user.email + '.jpeg');
    await imageRef
      .getDownloadURL()
      .then((url) => {
        //from url you can fetched the uploaded image easily
        console.log('foto', url);
        setUserPhoto(url);
        setPhoto(url);
        storeData('Photo', url);
      })
      .catch((e) => console.log('getting downloadURL of image error => ', e));
  };

  return (
    <>
      {spinner && <DisplaySpinner />}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={{ alignSelf: 'flex-end' }}
            onPress={() => create()}
          >
            <View style={styles.viewbuttonAction}>
              <Text style={styles.textButtonAction}>Save</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.viewImg}>
            <Image
              source={photo != null ? { uri: photo } : null}
              // source={require(photoPath)}
              style={styles.image}
            />
            <View style={styles.viewIcon}>
              <Icon
                size={30}
                name="camera-outline"
                type="ionicon"
                onPress={() => photoUpdate()}
              />
            </View>
          </View>
          <View style={styles.viewInfo}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <Text>
                {city == null ? location.city : city},{' '}
                {country == null ? location.country_name : country}
              </Text>
              <View style={{ paddingStart: 5 }}>
                <Icon
                  size={20}
                  name="location-outline"
                  type="ionicon"
                  onPress={() => updateLocation()}
                />
              </View>
            </View>
            <View style={styles.viewFullName}>
              <Text style={styles.textFullName}>
                {polyglot.t('screens.create_profile.label.full_name')}
              </Text>
              <View style={styles.inputFullName}>
                <TextInput
                  style={styles.inputNameText}
                  onChangeText={onChangeFullName}
                  editable={false}
                  value={fullName}
                />
              </View>
            </View>

            <View style={styles.viewAgeGender}>
              <View style={styles.viewAge}>
                <Text
                  style={
                    warning === 1 || warning === 2
                      ? [styles.textAge, { color: 'red' }]
                      : styles.textAge
                  }
                >
                  {polyglot.t('screens.create_profile.label.age')}
                </Text>
                <Selector
                  styleView={styles.selectorAge}
                  onPress={() => {
                    ageActionSheetRef.current?.open();
                    if (warning === 1) {
                      setWarning(3);
                    } else {
                      setWarning(0);
                    }
                  }}
                  // label={polyglot.t(
                  //   'screens.create_profile.action_sheets.age.title'
                  // )}
                  text={selectedAge}
                />
              </View>
              <View style={styles.viewGender}>
                <Text
                  style={
                    warning === 1 || warning === 3
                      ? [styles.textGender, { color: 'red' }]
                      : styles.textGender
                  }
                >
                  {polyglot.t('screens.create_profile.label.gender')}
                </Text>
                <Selector
                  styleView={styles.selectorGender}
                  onPress={() => {
                    genderActionSheetRef.current?.open();
                    if (warning === 1) {
                      setWarning(2);
                    } else {
                      setWarning(0);
                    }
                  }}
                  // label={polyglot.t(
                  //   'screens.create_profile.action_sheets.gender.title'
                  // )}
                  text={(() => {
                    const selectedGender = getSelectedGender(
                      selectedGenderValue
                    );
                    if (!selectedGender) {
                      return undefined;
                    }
                    return polyglot.t(selectedGender.text);
                  })()}
                />
              </View>
            </View>

            <View style={styles.viewHeightWeight}>
              <View style={styles.viewHeight}>
                <Text style={styles.textHeight}>
                  {polyglot.t('screens.create_profile.label.height')}
                </Text>
                <Selector
                  styleView={styles.selectorHeight}
                  onPress={() => heightActionSheetRef.current?.open()}
                  // label={polyglot.t(
                  //   'screens.create_profile.action_sheets.height.title'
                  // )}
                  text={
                    selectedHeight[0] != null &&
                    selectedHeight[1] != null &&
                    `${selectedHeight[0]}.${selectedHeight[1]} m`
                  }
                />
              </View>
              <View style={styles.viewWeight}>
                <Text style={styles.textWeight}>
                  {polyglot.t('screens.create_profile.label.weight')}
                </Text>
                <Selector
                  styleView={styles.selectorWeight}
                  onPress={() => weightActionSheetRef.current?.open()}
                  // label={polyglot.t(
                  //   'screens.create_profile.action_sheets.weight.title'
                  // )}
                  text={
                    selectedWeight[0] != null &&
                    selectedWeight[1] != null &&
                    `${selectedWeight[0]}.${selectedWeight[1]} kg`
                  }
                />
              </View>
            </View>

            <View style={styles.viewInterestedIn}>
              {/* <Text style={styles.textInterestedIn}>
              {polyglot.t('screens.create_profile.label.interested_in')}
            </Text>
            <ActivityTypeSelector>
              {activityTypes.map(
                (activityType: IActivityType, index: number) => (
                  <ActivityTypeSelector.IconItem
                    key={activityType.id}
                    id={activityType.id}
                    icon={activityType.image}
                    text={polyglot.t(activityType.textKey)}
                    onItemPress={(selecteActivityTypes: number[]) => {
                      console.log(selecteActivityTypes)
                      setBranchNo(selecteActivityTypes[0])
                    }}
                  />
                )
              )}
            </ActivityTypeSelector> */}
            </View>
            <View style={{ flex: 1 }} />
            <GenderActionSheet
              ref={genderActionSheetRef}
              onSelect={(genderValue: string) => {
                setSelectedGenderValue(genderValue);
                genderActionSheetRef.current?.close();
              }}
              onCancel={() => {
                genderActionSheetRef.current?.close();
              }}
            />
            <AgeActionSheet
              ref={ageActionSheetRef}
              onSelect={(number: number) => {
                // TODO: Validate selected age values
                setSelectedAge(number);
                ageActionSheetRef.current?.close();
              }}
              onCancel={() => {
                ageActionSheetRef.current?.close();
              }}
            />
            <HeightActionSheet
              ref={heightActionSheetRef}
              onSelect={([m, cm]: [number, number]) => {
                // TODO: Validate selected age values
                setSelectedHeight([m, cm]);
                heightActionSheetRef.current?.close();
              }}
              onCancel={() => {
                heightActionSheetRef.current?.close();
              }}
            />
            <WeightActionSheet
              ref={weightActionSheetRef}
              onSelect={([kg, gr]: [number, number]) => {
                // TODO: Validate selected age values
                setSelectedWeight([kg, gr]);
                weightActionSheetRef.current?.close();
              }}
              onCancel={() => {
                weightActionSheetRef.current?.close();
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

export default CreateProfilScreen;

const styles = StyleSheet.create({
  viewImg: {
    flex: 1,
    paddingStart: '5%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  viewbuttonAction: {
    height: 40,
    width: 80,
    marginTop: 10,
    marginEnd: 10,
    flexDirection: 'row',
    backgroundColor: '#37CC4A',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonAction: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 75,
  },
  viewIcon: {
    alignSelf: 'flex-end',
    // backgroundColor: 'orange'
  },
  viewInfo: {
    flex: 3,
    padding: 12,
    // backgroundColor: 'orange'
  },
  inputNameText: {
    height: 40,
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    // paddingTop: 10,
    justifyContent: 'center',
    borderColor: '#DADADA',
    backgroundColor: 'white',
  },

  viewFullName: {
    flex: 1,
    // backgroundColor: 'yellow'
  },
  textFullName: {
    paddingStart: 5,
    fontWeight: 'bold',
  },
  inputFullName: {
    height: 30,
    paddingLeft: 5,
    paddingRight: 5,
  },

  viewAgeGender: {
    flex: 1,
    marginTop: 5,
    paddingLeft: 5,
    paddingEnd: 5,
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: 'orange'
  },
  viewAge: {
    flex: 1,
    paddingRight: 5,
  },
  textAge: {
    paddingStart: 5,
    fontWeight: 'bold',
    color: 'black',
  },
  selectorAge: {
    height: 40,
    marginTop: 5,
  },
  viewGender: {
    flex: 1,
    paddingLeft: 5,
    color: 'black',
  },
  textGender: {
    paddingStart: 5,
    fontWeight: 'bold',
  },
  selectorGender: {
    height: 40,
    marginTop: 5,
  },

  viewHeightWeight: {
    flex: 1,
    marginTop: 5,
    paddingLeft: 5,
    paddingEnd: 5,
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: 'red'
  },
  viewHeight: {
    flex: 1,
    paddingRight: 5,
  },
  textHeight: {
    paddingStart: 5,
    fontWeight: 'bold',
  },
  selectorHeight: {
    height: 40,
    marginTop: 5,
  },
  viewWeight: {
    flex: 1,
    paddingStart: 5,
  },
  textWeight: {
    paddingStart: 5,
    fontWeight: 'bold',
  },
  selectorWeight: {
    height: 40,
    marginTop: 5,
  },

  viewInterestedIn: {
    flex: 2,
    marginTop: 5,
    paddingLeft: 5,
    paddingEnd: 5,
    // backgroundColor: 'orange'
  },
  textInterestedIn: {
    paddingStart: 5,
    fontWeight: 'bold',
  },
});
