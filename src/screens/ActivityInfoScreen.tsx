import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  ScrollView,
  TouchableNativeFeedback,
  Linking,
  Platform,
  PixelRatio,
  LogBox,
  Modal,
  Pressable,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';
import html_script from '../../html_leaflet';
import { v4 as uuidv4 } from 'uuid';
import { locationTag } from '../assets/img/index';
import { Popup } from 'react-native-map-link';
import { OpenMapDirections } from 'react-native-navigation-directions';
import firestore from '@react-native-firebase/firestore';
import ContextApi from 'context/ContextApi';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { colors } from 'utilities/constants/globalValues';

const IconStart = locationTag['start'];
const IconJoin = locationTag['join'];

const heightView =
  PixelRatio.get() === 1
    ? 150
    : PixelRatio.get() === 1.5
    ? 150
    : PixelRatio.get() === 2
    ? 150
    : PixelRatio.get() === 2.5
    ? 150
    : PixelRatio.get() === 3
    ? 150
    : PixelRatio.get() === 3.5
    ? 150
    : 150;

let request = [];
let selectedMembers = [];

class ActivityInfoScreen extends Component {
  static contextType = ContextApi;
  state = {
    title: '',
    isJoin: true,
    isStar: false,
    clickChooseMap: false,
    location: null,
    selectedAddress: null,
    members: null,
    modalVisible: false,
    selectedMember: null,
    showPageToOwner: false,
    showPageToMember: false,
  };

  componentDidMount() {
    this.isMember();
    LogBox.ignoreAllLogs();

    this.getMembers();

    let selectedAddress = this.props.route.params.addressList.filter(
      (x) => x.activityId === this.props.route.params.activity.id
    );

    this.getMoreThanOneAddress(selectedAddress);

    this.setState({
      selectedAddress: selectedAddress,
      showPageToOwner:
        this.context.user != null &&
        this.context.user.email ===
          this.props.route.params.activity.owner.email,
    });

    if (
      this.context.user != null &&
      this.context.user.email ===
        this.props.route.params.activity.owner.email &&
      selectedAddress.length === selectedAddress.nodeCount
    ) {
      this.showMap(selectedAddress);
    }
  }

  showMap = (selectedAddress: Object) => {
    setTimeout(() => {
      if (this.refs['mapRef'] != null) {
        if (selectedAddress.length === 1) {
          this.refs['mapRef'].injectJavaScript(`
        L.Routing.control({
          show: false,
          waypoints: [
            L.latLng(${selectedAddress[0].geoCode.latitude}, ${selectedAddress[0].geoCode.longitude})
          ]
        }).addTo(mymap.setView([${selectedAddress[0].geoCode.latitude}, ${selectedAddress[0].geoCode.longitude}], 11));
    
        L.marker([${selectedAddress[0].geoCode.latitude}, ${selectedAddress[0].geoCode.longitude}]).addTo(mymap)
       
        .openPopup();
        `);
        } else if (selectedAddress.length === 2) {
          this.refs['mapRef'].injectJavaScript(`
        L.Routing.control({
          show: false,
          waypoints: [
            L.latLng(${selectedAddress[0].geoCode.latitude}, ${
            selectedAddress[0].geoCode.longitude
          }),
            L.latLng(${selectedAddress[1].geoCode.latitude}, ${
            selectedAddress[1].geoCode.longitude
          })
          ]
        }).addTo(mymap.setView([${
          (selectedAddress[0].geoCode.latitude +
            selectedAddress[1].geoCode.latitude) /
          2
        }, 
        ${
          (selectedAddress[0].geoCode.longitude +
            selectedAddress[1].geoCode.longitude) /
          2
        }], 9));
    
        L.marker([${selectedAddress[0].geoCode.latitude}, ${
            selectedAddress[0].geoCode.longitude
          }]).addTo(mymap)
        .bindPopup('Start Point')
        
        .openPopup();
        `);
        } else if (selectedAddress.length === 3) {
          this.refs['mapRef'].injectJavaScript(`
        L.Routing.control({
          show: false,
          waypoints: [
            L.latLng(${selectedAddress[0].geoCode.latitude}, ${
            selectedAddress[0].geoCode.longitude
          }),
            L.latLng(${selectedAddress[1].geoCode.latitude}, ${
            selectedAddress[1].geoCode.longitude
          }),
            L.latLng(${selectedAddress[2].geoCode.latitude}, ${
            selectedAddress[2].geoCode.longitude
          })
          ]
        }).addTo(mymap.setView([${
          (selectedAddress[0].geoCode.latitude +
            selectedAddress[2].geoCode.latitude) /
          2
        },
         ${
           (selectedAddress[0].geoCode.longitude +
             selectedAddress[2].geoCode.longitude) /
           2
         }], 8));
    
        L.marker([${selectedAddress[0].geoCode.latitude}, ${
            selectedAddress[0].geoCode.longitude
          }]).addTo(mymap)
        .bindPopup('Start Point')
        
        .openPopup();
        `);
        } else if (selectedAddress.length === 4) {
          this.refs['mapRef'].injectJavaScript(`
        L.Routing.control({
          show: false,
          waypoints: [
            L.latLng(${selectedAddress[0].geoCode.latitude}, ${
            selectedAddress[0].geoCode.longitude
          }),
            L.latLng(${selectedAddress[1].geoCode.latitude}, ${
            selectedAddress[1].geoCode.longitude
          }),
            L.latLng(${selectedAddress[2].geoCode.latitude}, ${
            selectedAddress[2].geoCode.longitude
          }),
            L.latLng(${selectedAddress[3].geoCode.latitude}, ${
            selectedAddress[3].geoCode.longitude
          })
          ]
        }).addTo(mymap.setView([${
          (selectedAddress[0].geoCode.latitude +
            selectedAddress[3].geoCode.latitude) /
          2
        },
         ${
           (selectedAddress[0].geoCode.longitude +
             selectedAddress[3].geoCode.longitude) /
           2
         }], 5));
    
        L.marker([${selectedAddress[0].geoCode.latitude}, ${
            selectedAddress[0].geoCode.longitude
          }]).addTo(mymap)
        .bindPopup('Start Point')
        
        .openPopup();
        `);
        } else {
          this.refs['mapRef'].injectJavaScript(`
        L.Routing.control({
          show: false,
          waypoints: [
            L.latLng(${selectedAddress[0].geoCode.latitude}, ${
            selectedAddress[0].geoCode.longitude
          }),
            L.latLng(${selectedAddress[1].geoCode.latitude}, ${
            selectedAddress[1].geoCode.longitude
          }),
            L.latLng(${selectedAddress[2].geoCode.latitude}, ${
            selectedAddress[2].geoCode.longitude
          }),
            L.latLng(${selectedAddress[3].geoCode.latitude}, ${
            selectedAddress[3].geoCode.longitude
          }),
            L.latLng(${selectedAddress[4].geoCode.latitude}, ${
            selectedAddress[4].geoCode.longitude
          })
          ]
        }).addTo(mymap.setView([${
          (selectedAddress[0].geoCode.latitude +
            selectedAddress[4].geoCode.latitude) /
          2
        },
        ${
          (selectedAddress[0].geoCode.longitude +
            selectedAddress[4].geoCode.longitude) /
          2
        }], 3));
   
       L.marker([${selectedAddress[0].geoCode.latitude}, ${
            selectedAddress[0].geoCode.longitude
          }]).addTo(mymap)
       .bindPopup('Start Point')
       
       .openPopup();
       `);
        }
      }
    }, 2000);
  };

