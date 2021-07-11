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
  Platform,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Selector } from 'components/selector/selector';
import { IActionSheet } from '../components/action-sheet/action-sheet';
import { getSelectedGender } from 'models/genders';
import { GenderActionSheet } from './create-activity/action-sheets/gender.action-sheet';
import { AgeActionSheet } from './create-activity/action-sheets/age.action-sheet';
import { HeightActionSheet } from './create-activity/action-sheets/height.action-sheet';
import { WeightActionSheet } from './create-activity/action-sheets/weight.action-sheet';
import { ActivityTypeSelector } from 'components/activity-type-selector/activity-type-selector';
import {
  activityTypes,
  IActivityType,
} from 'components/activity-type-selector/models';
import firestore from '@react-native-firebase/firestore';
import { useEffect } from 'react';
import { getData, storeData } from 'db/localDb';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePickerCropper from 'react-native-image-crop-picker';
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import ContextApi from 'context/ContextApi';
import { useNavigation, useRoute } from '@react-navigation/native';

const genderActionSheetRef = createRef<IActionSheet>();
const ageActionSheetRef = createRef<IActionSheet>();
const heightActionSheetRef = createRef<IActionSheet>();
const weightActionSheetRef = createRef<IActionSheet>();

const CreateProfilScreen = () => {
  const { user, setUser, userPhoto, setUserPhoto } = useContext(ContextApi);
  const [email, setEmail] = useState();
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
  const [uploadUri, setUploadUri] = useState();
  const [imageName, setImageName] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { from } = route.params;

  useEffect(() => {
    getCurrentUser();
      console.log('Girdi')
      // Kullanici resim eklemediyse
      getData('Users').then((user) => {
        console.log('user create', user);
        setUser(user);
        user.age != null && setSelectedAge(user.age);
        user.gender != null &&
          setSelectedGenderValue(
            user.gender === 'Male' ? 2 : user.gender === 'Female' ? 1 : 0
          );
        user.height != null && setSelectedHeight(user.height);
        user.weight != null && setSelectedWeight(user.weight);
        if (user.photo == null && imageName == null) {
          // Kullanici resim eklediyse
          getData('Photo').then((res) => {
            if (res == null) {
              console.log('Burda 2', res);
              // getImage();
            } else {
              console.log('Burda 3')
              setPhoto(res);
            }
          });
        } else {
          console.log('Burda 4')
          setPhoto(user.photo);
        }

        // getImage(user.email, user.photo);
      });

  }, []);


  const create = async () => {
    let data = {
      id: user.id,
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
          : '',
      height: selectedHeight,
      weight: selectedWeight,
      interestedIn: user.interestedIn,
      photo: imageName != null ? null : photo,
      geoCode: user.geoCode,
      city: user.city,
      county: user.county,
      country: user.country,
      createdTime: user.createdTime,
    };

    // Kullanici kayitli mi bilgisi
    const usersCollection = await firestore()
      .collection('Users')
      .doc(email)
      .get();

    // Veriler sunucuya gonderildi
    sendData(usersCollection, data);

    // Veri lokalde kayit edildi.
    storeData('Users', data);
    setUser(data)

    if (from === 'Login') {
      navigation.goBack()
      navigation.goBack()
    }
    else if (from === 'Profile Info') {
      navigation.goBack()
    }
  };

  const getCurrentUser = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    setEmail(currentUser?.user.email);
    onChangeFullName(
      currentUser?.user.givenName + ' ' + currentUser?.user.familyName
    );
  };

  // Foto degistirilmek istendiginde
  const photoUpdate = () => {
    ImagePickerCropper.openPicker({
      width: 140,
      height: 140,
      cropping: true,
    })
      .then((image) => {
        let uri = image.path;
        //generating image name
        let imageName = `${email}.jpeg`;
        //to resolve file path issue on different platforms
        let uploadUri = uri.replace('file://', '');
        // let uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        //setting the image name and image uri in the state

        setUploadUri(uploadUri);
        setImageName(imageName);
        // setPhoto(image.path);

        // Resim sunucuya gonderildi
        sendImage(imageName, uploadUri);
      })
      .then((x) => {
        getImage();
      })
      .catch((e) => {
        if (e.code === 'E_NO_IMAGE_DATA_FOUND') {
          Alert.alert('Warning', 'Selected photo must be png or jpeg format');
        }
        console.error('photo error', e.code);
      });
  };

  const sendData = (usersCollection: any, data: Object) => {
    if (usersCollection.exists) {
      firestore()
        .collection('Users')
        .doc(email)
        .update(data)
        .then(() => {
          console.log('User updated!');
        }).catch(e => {
          console.log('update', e)
        })
    } else {
      firestore()
        .collection('Users')
        .doc(email)
        .set(data)
        .then(() => {
          console.log('User updated!');
        }).catch(e => {
          console.log('update', e)
        })
    }
  };

  const sendImage = (imageName: any, uploadUri: any) => {
    console.log('image', imageName);
    if (imageName != null) {
      storage()
        .ref(imageName)
        .putFile(uploadUri)
        .then((snapshot) => {
          //You can check the image is now uploaded in the storage bucket
          console.log(`${imageName} has been successfully uploaded.`);
        })
        .catch((e) => console.log('uploading image error => ', e));
    }
  };

  const getImage = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    
    let imageRef = storage().ref(currentUser?.user.email + '.jpeg');
    await imageRef
      .getDownloadURL()
      .then((url) => {
        //from url you can fetched the uploaded image easily
        console.log('burda', url);
        console.log('temp', url)
        setUserPhoto(url);
        setPhoto(url);
        storeData('Photo', url);

      })
      .catch((e) => console.log('getting downloadURL of image error => ', e));
  };

  return (
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
            source={
              photo != ''
                ? { uri: photo }
                : null
            }
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
              <Text style={styles.textAge}>
                {polyglot.t('screens.create_profile.label.age')}
              </Text>
              <Selector
                styleView={styles.selectorAge}
                onPress={() => {
                  ageActionSheetRef.current?.open();
                }}
                // label={polyglot.t(
                //   'screens.create_profile.action_sheets.age.title'
                // )}
                text={selectedAge}
              />
            </View>
            <View style={styles.viewGender}>
              <Text style={styles.textGender}>
                {polyglot.t('screens.create_profile.label.gender')}
              </Text>
              <Selector
                styleView={styles.selectorGender}
                onPress={() => {
                  genderActionSheetRef.current?.open();
                }}
                // label={polyglot.t(
                //   'screens.create_profile.action_sheets.gender.title'
                // )}
                text={(() => {
                  const selectedGender = getSelectedGender(selectedGenderValue);
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
    paddingTop: 10,
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
  },
  selectorAge: {
    height: 40,
    marginTop: 5,
  },
  viewGender: {
    flex: 1,
    paddingLeft: 5,
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
