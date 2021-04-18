import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';
import html_script from '../../html_leaflet';

const { width, height } = window

class ActivityInfoScreen extends Component {

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
                            name="star-outline"
                            style={{ color: '#BBBDBF' }}
                        />
                    </View>
                </View>

                <View style={styles.viewOwner}>
                    <View style={styles.viewIconPic}>
                        <Image
                            source={require('assets/images/activities/profile.png')}
                            style={styles.imgIconPic}
                        />
                    </View>
                    <View style={styles.viewOwnerName}>
                        <Text style={styles.textOwnerName}>Maria Sharapova</Text>
                    </View>
                    <View style={styles.viewAction}>
                        <TouchableOpacity>
                            <View style={styles.viewbuttonAction}>
                                <Ionicons
                                    size={20}
                                    name="hand-left-outline"
                                    style={{ color: 'white' }}
                                />
                                <Text style={styles.textButtonAction}>JOIN</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.viewLocation}>
                    <Text style={styles.textLocationTitle}>Location</Text>
                    <View style={styles.containerLocation}>
                        <View style={styles.viewLocationLeft}>
                            <View style={styles.viewStartLabel}>
                                <Text style={styles.textStartLabel}>Start</Text>
                            </View>
                        </View>
                        <Text style={styles.textLocationStart}>Organize Sanayi Bölgesi Ataşehir, Kayışdağı</Text>
                    </View>
                    <View style={styles.containerLocation}>
                        <View style={styles.viewLocationLeft}>
                            <View style={styles.viewNodeLabel}>
                                <Text style={styles.textNodeLabel}>1</Text>
                            </View>
                        </View>
                        <Text style={styles.textLocationNode}>Organize Sanayi Bölgesi Ataşehir, 2. Cadde</Text>
                    </View>
                    <View style={styles.containerLocation}>
                        <View style={styles.viewLocationLeft}>
                            <View style={styles.viewNodeLabel}>
                                <Text style={styles.textNodeLabel}>2</Text>
                            </View>
                        </View>
                        <Text style={styles.textLocationNode}>Organize Sanayi Bölgesi Ataşehir, 3. Cadde</Text>
                    </View>
                    <View style={styles.containerLocation}>
                        <View style={styles.viewLocationLeft}>
                            <View style={styles.viewFinishLabel}>
                                <Text style={styles.textFinishLabel}>Finish</Text>
                            </View>
                        </View>
                        <Text style={styles.textLocationStart}>Organize Sanayi Bölgesi Ataşehir, Kayışdağı</Text>
                    </View>
                </View>

                <View style={styles.viewDate}>
                    <Text style={styles.textDateTitle}>Date</Text>
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
        fontWeight: '700',
        textAlign: 'center',
    },
    viewTitleStar: {
        flex: 1,
        paddingTop: 20,
        // backgroundColor: 'orange',
    },

    viewOwner: {
        flex: 1,
        marginStart: 40,
        marginEnd: 40,
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
        justifyContent: 'center',
    },
    textButtonAction: {
        color: 'white',
        fontSize: 16, //width * 0.04,
    },

    viewLocation: {
        flex: 3,
        marginTop: 10,
        marginStart: 40,
        marginEnd: 40,
        borderTopWidth: 1,
        borderColor: '#C4C4C4',
        // backgroundColor: 'purple',
    },
    textLocationTitle: {
        paddingTop: 10,
        fontWeight: '700',
        color: '#515151',
    },
    containerLocation: {
        flexDirection: 'row',
        paddingTop: 10,
    },
    viewLocationLeft: {
        width: 40,
        // backgroundColor: 'red',
    },
    viewStartLabel: {
        backgroundColor: '#37CC4A',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    textStartLabel: {
        color: 'white',
        fontSize: 12,//width * 0.03,
    },
    textLocationStart: {
        fontSize: 12, //width * 0.03,
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
        fontSize: 12, //width * 0.03,
    },
    textLocationNode: {
        fontSize: 10,//width * 0.025,
        paddingLeft: 5,
        color: '#515151',
    },
    viewFinishLabel: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    textFinishLabel: {
        color: 'white',
        fontSize: 12, //width * 0.03,
    },

    viewDate: {
        flex: 2,
        marginTop: 20,
        marginStart: 40,
        marginEnd: 40,
        // backgroundColor: 'blue',
    },
    textDateTitle: {
        paddingTop: 10,
        fontWeight: '700',
        color: '#515151',
    },
    textDate: {
        paddingTop: 5,
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
    },
    featureText: {
        fontWeight: '300'
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