  getMoreThanOneAddress = async (selectedAddress: any) => {
    if (selectedAddress.length !== selectedAddress.nodeCount) {
      await firestore()
        .collection('ActivityAddress')
        .where('activityId', '==', selectedAddress[0].activityId)
        .get()
        .then((res) => {
          selectedAddress = [];
          res.docs.forEach((item) => {
            selectedAddress.push(item.data());
          });

          this.setState({ selectedAddress });
        });
      this.showMap(selectedAddress);
    }
  };

  getMembers = async () => {
    const members = await firestore()
      .collection('Members')
      .where('activityId', '==', this.props.route.params.activity.id)
      .where('memberState', '==', true)
      .get();

    let isThere = false;

    if (this.context.user != null) {
      members.docs.forEach((item) => {
        isThere =
          item._data.memberEmail === this.context.user.email &&
          item._data.ownerState;

        if (isThere) {
          this.setState({ showPageToMember: isThere });
        }
      });
    }

    if (this.state.showPageToMember) {
      this.showMap(this.state.selectedAddress);
    }

    this.setState({
      members: members.docs,
    });
  };

  isMember = async () => {
    if (this.context.user != null) {
      // Istek kayitli mi bilgisi
      const result = await firestore()
        .collection('Members')
        .where('activityId', '==', this.props.route.params.activity.id)
        .where('memberEmail', '==', this.context.user.email)
        .get();

      if (result.docs.length > 0) {
        this.setState({ isJoin: !result.docs[0].data().memberState });
      }
    }
  };

  chooseMap = (value: string) => {
    Geolocation.getCurrentPosition((info) =>
      this._callShowDirections(value, info.coords)
    );
    this.setState({
      clickChooseMap: false,
    });
  };

