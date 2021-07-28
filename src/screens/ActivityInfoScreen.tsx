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
const targetPort = {
  name: 'Eskihisar',
  latlng: { latitude: 40.768107, longitude: 29.424038 },
}.latlng;

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
  };

  componentDidMount() {
    this.isMember();
    LogBox.ignoreAllLogs();

    this.getMembers();

    const selectedAddress = this.props.route.params.addressList.filter(
      (x) => x.activityId === this.props.route.params.activity.id
    );
    this.setState({ selectedAddress });

    setTimeout(() => {
      console.log('timer');
      this.refs['mapRef'].injectJavaScript(`
    L.Routing.control({
      show: false,
      waypoints: [
        L.latLng(41.01809926611338, 29.00856835843875),
        L.latLng(40.88688641127476, 29.186640955537502),
        L.latLng(40.81831905125059, 29.285431003343092),
        L.latLng(40.81191220859712, 29.365444423703714)
      ]
    }).addTo(mymap);

    L.marker([41.01809926611338, 29.00856835843875]).addTo(mymap)
    .bindPopup('Start Point')
    .openPopup();
    `);
    }, 1500);
  }

  getMembers = async () => {
    const members = await firestore()
      .collection('Members')
      .where('activityId', '==', this.props.route.params.activity.id)
      .get();
    console.log('Members', members.docs);
    this.setState({ members: members.docs });
  };

  isMember = async () => {
    // Istek kayitli mi bilgisi
    const result = await firestore()
      .collection('Members')
      .where('activityId', '==', this.props.route.params.activity.id)
      .where('memberMail', '==', this.context.user.email)
      .get();

    console.log('te', result.docs);
    if (result.docs.length > 0) {
      console.log(result.docs[0].data().memberState);
      this.setState({ isJoin: !result.docs[0].data().memberState });
    }
  };

  chooseMap = (value: string) => {
    this.setState({
      clickChooseMap: false,
    });
    this._callShowDirections(value);
  };

  // Navigasyona baglanir
  _callShowDirections = (mapType: string) => {
    const startPoint = {
      longitude: this.state.location.longitude,
      latitude: this.state.location.latitude,
    };
    // Alert.alert(mapType)
    if (mapType === 'google-maps' || mapType === 'yandex') {
      const googleMapOpenUrl = ({ latitude, longitude }) => {
        const latLng = `${latitude},${longitude}`;
        const source = `${this.state.location.latitude},${this.state.location.longitude}`;

        if (Platform.OS === 'android' && mapType === 'google-maps') {
          return `google.navigation:q=${latLng}&mode=d`;
        } else if (mapType === 'google-maps') {
          return `googleMaps://app?saddr=${source}&daddr=${latLng}&mode=d`;
        } else if (Platform.OS === 'android' && mapType === 'yandex') {
          return `yandexnavi://build_route_on_map?lat_from=${this.state.location.latitude}&lat_to=${latitude}&lon_from=${this.state.location.longitude}&lon_to=${longitude}`;
        } else if (mapType === 'yandex') {
          return `yandexnavi://build_route_on_map?lat_from=${this.state.location.latitude}&lat_to=${latitude}&lon_from=${this.state.location.longitude}&lon_to=${longitude}`;
        }
      };

      Linking.openURL(googleMapOpenUrl(targetPort));
    } else {
      // Arac icin haritayi ac
      const transportPlan = 'd';

      OpenMapDirections(startPoint, targetPort, transportPlan).then((res) => {
        console.log(res);
      });
    }
  };

  sendRequest = async () => {
    const token = await messaging().getToken();
    console.log('token', token);
    let context = this.context;
    let memberCollection;

    // Istek kayitli mi bilgisi
    memberCollection = await firestore()
      .collection('Members')
      .where('activityId', '==', this.props.route.params.activity.id)
      .where('memberMail', '==', context.user.email)
      .get();

    if (memberCollection.docs.length > 0) {
      request = memberCollection.docs[0].data();
      //   console.log('memberCollection 1', request);
    }

    // console.log('memberCollection 2', memberCollection.docs.length);

    if (memberCollection.docs.length == 0) {
      this.setState({ isJoin: false });
      request = {
        id: uuidv4(),
        ownerMail: this.props.route.params.activity.owner.email,
        ownerToken: this.props.route.params.activity.owner.token,
        ownerName: this.props.route.params.activity.owner.name,
        memberMail: context.user.email,
        memberToken: context.user.token,
        memberName: context.user.name,
        memberPhoto: context.user.photo,
        activityId: this.props.route.params.activity.id,
        ownerState: false,
        memberState: true,
        startTime: this.props.route.params.activity.startTime,
        createdTime: new Date().getTime(),
      };
      console.log('ilk kayıt', request);
      this.fireStoreInsertFunction('Members', request.id, request);
    } else if (request.memberState === false) {
      this.setState((prev) => ({ isJoin: !prev.isJoin }));
      request.memberState = true;
      console.log('ilk güncelleme', request);
      this.fireStoreUpdateFunction(
        'Members',
        memberCollection?.docs[0].data().id,
        request
      );
    } else if (request.memberState === true) {
      this.setState((prev) => ({ isJoin: !prev.isJoin }));
      console.log('ikinci güncelleme', request);
      request.memberState = false;
      this.fireStoreUpdateFunction(
        'Members',
        memberCollection?.docs[0].data().id,
        request
      );
    }
  };

  deleteActivity = async () => {
    Alert.alert('Delete Activity', 'Are you sure?', [
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

          let request = memberCollection?.docs[0].data();
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

  render() {
    const join = (
      <View style={styles.viewbuttonAction}>
        <Ionicons
          size={20}
          name="hand-left-outline"
          style={{ color: 'white' }}
        />
        <Text style={styles.textButtonAction}>Join</Text>
      </View>
    );

    const leave = (
      <View style={[styles.viewbuttonAction, styles.viewButtonActionLeave]}>
        <Ionicons size={20} name="hand-left" style={{ color: 'white' }} />
        <Text style={styles.textButtonAction}>Leave</Text>
      </View>
    );

    const deleteView = (
      <View style={[styles.viewbuttonAction, styles.viewButtonActionDelete]}>
        <Ionicons size={20} name="trash-outline" style={{ color: 'white' }} />
        <Text style={styles.textButtonAction}>Delete</Text>
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
            this.state.selectedAddress.map((address, index) => (
              <View style={styles.viewLocation}>
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
                        index > 1
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
              </View>
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
        {/* <View style={styles.featureRight}>
        <Text style={styles.featureTitle}>Quota</Text>
        <Text style={styles.featureText}>
          {this.props.route.params.activity.minQuota != null
            ? this.props.route.params.activity.minQuota +
              ' - ' +
              this.props.route.params.activity.maxQuota
            : '---'}
        </Text>
      </View> */}
      </View>
    );

    return (
      <ScrollView style={{ height: 1000 }}>
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
                : this.props.route.params.activity.type === 'jogging'
                ? require('assets/img/jogging.png')
                : this.props.route.params.activity.type === 'tennis'
                ? require('assets/img/tennis.png')
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
            <Ionicons
              size={25}
              name={this.state.isStar ? 'star' : 'star-outline'}
              style={{ color: 'orange' }}
              onPress={() =>
                this.setState((prev) => ({ isStar: !prev.isStar }))
              }
            />
          </View>
        </View>

        <View style={styles.viewOwner}>
          <View style={styles.viewIconPic}>
            <TouchableNativeFeedback
              onPress={() => this.props.navigation.navigate('Profile Info')}
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
              onPress={() => this.props.navigation.navigate('Profile Info')}
            >
              <Text style={styles.textOwnerName}>
                {this.props.route.params.activity.owner.name +
                  ' ' +
                  this.props.route.params.activity.owner.surname}
              </Text>
            </TouchableNativeFeedback>
          </View>
          <View style={styles.viewAction}>
            <TouchableOpacity
              onPress={() =>
                this.props.route.params.activity.owner.email !==
                this.context.user.email
                  ? this.sendRequest()
                  : this.deleteActivity()
              }
            >
              {this.props.route.params.activity.owner.email !==
                this.context.user.email && this.state.isJoin
                ? join
                : this.props.route.params.activity.owner.email !==
                  this.context.user.email
                ? leave
                : deleteView}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.viewPlaceAndDate}>
          <Text>
            {this.props.route.params.getPlace(this.props.route.params.activity)}{' '}
            -{' '}
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
          </Text>
        </View>
        {showDetail}
        {showAgeGender}
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
              {this.state.members != null && this.state.members.length}/13
            </Text>
          </View>
          {this.state.members != null &&
            this.state.members.map((member) => (
              <View
                key={member.id}
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
                  <Image
                    source={{
                      uri: member._data.memberPhoto,
                    }}
                    style={styles.imgMemberPic}
                  />
                  <Text style={{fontSize: 15, paddingStart: 5,}}>{member._data.memberName}</Text>
                </View>
                <View
                  style={{
                    flex: 0.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons size={20} name="mail" style={{ color: 'gray' }} />
                </View>
                <View
                  style={{
                    flex: 3,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    marginEnd: '5%',
                  }}
                >
                  <Text style={{fontSize: 15}}>Joined: </Text>
                  <Button
                    title="No"
                    color={'red'}
                    onPress={() =>
                      Alert.alert('Button with adjusted color pressed')
                    }
                  />
                  <Button
                    title="Yes"
                    color={'#37CC4A'}
                    onPress={() =>
                      Alert.alert('Button with adjusted color pressed')
                    }
                  />
                </View>
              </View>
            ))}
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
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
    alignSelf: 'center',
  },
  textOwnerName: {
    fontSize: 12, //width * 0.03,
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
    flexDirection: 'row',
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
