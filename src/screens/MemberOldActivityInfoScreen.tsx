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
  PixelRatio,
  LogBox,
  Modal,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import ContextApi from 'context/ContextApi';
import { Alert } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { getData } from 'db/localDb';

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

class MemberOldActivityInfoScreen extends Component {
  static contextType = ContextApi;
  state = {
    members: null,
    modalVisible: false,
    selectedMember: null,
  };

  componentDidMount() {
    getData('Users').then((user) => {
      this.getMembers(user.email);
    });
  }

  getMembers = async (userEmail: string) => {
    const members = await firestore()
      .collection('Members')
      .where('activityId', '==', this.props.route.params.activity.id)
      .where('memberEmail', '==', userEmail)
      //   .where('memberEmail', '==', userEmail)
      .get();

    console.log('Members', members.docs[0].data());
    console.log('-----', this.props.route.params.activity.owner);
    this.setState({
      members: members.docs[0].data(),
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

  // Aktiviteye katilmadi
  joinNo = async (member: Object) => {
    member.ownerJoin = false;
    member.ownerRating = null;

    this.fireStoreUpdateFunction('Members', member.id, member);

    this.setState({ members: member });
  };

  // Aktivitye katildi yetenek puani verildi
  joinYes = async (rating: number) => {
    this.setState({ modalVisible: false });
    console.log('Memner', rating);

    const selectedMember = this.state.members;
    console.log('selectedMember', selectedMember);
    selectedMember.ownerJoin = true;
    selectedMember.ownerRating = rating;

    this.fireStoreUpdateFunction('Members', selectedMember.id, selectedMember);

    this.setState({ members: selectedMember });
  };

  render() {
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

    const showJoined = (member: Object) => {
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
          <Text style={{ fontSize: 15 }}>Joined:</Text>
          <Button
            title="No"
            color={
              this.state.members != null &&
              this.state.members.ownerJoin === false &&
              this.state.members.ownerState
                ? 'red'
                : '#CCC'
            }
            onPress={() => this.joinNo(this.state.members)}
          />
          <Button
            title="Yes"
            color={
              this.state.members != null &&
              this.state.members.ownerJoin === true &&
              this.state.members.ownerState
                ? '#37CC4A'
                : '#CCC'
            }
            onPress={() =>
              this.setState({
                modalVisible: true,
              })
            }
          />
        </View>
      );
    };

    const showMembersForOwner = (
      <View
        key={this.props.route.params.activity.owner.id}
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
              this.props.navigation.navigate('Owner Info', {
                data: this.props.route.params.activity.owner,
              })
            }
          >
            <Image
              source={{
                uri: this.props.route.params.activity.owner.photo,
              }}
              style={styles.imgMemberPic}
            />
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={() =>
              this.props.navigation.navigate('Owner Info', {
                data: this.props.route.params.activity.owner,
              })
            }
          >
            <Text style={{ fontSize: 15, paddingStart: 5 }}>
              {this.props.route.params.activity.owner.name}
            </Text>
          </TouchableNativeFeedback>
        </View>
        {showEmailIcon(this.props.route.params.activity.owner)}
        {showJoined(this.props.route.params.activity.owner)}
      </View>
    );

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
          {/* <Text style={{ color: '#515151', fontSize: 18 }}>
            {this.state.members != null &&
              this.state.members.filter(
                (item) => item._data.ownerState === true
              ).length}
            /
            {this.props.route.params.activity.maxQuota == null
              ? String.fromCharCode(126)
              : this.props.route.params.activity.maxQuota}
          </Text> */}
        </View>
        {showMembersForOwner}
      </View>
    );

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
              {this.state.members != null && (
                <Text
                  style={{ fontSize: 15 }}
                >{`${this.props.route.params.activity.owner.name}'s talent in the activity`}</Text>
              )}
              <AirbnbRating
                // showRating
                onFinishRating={(rating) => this.joinYes(rating)}
                defaultRating={
                  this.state.members != null &&
                  (this.state.members.ownerRating != null
                    ? this.state.members.ownerRating
                    : 0)
                }
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
          <View style={styles.viewTitleStar}></View>
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
          </View>
        </View>

        <View style={styles.viewPlaceAndDate}>
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
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
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

  scrollview: {
    marginTop: 5,
    height: 70,
    borderEndWidth: 1,
    borderColor: '#BBBDBF',
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
  featureTitle: {
    fontWeight: '700',
    color: '#515151',
    fontSize: 18,
  },
  featureText: {
    fontWeight: '300',
    fontSize: 16,
  },

  imgMemberPic: {
    width: 30,
    height: 30,
    // backgroundColor: 'red',
    borderRadius: 75,
  },
});

export default MemberOldActivityInfoScreen;