  // Navigasyona baglanir
  _callShowDirections = (mapType: string, myLocation: Object) => {
    const startPoint = {
      longitude: myLocation.longitude,
      latitude: myLocation.latitude,
    };

    const targetPort = {
      name: 'Activity',
      latlng: {
        latitude: this.state.location.latitude,
        longitude: this.state.location.longitude,
      },
    }.latlng;

    // Alert.alert(mapType)
    if (mapType === 'google-maps' || mapType === 'yandex') {
      const googleMapOpenUrl = ({ latitude, longitude }) => {
        const start = `${myLocation.latitude},${myLocation.longitude}`;
        const finish = `${latitude},${longitude}`;

        if (Platform.OS === 'android' && mapType === 'google-maps') {
          return `google.navigation:q=${finish}&mode=d`;
        } else if (mapType === 'google-maps') {
          return `googleMaps://app?saddr=${start}&daddr=${finish}&mode=d`;
        } else if (Platform.OS === 'android' && mapType === 'yandex') {
          return `yandexnavi://build_route_on_map?lat_from=${myLocation.latitude}&lat_to=${latitude}&lon_from=${myLocation.longitude}&lon_to=${longitude}`;
        } else if (mapType === 'yandex') {
          return `yandexnavi://build_route_on_map?lat_from=${myLocation.latitude}&lat_to=${latitude}&lon_from=${myLocation.longitude}&lon_to=${longitude}`;
        }
      };

      Linking.openURL(googleMapOpenUrl(targetPort));
    } else {
      // Arac icin haritayi ac
      const transportPlan = 'd';

      OpenMapDirections(startPoint, targetPort, transportPlan).then((res) => {
        // console.log(res);
      });
    }
  };

  requestAlert = () => {
    const activityStartTime = this.props.route.params.activity.startTime;
    const convinientTime = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      new Date().getHours() + 2,
      new Date().getMinutes()
    ).getMilliseconds();

    let title;
    let content;
    if (activityStartTime < convinientTime && !this.state.isJoin) {
      content =
        'Your point is going to be affected because the remaining time is less 2 hours.\nAre you sure?';
    } else if (!this.state.isJoin) {
      title = 'Warning';
      content = 'You will leave the activity.\nAre you sure?';
    } else {
      title = 'Sending Request';
      content = 'Are you sure?';
    }

