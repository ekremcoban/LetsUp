import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableNativeFeedback } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';
import html_script from '../../html_leaflet';
import { locationTag } from '../assets/img/index';

const IconStart = locationTag['start'];
const IconJoin = locationTag['join'];

class ActivityInfoScreen extends Component {
    state = {
        isJoin: false,
        isStar: false,
    }

    componentDidMount() {
        setTimeout(() => {
            console.log('timer')
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
        `)
        }, 1200);
    }

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
        )

        const leave = (
            <View style={[styles.viewbuttonAction, styles.viewButtonActionLeave]}>
                <Ionicons
                    size={20}
                    name="hand-left"
                    style={{ color: 'white' }}
                />
                <Text style={styles.textButtonAction}>Leave</Text>
            </View>
        )

        return (
            <>
                <View style={styles.viewTitle}>
                    <Image
                        source={require('assets/img/hiking.png')}
                        style={styles.icon}
                    />
                    <View style={styles.viewTitleText}>
                        <Text style={styles.textTitle}>Adım Adım Zirveye</Text>
                    </View>
                    <View style={styles.viewTitleStar}>
                        <Ionicons
                            size={25}
                            name={this.state.isStar ? "star" : "star-outline"}
                            style={{ color: 'orange' }}
                            onPress={() => this.setState(prev => ({ isStar: !prev.isStar }))}
                        />
                    </View>
                </View>

                <View style={styles.viewOwner}>
                    <View style={styles.viewIconPic}>
                        <TouchableNativeFeedback onPress={() => this.props.navigation.navigate('Profile Info')}>
                            <Image
                                source={require('assets/images/activities/profile.png')}
                                style={styles.imgIconPic}
                            />
                        </TouchableNativeFeedback>
                    </View>
                    <View style={styles.viewOwnerName}>
                        <TouchableNativeFeedback onPress={() => this.props.navigation.navigate('Profile Info')}>
                            <Text style={styles.textOwnerName}>Maria Sharapova</Text>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={styles.viewAction}>
                        <TouchableOpacity onPress={() => this.setState(prev => ({ isJoin: !prev.isJoin }))}>
                            {this.state.isJoin ? join : leave}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.viewLocation}>
                    <Text style={styles.textLocationTitle}>Location</Text>
                    <View style={styles.scrollview}>
                        <ScrollView horizontal={true}>
                            <View style={styles.viewNode}>
                                <View style={{ flexDirection: 'row', flex: 2 }}>
                                    <View style={{ flex: 1, }} />
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                                        <View style={{
                                            height: 20,
                                            width: '100%',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Text style={{ color: '#37CC4A', fontWeight: '600' }}>Start</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 5, }} >
                                        <Ionicons
                                            size={20}
                                            name={"navigate"}
                                        />
                                    </View>
                                </View>
                                <View style={{
                                    flex: 4,
                                    marginStart: 5,
                                    marginEnd: 5,
                                    borderTopWidth: 1,
                                    borderColor: '#37CC4A',
                                }}>
                                    <Text>Organize Sanayi Bölgesi Ataşehir, 2. Cadde</Text>
                                </View>
                            </View>
                            <View style={styles.viewNode}>
                                <View style={{ flexDirection: 'row', flex: 2 }}>
                                    <View style={{ flex: 1, }} />
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                                        <View style={{
                                            height: 20,
                                            width: '100%',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Text style={{ color: 'red', fontWeight: '600'  }}>Finish</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 5, }} >
                                        <Ionicons
                                            size={20}
                                            name={"navigate"}
                                        />
                                    </View>
                                </View>
                                <View style={{ 
                                    flex: 4,
                                    marginStart: 5,
                                    marginEnd: 5,
                                    borderTopWidth: 1,
                                    borderColor: 'red',
                                    }}>
                                    <Text>Organize Sanayi Bölgesi Ataşehir, 2. Cadde</Text>
                                </View>
                            </View>
                            <View style={styles.viewNode}>
                                <View style={{ flexDirection: 'row', flex: 2 }}>
                                    <View style={{ flex: 1, }} />
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                                        <View style={{
                                            height: 20,
                                            width: '100%',
                                            flexDirection: 'row',
                                            backgroundColor: 'purple',
                                            borderRadius: 20,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Text style={{ color: 'white' }}>1</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 5, }} >
                                        <Ionicons
                                            size={20}
                                            name={"navigate"}
                                        />
                                    </View>
                                </View>
                                <View style={{ flex: 3, paddingLeft: 5, paddingEnd: 5, }}>
                                    <Text>Organize Sanayi Bölgesi Ataşehir, 2. Cadde</Text>
                                </View>
                            </View>
                            {/* <View style={styles.containerLocation}>
                                <View style={styles.viewLocationLeft}>
                                    <IconStart width={40} height={20} />
                                </View>
                                <View style={styles.containerLeft}>
                                    <Text style={styles.textLocationStart}>Organize Sanayi Bölgesi Ataşehir</Text>
                                </View>
                                <View style={styles.containerRight}>
                                    <Ionicons
                                        size={15}
                                        name={"navigate"}
                                    />
                                </View>
                            </View>
                            <View style={styles.containerLocation}>
                                <View style={styles.viewLocationLeft}>
                                    <View style={styles.viewNodeLabel}>
                                        <Text style={styles.textNodeLabel}>1</Text>
                                    </View>
                                </View>
                                <View style={styles.containerLeft}>
                                    <Text style={styles.textLocationStart}>Organize Sanayi Bölgesi Ataşehir, 2. Cadde</Text>
                                </View>
                                <View style={styles.containerRight}>
                                    <Ionicons
                                        size={15}
                                        name={"navigate"}
                                    />
                                </View>
                            </View>
                            <View style={styles.containerLocation}>
                                <View style={styles.viewLocationLeft}>
                                    <View style={styles.viewNodeLabel}>
                                        <Text style={styles.textNodeLabel}>2</Text>
                                    </View>
                                </View>
                                <View style={styles.containerLeft}>
                                    <Text style={styles.textLocationStart}>Organize Sanayi Bölgesi</Text>
                                </View>
                                <View style={styles.containerRight}>
                                    <Ionicons
                                        size={15}
                                        name={"navigate"}
                                    />
                                </View>
                            </View>
                            <View style={styles.containerLocation}>
                                <View style={styles.viewLocationLeft}>
                                    <View style={styles.viewFinishLabel}>
                                        <Text style={styles.textFinishLabel}>Finish</Text>
                                    </View>
                                </View>
                                <View style={styles.containerLeft}>
                                    <Text style={styles.textLocationStart}>Maltepe Belediyesi</Text>
                                </View>
                                <View style={styles.containerRight}>
                                    <Ionicons
                                        size={15}
                                        name={"navigate"}
                                    />
                                </View>
                            </View> */}
                        </ScrollView>
                    </View>
                </View>

                <View style={styles.viewDate}>
                    <Text style={styles.textDateTitle}>Date:</Text>
                    <Text style={styles.textDate}>24 Ağustos Cumratesi, 09:00-12:00</Text>
                </View>

                <View style={styles.viewFeatures}>
                    <View style={styles.featureLeft}>
                        <Text style={styles.featureTitle}>Age</Text>
                        <Text style={styles.featureText}>42-54</Text>
                    </View>
                    <View style={styles.featureMiddle}>
                        <Text style={styles.featureTitle}>Gender</Text>
                        <Text style={styles.featureText}>Man</Text>
                    </View>
                    <View style={styles.featureRight}>
                        <Text style={styles.featureTitle}>Quota</Text>
                        <Text style={styles.featureText}>3*13</Text>
                    </View>
                </View>

                <View style={styles.viewMap}>
                    <WebView ref={'mapRef'} source={{ html: html_script }} style={styles.mapRef} />
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    viewTitle: {
        flex: 4,
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
        fontSize: 28,//width * 0.07,
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
        flex: 1,
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
        alignSelf: 'center'
    },
    textOwnerName: {
        fontSize: 12,//width * 0.03,
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
        shadowColor: "#000",
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
    textButtonAction: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
    },

    viewLocation: {
        flex: 3,
        marginTop: 10,
        marginStart: 20,
        marginEnd: 20,
        borderTopWidth: 1,
        borderColor: '#C4C4C4',
        // backgroundColor: 'purple',
    },
    textLocationTitle: {
        paddingTop: 10,
        fontWeight: '700',
        color: '#515151',
        fontSize: 18,
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
    containerLocation: {
        flexDirection: 'row',
        paddingTop: 10,
    },
    containerLeft: {
        flex: 1,
    },
    containerRight: {
        paddingRight: 5,
        justifyContent: 'center',
    },
    viewLocationLeft: {
        width: 40,
        alignItems: 'flex-end',
        // backgroundColor: 'red',
    },
    image: {
        width: 50,
        height: 30,
        borderRadius: 75,
    },
    viewStartLabel: {
        width: 40,
        backgroundColor: '#37CC4A',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    textStartLabel: {
        color: 'white',
        fontSize: 14,
    },
    textLocationStart: {
        fontSize: 14,
        paddingLeft: 5,
        color: '#515151',
    },
    viewNodeLabel: {
        width: 20,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    textNodeLabel: {
        color: 'white',
        fontSize: 14,
    },
    textLocationNode: {
        fontSize: 12,
        paddingLeft: 5,
        color: '#515151',
    },
    viewFinishLabel: {
        width: 40,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    textFinishLabel: {
        color: 'white',
        fontSize: 14, //width * 0.03,
    },

    viewDate: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginStart: 20,
        marginEnd: 20,
        // backgroundColor: 'blue',
    },
    textDateTitle: {
        flex: 1,
        fontWeight: '700',
        color: '#515151',
        fontSize: 16,
        // backgroundColor: 'red',
    },
    textDate: {
        flex: 6,
        color: '#515151',
        fontSize: 16, //width * 0.04,
    },

    viewFeatures: {
        flex: 1,
        // marginStart: 40,
        // marginEnd: 40,
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
        flex: 6,
        margin: 10,
        // backgroundColor: 'green',
    },
    mapRef: {
        width: '100%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#C4C4C4',
    },
})

export default ActivityInfoScreen;