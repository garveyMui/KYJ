import {StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Alert} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React, {useState} from 'react';

export const ContactsHeader = () => {
  const [isModalVisible, setModalVisible] = useState(false); // 控制模态框的显示
  const [uid, setUid] = useState(''); // 存储输入的 UID

  const toggleModal = () => {
    setModalVisible(!isModalVisible); // 切换模态框的显示和隐藏
  };

  const handleAddFriend = () => {
    if (uid.trim() === '') {
      Alert.alert('Error', 'Please enter a valid UID.');
    } else {
      console.log('Adding friend with UID:', uid);
      setModalVisible(false); // 关闭模态框
      // 这里可以添加添加好友请求的逻辑
      Alert.alert('Success', `Friend request sent to UID: ${uid}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.routeText}>Contacts</Text>
      <TouchableOpacity onPress={toggleModal} style={styles.dropdownButton}>
        <AntDesign name="pluscircleo" size={24} color="#000" />
      </TouchableOpacity>

      {/* 模态框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter UID to Add Friend</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter UID"
              value={uid}
              onChangeText={setUid}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={handleAddFriend} style={styles.button}>
              <Text style={styles.buttonText}>Send Request</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal} style={styles.button}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
  },
  routeText: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: '-50%' }],
    color: 'black',
    fontSize: 18,
  },
  dropdownButton: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明背景
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