    Alert.alert(title, content, [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          this.sendRequest();
        },
      },
    ]);
  };

  // Aktiviteye katilma ya da ayrilma talebi gonderir
  sendRequest = async () => {
    const token = await messaging().getToken();
    let context = this.context;
    let memberCollection;

    // Istek kayitli mi bilgisi
    memberCollection = await firestore()
      .collection('Members')
      .where('activityId', '==', this.props.route.params.activity.id)
      .where('memberEmail', '==', context.user.email)
      .get();

    if (memberCollection.docs.length > 0) {
      request = memberCollection.docs[0].data();
    }

    if (memberCollection.docs.length == 0) {
      this.setState({ isJoin: false });
      request = {
        id: uuidv4(),
        ownerEmail: this.props.route.params.activity.owner.email,
        ownerToken: this.props.route.params.activity.owner.token,
        ownerName: this.props.route.params.activity.owner.name,
        memberEmail: context.user.email,
        memberToken: context.user.token,
        memberName: context.user.name,
        memberPhoto: context.user.photo,
        memberState: true, // Istek gonderdi mi, iptal etti mi bilgisi (true ise gonderdi false iptal etti)
        memberJoin: null, // Aktivite sonunda uyenin katilip katilmadigi bilgisi
        memberIsCanceled: null,
        memberRating: null,
        activityId: this.props.route.params.activity.id,
        ownerState: null, // Istek gonderdi mi, iptal etti mi bilgisi
        ownerJoin: null, // Aktivite sonunda aktivite sahibinin katilip katilmadigi bilgisi
        ownerRating: null,
        startTime: this.props.route.params.activity.startTime,
        createdTime: new Date().getTime(),
      };

      this.fireStoreInsertFunction('Members', request.id, request);
    } else if (request.memberState === false) {
      this.setState((prev) => ({ isJoin: !prev.isJoin }));
      if (request.ownerState != null) {
        request.memberIsCanceled = false;
      }

      request.memberState = true;

      this.fireStoreUpdateFunction(
        'Members',
        memberCollection?.docs[0].data().id,
        request
      );
    } else if (request.memberState === true) {
      this.setState((prev) => ({ isJoin: !prev.isJoin }));

      const activityStartTime = this.props.route.params.activity.startTime;
      const convinientTime = 1627837960000; //new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() + 2, new Date().getMinutes()).getMilliseconds();

      // Katilimcinin puani etkilenir cunku 2 saatten az zaman var
      if (activityStartTime < convinientTime) {
        request.memberIsCanceled = true;
      }

      request.memberState = false;
      this.fireStoreUpdateFunction(
        'Members',
        memberCollection?.docs[0].data().id,
        request
      );
    }
  };

  deleteAlert = (title: string, content: string, type: number) => {
    Alert.alert(title, content, [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          const { setIsCreateActivity } = this.context;
          setIsCreateActivity(true);
          // Istek kayitli mi bilgisi
          const memberCollection = await firestore()
            .collection('Activities')
            .where('id', '==', this.props.route.params.activity.id)
            .get();

          let activityAddress = await firestore()
            .collection('ActivityAddress')
            .where('activityId', '==', memberCollection?.docs[0].data().id)
            .get();

          activityAddress.docs.forEach((item) => {
            let updateAddress = item.data();
            updateAddress.state = false;
            this.fireStoreUpdateFunction(
              'ActivityAddress',
              item.data().id,
              updateAddress
            );
          });

          let request = memberCollection?.docs[0].data();
          if (
            this.props.route.params.activity.startTime <
              new Date().getTime() + 7200000 &&
            this.state.members.length > 0
          ) {
            request.isCanceled = true;
          } else {
            request.isDeleted = true;
          }

          request.state = false;
          this.fireStoreUpdateFunction(
            'Activities',
            memberCollection?.docs[0].data().id,
            request
          );

          this.props.navigation.goBack();
        },
      },
    ]);
  };

  deleteActivity = async () => {
    const activityStartTime = this.props.route.params.activity.startTime;
    const convinientTime = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      new Date().getHours() + 2,
      new Date().getMinutes()
    ).getMilliseconds();
    const activeMembers = this.state.members.filter(
      (item) => item._data.ownerState === true
    );

    if (activeMembers.length === 0) {
      this.deleteAlert('Delete the Activity', 'Are you sure?', 0);
    } else if (activityStartTime > convinientTime) {
      this.deleteAlert(
        'Cancel the Activity',
        'A message is going to be sent to its members\nAre you sure?',
        1
      );
    } else {
      this.deleteAlert(
        'Cancel the Activity',
        'Your point is going to be affected because the remaining time is less 2 hours.\nAre you sure?',
        2
      );
    }
  };

  fireStoreInsertFunction = (title: string, id: string, data: Object) => {
    firestore()
      .collection(title)
      .doc(id)
      .set(data)
      .then(() => {
        console.log(title, ' insert!');
      })
      .catch((e) => {
        console.log(title, ' insert Adress', e);
      });
  };

  fireStoreUpdateFunction = (title: string, id: string, data: Object) => {
    firestore()
      .collection(title)
      .doc(id)
      .update(data)
      .then(() => {
        console.log(title, ' updated!');
      })
      .catch((e) => {
        console.log(title, ' users', e);
      });
  };

  // Aktiviteye katilma izni red yedi
  approvalNo = async (member: Object) => {
    // Istek kayitli mi bilgisi
    const memberCollection = await firestore()
      .collection('Members')
      .where('activityId', '==', this.props.route.params.activity.id)
      .get();

    const selectedMember = memberCollection.docs
      .filter((item) => item.data().memberEmail === member._data.memberEmail)[0]
      .data();
    selectedMember.ownerState = false;
    selectedMember.memberRating = null;

    this.fireStoreUpdateFunction('Members', selectedMember.id, selectedMember);

    this.setState({ members: memberCollection.docs });
  };

  approvalYes = async (member: number) => {
    this.setState({ modalVisible: false });

    // Istek kayitli mi bilgisi
    const memberCollection = await firestore()
      .collection('Members')
      .where('activityId', '==', this.props.route.params.activity.id)
      .get();

    const selectedMember = memberCollection.docs
      .filter((item) => item.data().memberEmail === member._data.memberEmail)[0]
      .data();

    selectedMember.ownerState = true;

    this.fireStoreUpdateFunction('Members', selectedMember.id, selectedMember);

    this.setState({ members: memberCollection.docs });
  };

  // Aktiviteye katilmadi
  joinNo = async (member: Object) => {
    // Istek kayitli mi bilgisi
    const memberCollection = await firestore()
      .collection('Members')
      .where('activityId', '==', this.props.route.params.activity.id)
      .get();

    const selectedMember = memberCollection.docs
      .filter((item) => item.data().memberEmail === member._data.memberEmail)[0]
      .data();
    selectedMember.memberJoin = false;
    selectedMember.memberRating = null;

    this.fireStoreUpdateFunction('Members', selectedMember.id, selectedMember);

    this.setState({ members: memberCollection.docs });
  };

  // Aktivitye katildi yetenek puani verildi
  joinYes = async (rating: number) => {
    this.setState({ modalVisible: false });

    // Istek kayitli mi bilgisi
    const memberCollection = await firestore()
      .collection('Members')
      .where('activityId', '==', this.props.route.params.activity.id)
      .get();

    const selectedMember = memberCollection.docs
      .filter(
        (item) =>
          item.data().memberEmail ===
          this.state.selectedMember._data.memberEmail
      )[0]
      .data();
    selectedMember.memberJoin = true;
    selectedMember.memberRating = rating;

    this.fireStoreUpdateFunction('Members', selectedMember.id, selectedMember);

    this.setState({ members: memberCollection.docs });
  };

  render() {
    const joinButton = (
      <View style={styles.viewbuttonAction}>
        <Ionicons
          size={20}
          name="hand-left-outline"
          style={{ color: 'white' }}
        />
        <Text style={styles.textButtonAction}>Join</Text>
      </View>
    );

    const leaveButton = (
      <View style={[styles.viewbuttonAction, styles.viewButtonActionLeave]}>
        <Ionicons size={20} name="hand-left" style={{ color: 'white' }} />
        <Text style={styles.textButtonAction}>Leave</Text>
      </View>
    );

    const deleteView = (
      <View style={[styles.viewbuttonAction, styles.viewButtonActionDelete]}>
        <Ionicons size={20} name="trash-outline" style={{ color: 'white' }} />
        <Text style={styles.textButtonAction}>
          {this.state.members != null &&
          this.state.members.filter((item) => item._data.ownerState === true)
            .length > 0
            ? 'Cancel'
            : 'Delete'}
        </Text>
      </View>
    );

    const deniedView = (
      <View style={[styles.viewbuttonAction, styles.viewButtonActionDelete]}>
        <Ionicons size={20} name="sad-outline" style={{ color: 'white' }} />
        <Text style={styles.textButtonAction}>Denied</Text>
      </View>
    );

    const canceledView = (
      <View style={[styles.viewbuttonAction, styles.viewButtonActionDelete]}>
        <Text style={styles.textButtonAction}>Canceled</Text>
      </View>
    );

    const popUp = (
      <Popup
        isVisible={true}
        onCancelPressed={() => this.setState({ clickChooseMap: false })}
        onAppPressed={(value) => this.chooseMap(value)}
        modalProps={{
          // you can put all react-native-modal props inside.
          animationIn: 'slideInUp',
        }}
        // appsWhiteList={Platform.OS === 'ios' ? ['app-maps', 'google-maps', 'yandex'] : ['google-maps', 'yandex']}
        options={{
          dialogTitle: 'Open in Maps',
          dialogMessage: 'What app would you like to use?',
          cancelText: 'Cancel',
        }}
      />
    );

    const showDetail = (
      <View style={{ width: '100%' }}>
        <View style={styles.viewDetail}>
          <View style={styles.viewMap}>
            <WebView
              ref={'mapRef'}
              source={{ html: html_script }}
              style={styles.mapRef}
            />
          </View>
          <Text style={styles.navigationTitle}>Navigation</Text>
          {this.state.selectedAddress != null &&
            this.state.selectedAddress
              .sort((a, b) => {
                return a.nodeNumber - b.nodeNumber;
              })
              .map((address, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.viewLocation}
                  onPress={() => {
                    this.setState({
                      clickChooseMap: true,
                      location: {
                        latitude: address.geoCode.latitude,
                        longitude: address.geoCode.longitude,
                      },
                    });
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      // height: heightView * 0.25,
                      // backgroundColor: 'red',
                    }}
                  >
                    <Text>
                      {index === 0 &&
                      this.state.selectedAddress.length - 1 !== index
                        ? 'Start'
                        : index === this.state.selectedAddress.length - 1 &&
                          index > 0
                        ? 'Finish'
                        : this.state.selectedAddress.length > 2
                        ? 'Dest'
                        : ''}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 5,
                      justifyContent: 'center',
                      height: heightView * 0.25,
                      // backgroundColor: 'yellow',
                    }}
                  >
                    <Text>{address.fullAddress}</Text>
                  </View>
                  <View
                    style={{
                      flex: 0.5,
                      justifyContent: 'center',
                      height: heightView * 0.25,
                      // backgroundColor: 'red',
                    }}
                  >
                    <Ionicons name={'navigate-outline'} size={20} />
                  </View>
                </TouchableOpacity>
              ))}
        </View>
      </View>
    );

    const showAgeGender = (
      <View style={styles.viewFeatures}>
        <View style={styles.featureLeft}>
          <Text style={styles.featureTitle}>Age</Text>
          <Text style={styles.featureText}>
            {this.props.route.params.activity.minAge != null
              ? this.props.route.params.activity.minAge +
                ' - ' +
                this.props.route.params.activity.maxAge
              : '---'}
          </Text>
        </View>
        <View style={styles.featureMiddle}>
          <Text style={styles.featureTitle}>Gender</Text>
          <Text style={styles.featureText}>
            {this.props.route.params.activity.gender != null
              ? this.props.route.params.activity.gender
              : '---'}
          </Text>
        </View>
      </View>
    );

    const showEmailIcon = (member: Object) => {
      return (
        <View
          style={{
            flex: 0.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            size={20}
            name="mail"
            style={{ color: 'gray' }}
            onPress={() =>
              Linking.openURL(
                `mailto:${member._data.memberEmail}?subject=${this.props.route.params.activity.name}&body=Hello ${member._data.memberName}`
              )
            }
          />
        </View>
      );
    };

    const showOwnerEmailIcon = (
      <Ionicons
        size={20}
        name="mail"
        style={{ color: 'gray' }}
        onPress={() =>
          Linking.openURL(
            `mailto:${this.props.route.params.activity.owner.email}?subject=${this.props.route.params.activity.name}&body=Hello ${this.props.route.params.activity.owner.name}`
          )
        }
      />
    );

    const showApproval = (member: Object) => {
      return (
        <View
          style={{
            flex: 3,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginEnd: '5%',
          }}
        >
          <Text style={{ fontSize: 15 }}>Approval:</Text>
          <Button
            title="No"
            color={
              member._data.ownerState === false ||
              member._data.ownerState == null
                ? 'red'
                : '#CCC'
            }
            onPress={() => this.approvalNo(member)}
          />
          <Button
            title="Yes"
            color={
              member._data.ownerState === true ||
              member._data.ownerState == null
                ? '#37CC4A'
                : '#CCC'
            }
            onPress={() => this.approvalYes(member)}
          />
        </View>
      );
    };

    const showMembersForMembers =
      this.state.members != null &&
      this.state.members
        .filter((item) => item._data.ownerState === true)
        .map((member, index) => (
          <View
            key={member._data.id}
            style={{
              flex: 1,
              marginStart: '5%',
              marginTop: 10,
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                flex: 3,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <TouchableNativeFeedback
                onPress={() =>
                  this.props.navigation.navigate('Member Info', {
                    data: member._data,
                  })
                }
              >
                <Image
                  source={{
                    uri: member._data.memberPhoto,
                  }}
                  style={styles.imgMemberPic}
                />
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                onPress={() =>
                  this.props.navigation.navigate('Member Info', {
                    data: member._data,
                  })
                }
              >
                <Text style={{ fontSize: 15, paddingStart: 5 }}>
                  {member._data.memberName}
                </Text>
              </TouchableNativeFeedback>
            </View>
            {this.state.showPageToOwner && showEmailIcon(member)}
            {this.state.showPageToOwner && showApproval(member)}
          </View>
        ));

    const showMembersForOwner =
      this.state.members != null &&
      this.state.members.map((member, index) => (
        <View
          key={member._data.id}
          style={{
            flex: 1,
            marginStart: '5%',
            marginTop: 10,
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              flex: 3,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <TouchableNativeFeedback
              onPress={() =>
                this.props.navigation.navigate('Member Info', {
                  data: member._data,
                })
              }
            >
              <Image
                source={{
                  uri: member._data.memberPhoto,
                }}
                style={styles.imgMemberPic}
              />
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
              onPress={() =>
                this.props.navigation.navigate('Member Info', {
                  data: member._data,
                })
              }
            >
              <Text style={{ fontSize: 15, paddingStart: 5 }}>
                {member._data.memberName}
              </Text>
            </TouchableNativeFeedback>
          </View>
          {this.state.showPageToOwner &&
            this.props.route.params.activity.isCanceled != true &&
            showEmailIcon(member)}
          {this.state.showPageToOwner &&
            this.props.route.params.activity.isCanceled != true &&
            showApproval(member)}
        </View>
      ));

    const showMembersContainer = (
      <View>
        <View
          style={{
            marginStart: '5%',
            marginEnd: '5%',
            paddingTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            // backgroundColor: 'orange',
          }}
        >
          <Text style={{ fontWeight: '700', color: '#515151', fontSize: 18 }}>
            Members
          </Text>
          <Text style={{ color: '#515151', fontSize: 18 }}>
            {this.state.members != null &&
              (!this.state.showPageToOwner
                ? this.state.members.filter(
                    (item) => item._data.ownerState === true
                  ).length
                : this.state.members.length)}
            /
            {this.props.route.params.activity.maxQuota == null
              ? String.fromCharCode(126)
              : this.props.route.params.activity.maxQuota}
          </Text>
        </View>
        {this.state.showPageToOwner
          ? showMembersForOwner
          : showMembersForMembers}
      </View>
    );

    const showActionView = () => {
      if (this.state.members != null && this.state.members.length > 0) {
        selectedMembers = this.state.members.filter(
          (item) =>
            item._data.activityId === this.props.route.params.activity.id
        )[0]._data;
      }

      if (this.props.route.params.activity.isCanceled != true) {
        if (
          !this.state.showPageToOwner &&
          selectedMembers.ownerState == false
        ) {
          return deniedView;
        } else if (this.state.showPageToOwner) {
          return deleteView;
        } else if (
          selectedMembers.ownerState == true &&
          !this.state.showPageToOwner &&
          !this.state.isJoin
        ) {
          return leaveButton;
        } else if (selectedMembers.ownerState == true) {
          return joinButton;
        } else if (selectedMembers.length === 0 && this.state.showPageToOwner) {
          return deleteView;
        } else if (
          selectedMembers.length === 0 &&
          !this.state.showPageToOwner &&
          !this.state.isJoin
        ) {
          return leaveButton;
        } else if (selectedMembers.length === 0) {
          return joinButton;
        } else if (!this.state.isJoin) {
          return leaveButton;
        } else if (this.state.isJoin) {
          return joinButton;
        }
      } else return canceledView;
    };

    const showActionButton = () => {
      let selectedMembers = [];
      if (this.props.route.params.activity.isCanceled != true) {
        if (this.state.members != null && this.state.members.length > 0) {
          selectedMembers = this.state.members.filter(
            (item) =>
              item._data.activityId === this.props.route.params.activity.id
          )[0]._data;
        }

        if (this.context.user == null) {
          Alert.alert('Warning', 'You have to login first', [
            {
              text: 'Ok',
              onPress: async () => {
                this.props.navigation.navigate('Login');
              },
            },
          ]);
        } else if (
          selectedMembers.ownerState == true &&
          this.props.route.params.activity.owner.email !==
            this.context.user.email
        ) {
          return this.requestAlert();
        } else if (this.state.showPageToOwner) {
          return this.deleteActivity();
        } else if (
          selectedMembers.length === 0 &&
          this.props.route.params.activity.owner.email !==
            this.context.user.email
        ) {
          return this.requestAlert();
        } else if (selectedMembers.length === 0) {
          return this.deleteActivity();
        } else if (
          this.props.route.params.activity.owner.email !==
            this.context.user.email &&
          (selectedMembers.ownerState == null ||
            selectedMembers.ownerState == true)
        ) {
          return this.requestAlert();
        }
      }
    };

    const modal = (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            this.setState({ modalVisible: false });
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Rating
                // showRating
                onFinishRating={(rating) => this.joinYes(rating)}
                style={{ paddingVertical: 10 }}
                imageSize={30}
              />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.setState({ modalVisible: false })}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );

    return (
      <ScrollView style={{ height: 1000 }}>
        {modal}
        {this.state.clickChooseMap && popUp}
        <View style={styles.viewTitle}>
          <Image
            source={
              this.props.route.params.activity.type === 'basketball'
                ? require('assets/img/basketball.png')
                : this.props.route.params.activity.type === 'bicycle'
                ? require('assets/img/bicycle.png')
                : this.props.route.params.activity.type === 'hiking'
                ? require('assets/img/hiking.png')
                : this.props.route.params.activity.type === 'frisbee'
                ? require('assets/img/frisbee.png')
                : this.props.route.params.activity.type === 'jogging'
                ? require('assets/img/jogging.png')
                : this.props.route.params.activity.type === 'table_tennis'
                ? require('assets/img/table_tennis.png')
                : this.props.route.params.activity.type === 'tennis'
                ? require('assets/img/tennis.png')
                : this.props.route.params.activity.type === 'volleyball'
                ? require('assets/img/volleyball.png')
                : this.props.route.params.activity.type === 'badminton'
                ? require('assets/img/badminton.png')
                : this.props.route.params.activity.type === 'meditation'
                ? require('assets/img/meditation.png')
                : this.props.route.params.activity.type === 'roller_skate'
                ? require('assets/img/roller_skate.png')
                : this.props.route.params.activity.type === 'skateboard'
                ? require('assets/img/skateboard.png')
                : require('assets/img/join.png')
            }
            style={styles.icon}
          />
          <View style={styles.viewTitleText}>
            <Text style={styles.textTitle}>
              {this.props.route.params.activity.name}
            </Text>
          </View>
          <View style={styles.viewTitleStar}>
            {/* <Ionicons
              size={25}
              name={this.state.isStar ? 'star' : 'star-outline'}
              style={{ color: 'orange' }}
              onPress={() =>
                this.setState((prev) => ({ isStar: !prev.isStar }))
              }
            /> */}
          </View>
        </View>

        <View style={styles.viewOwner}>
          <View style={styles.viewIconPic}>
            <TouchableNativeFeedback
              onPress={() =>
                this.props.navigation.navigate('Owner Info', {
                  data: this.props.route.params.activity.owner,
                })
              }
            >
              <Image
                source={{
                  uri: this.props.route.params.activity.owner.photo,
                }}
                style={styles.imgIconPic}
              />
            </TouchableNativeFeedback>
          </View>
          <View style={styles.viewOwnerName}>
            <TouchableNativeFeedback
              onPress={() =>
                this.props.navigation.navigate('Owner Info', {
                  data: this.props.route.params.activity.owner,
                })
              }
            >
              <Text style={styles.textOwnerName}>
                {this.props.route.params.activity.owner.name +
                  ' ' +
                  this.props.route.params.activity.owner.surname}
              </Text>
            </TouchableNativeFeedback>
            {this.state.showPageToMember && showOwnerEmailIcon}
          </View>
          <View style={styles.viewAction}>
            <TouchableOpacity onPress={() => showActionButton()}>
              {showActionView()}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.viewPlaceAndDate}>
          <Text style={styles.textDate}>
            {this.props.route.params.getPlace(this.props.route.params.activity)}{' '}
          </Text>
          <Text style={styles.textDate}>
            {new Date(this.props.route.params.activity.startTime)
              .toString()
              .substring(0, 15)}
            ,{' '}
            {(new Date(this.props.route.params.activity.startTime).getHours() <
            10
              ? '0' +
                new Date(this.props.route.params.activity.startTime).getHours()
              : new Date(
                  this.props.route.params.activity.startTime
                ).getHours()) +
              ':' +
              (new Date(
                this.props.route.params.activity.startTime
              ).getMinutes() < 10
                ? '0' +
                  new Date(
                    this.props.route.params.activity.startTime
                  ).getMinutes()
                : new Date(
                    this.props.route.params.activity.startTime
                  ).getMinutes())}
                  -
            {(new Date(this.props.route.params.activity.finishTime).getHours() <
            10
              ? '0' +
                new Date(this.props.route.params.activity.finishTime).getHours()
              : new Date(
                  this.props.route.params.activity.finishTime
                ).getHours()) +
              ':' +
              (new Date(
                this.props.route.params.activity.finishTime
              ).getMinutes() < 10
                ? '0' +
                  new Date(
                    this.props.route.params.activity.finishTime
                  ).getMinutes()
                : new Date(
                    this.props.route.params.activity.finishTime
                  ).getMinutes())}
          </Text>
        </View>
        <Text style={styles.textDate}>TEST Bitiş Tarihi:  {new Date(this.props.route.params.activity.finishTime)
              .toString()
              .substring(0, 15)}</Text>
        {this.state.showPageToOwner || this.state.showPageToMember
          ? showDetail
          : !this.state.isJoin &&
            selectedMembers.ownerState != false && (
              <View
                style={{
                  backgroundColor: colors.bar,
                  padding: 5,
                  borderRadius: 10,
                  alignSelf: 'center',
                }}
              >
                <Text style={{ color: 'white', fontWeight: '700' }}>
                  Awaiting confirmation...
                </Text>
              </View>
            )}
        {showAgeGender}
        {showMembersContainer}
        <View style={{ height: 50 }} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingTop: '40%'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    marginTop: 10,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  viewTitle: {
    height: heightView,
    flexDirection: 'row',
    marginLeft: 20,
  },
  icon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  viewTitleText: {
    flex: 5,
    alignSelf: 'center',
    // backgroundColor: 'red',
  },
  textTitle: {
    fontSize: 28, //width * 0.07,
    fontWeight: '600',
    color: '#515151',
    textAlign: 'center',
  },
  viewTitleStar: {
    flex: 1,
    paddingTop: 20,
    // backgroundColor: 'orange',
  },

  viewOwner: {
    height: heightView * 0.3,
    marginStart: 20,
    marginEnd: 20,
    flexDirection: 'row',
    // backgroundColor: 'orange',
  },
  viewIconPic: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
  imgIconPic: {
    width: 30,
    height: 30,
    // backgroundColor: 'red',
    borderRadius: 75,
  },
  viewOwnerName: {
    flex: 5,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  textOwnerName: {
    fontSize: 12, //width * 0.03,
    alignSelf: 'center',
    marginEnd: 10,
  },
  viewAction: {
    flex: 2,
    // backgroundColor: 'red',
  },
  viewbuttonAction: {
    height: 35,
    flexDirection: 'row',
    backgroundColor: '#37CC4A',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  viewButtonActionLeave: {
    backgroundColor: 'red',
  },
  viewButtonActionDelete: {
    backgroundColor: 'red',
  },
  textButtonAction: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },

  viewDetail: {
    // height: heightView * 2.5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    width: '90%',
    marginStart: '5%',
    marginEnd: '5%',
    // backgroundColor: 'purple',
  },
  viewLocation: {
    flexDirection: 'row',
    marginTop: 10,
    // height: heightView,
    // backgroundColor: 'orange',
  },
  scrollview: {
    marginTop: 5,
    height: 70,
    borderEndWidth: 1,
    borderColor: '#BBBDBF',
  },
  viewNode: {
    width: 170,
    height: '100%',
    // backgroundColor: 'red',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 15,
    alignItems: 'center',
    // shadowColor: "#000",
    // shadowOffset: {
    //     width: 0,
    //     height: 1,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    //  elevation: 5,
  },

  viewPlaceAndDate: {
    height: heightView * 0.3,
    marginTop: 5,
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#C4C4C4',
    // backgroundColor: 'blue',
  },
  textDate: {
    // flex: 6,
    color: '#515151',
    textAlign: 'center',
    fontSize: 16, //width * 0.04,
  },

  viewFeatures: {
    flex: 1,
    // marginStart: 40,
    // marginEnd: 40,
    marginStart: '5%',
    marginEnd: '5%',
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    // backgroundColor: 'yellow',
  },
  featureLeft: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  featureMiddle: {
    flex: 1,
    alignItems: 'center',
  },
  featureRight: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  featureTitle: {
    fontWeight: '700',
    color: '#515151',
    fontSize: 18,
  },
  featureText: {
    fontWeight: '300',
    fontSize: 16,
  },

  viewMap: {
    height: heightView * 1.5,
    // margin: 10,
    // backgroundColor: 'green',
  },
  mapRef: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C4C4C4',
  },
  navigationTitle: {
    marginTop: 10,
    fontWeight: '700',
    color: '#515151',
    fontSize: 18,
  },
  imgMemberPic: {
    width: 30,
    height: 30,
    // backgroundColor: 'red',
    borderRadius: 75,
  },
});

export default ActivityInfoScreen;
