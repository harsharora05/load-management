import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import { Text } from 'react-native';

export function CustomDrawerContent(props: any) {
    return (
        <DrawerContentScrollView {...props}>
            <Text style={{ padding: 20, fontSize: 18, fontWeight: 'bold' }}>Drawer Header</Text>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}