import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { window } from '../utilities/constants/globalValues';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';

const { width, height } = window;
const { Popover } = renderers

const MyPopover = (props: Props) => {
    const { text, iconName }: Props = props;
    return (
        <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'top' }}>
            <MenuTrigger >
                <Ionicons name={iconName} size={20} color="red" />
            </MenuTrigger>
            <MenuOptions style={styles.menuOptions}>
                <Text style={styles.contentText}>{text}</Text>
            </MenuOptions>
        </Menu>
    )
}

const styles = StyleSheet.create({
    menuOptions: {
        padding: 5,
    },
    contentText: {
        fontSize: 13,
        color: 'red',
        fontWeight: '600',
    },
});

type Props = {
    text: string,
    iconName: string
}

export default MyPopover;