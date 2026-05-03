

import { View, Text, Pressable, Modal, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import logout from '@/utils/logOut';

const UserProfile = () => {
  const router = useRouter();
  const {token, isAuthenticated, user} = useSelector((state: RootState) => state.auth);

    const { email, id, name } = user || {};

    const cropUsername = (fullName?: string, emailAddr?: string) => {
        if (fullName) {
            return fullName.split(' ')[0].trim();
        }
        if (emailAddr) return emailAddr.split('@')[0];
        return '';
    };

    const displayName = cropUsername(name, email) || 'Usuário';

    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
      await logout();
      setOpen(false);
      router.replace('/login');
    };

    return (
        <View>
            <Pressable
                onPress={() => setOpen(true)}
                className="bg-white/5 p-2 pr-4 rounded-2xl border border-white/10 flex-row items-center"
            >
                {/* Avatar */}
                <View className="w-8 h-8 bg-blue-600 rounded-lg items-center justify-center mr-3 shadow-lg">
                    <Text className="text-white font-bold text-xs">
                        {name ? name.charAt(0).toUpperCase() : 'U'}
                    </Text>
                </View>
                <Text
                    className="text-white font-medium text-sm"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ maxWidth: 140 }}
                >
                    {displayName}
                </Text>
            </Pressable>

            <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }} activeOpacity={1} onPressOut={() => setOpen(false)}>
                <TouchableOpacity activeOpacity={1} style={{ backgroundColor: '#0B1220', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                  <Pressable onPress={() => { setOpen(false); router.push('/profile'); }} className="flex-row items-center p-3 rounded-2xl">
                    <FontAwesome5Icon name="user" size={18} color="#3B82F6" />
                    <Text className="text-white text-base ml-4">Perfil</Text>
                  </Pressable>

                  <Pressable onPress={() => { setOpen(false); router.push('/settings'); }} className="flex-row items-center p-3 rounded-2xl mt-2">
                    <FontAwesome5Icon name="cog" size={18} color="#3B82F6" />
                    <Text className="text-white text-base ml-4">Configurações</Text>
                  </Pressable>

                  <Pressable onPress={() => { setOpen(false); router.push('/notifications'); }} className="flex-row items-center p-3 rounded-2xl mt-2">
                    <FontAwesome5Icon name="bell" size={18} color="#3B82F6" />
                    <Text className="text-white text-base ml-4">Notificações</Text>
                  </Pressable>

                  <Pressable onPress={handleLogout} className="flex-row items-center p-3 rounded-2xl mt-3">
                    <FontAwesome5Icon name="sign-out-alt" size={18} color="#EF4444" />
                    <Text className="text-red-500 text-base font-bold ml-4">Sair</Text>
                  </Pressable>
                </TouchableOpacity>
              </TouchableOpacity>
            </Modal>
        </View>
    )
}

export default UserProfile