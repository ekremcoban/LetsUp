import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (tag: string, value: Object) => {
    try {
        await AsyncStorage.setItem(tag, JSON.stringify(value))
        return true
    } catch (e) {
        // saving error
        console.error(tag, e)
    }
}

export const getData = async (tag: string) => {
    try {
        const value = await AsyncStorage.getItem(tag)
        return JSON.parse(value);
    } catch (e) {
        // error reading value
        console.log(tag, e)
    }
}

export const removeItem = (tag: string) => {
    try {
        AsyncStorage.removeItem(tag);
    }
   catch(error) {
    console.error(tag, error);
   }
}