import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uploadPDF, {
  deleteStudentAndDocument,
  editDocument,
  getdocument,
  upload,
} from '../Service/ServiceApi';
import DocumentPicker from 'react-native-document-picker';
import Icon2 from 'react-native-vector-icons/AntDesign';
const HandleDokumen = () => {
  const [data, setData] = useState([]);
  const [tableHead, setTableHead] = useState([
    'NISN',
    'Nama',
    'Dokumen',
    'Action',
  ]);
  const [editingItem, setEditingItem] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newNISN, setNewNISN] = useState('');
  const [newIjasah, setNewIjasah] = useState('');
  const [tableData, setTableData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 5;
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDocumentData();
  }, [page, searchTerm]);

  const fetchDocumentData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        const documentData = await getdocument(token);
        setData(documentData.data);
        const filteredData = documentData.data.filter(
          item =>
            item.nama_siswa &&
            item.nama_siswa.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const newData = filteredData.slice(startIndex, endIndex).map(item => [
          item.nisn,
          item.nama_siswa,
          item.ijasah,
          <TouchableOpacity
            onPress={() => openModal(item)}
            style={styles.actionButton}>
            <Icon2 name="caretdown" size={20} color="gray" />
          </TouchableOpacity>,
        ]);
        setTableData(newData);
        setLoading(false);
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = item => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleEdit = item => {
    setEditingItem(item);
    setNewNISN(item.nisn);
    setNewIjasah(item.ijasah);
    setEditModalVisible(true);
  };

  const handleEditSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (token) {
        const dataToUpdate = {
          nisn: newNISN,
        };
  
        // Check if newIjasah is set and upload the PDF file
        if (newIjasah) {
          const formData = new FormData();
          formData.append('pdfFile', newIjasah);
          formData.append('nisn', newNISN);
          
          const uploadResponse = await uploadPDF(token, formData);
          if (uploadResponse.success) {
            dataToUpdate.ijasah = uploadResponse.filename;
          } else {
            console.error('PDF upload failed');
            return;
          }
        }
  
        await editDocument(token, selectedItem.id_dokumen, dataToUpdate);
        // Refresh data after successful update
        handleRefresh();
  
        setEditModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleDelete = async item => {
    try {
      const response = await deleteStudentAndDocument(item.nisn);
      console.log(response.message);
      fetchDocumentData();
      closeModal();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        const documentData = await getdocument(token);
        setData(documentData.data);

        const filteredData = documentData.data.filter(
          item =>
            item.nama_siswa &&
            item.nama_siswa.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const newData = filteredData.slice(startIndex, endIndex).map(item => [
          item.nisn,
          item.nama_siswa,
          item.ijasah,
          <TouchableOpacity
            onPress={() => openModal(item)}
            style={styles.actionButton}>
            <Icon2 name="caretdown" size={20} color="gray" />
          </TouchableOpacity>,
        ]);
        setTableData(newData);
        setLoading(false);
      } else {
      }
    } catch (error) {
      console.error(error);
    }

    setRefreshing(false);
  };


  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      if (result && result.length > 0) {
        setSelectedFile(result[0]);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
      } else {
        throw error;
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari Nama Siswa"
          placeholderTextColor={'gray'}
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="green" style={styles.loader} />
      ) : data.length > 0 ? (
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row
            data={tableHead}
            style={styles.head}
            textStyle={styles.headText}
          />
          <Rows data={tableData} textStyle={styles.text} />
        </Table>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Arsip Kosong</Text>
        </View>
      )}
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => setPage(page - 1)}
          disabled={page === 1}>
          <Icon2
            name="leftcircleo"
            size={20}
            color={page === 1 ? 'gray' : 'gray'}
          />
        </TouchableOpacity>

        <Text style={styles.paginationText}>Halaman {page}</Text>

        <TouchableOpacity
          onPress={() => setPage(page + 1)}
          disabled={page * perPage >= data.length}>
          <Icon2
            name="rightcircleo"
            size={20}
            color={page === 1 ? 'gray' : 'gray'}
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => handleEdit(selectedItem)}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(selectedItem)}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Hapus</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Data Dokumen</Text>
            <TextInput
              style={styles.inputField}
              placeholder="NISN"
              value={newNISN}
              onChangeText={setNewNISN}
            />
            <TouchableOpacity
              onPress={handleFilePicker}
              style={styles.selectFileButton}>
              <Text style={styles.selectFileButtonText}>Pilih File</Text>
            </TouchableOpacity>
            {selectedFile && (
              <Text style={styles.selectedFileName}>
                File: {selectedFile.name}
              </Text>
            )}
            <TouchableOpacity
              onPress={handleEditSave}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Simpan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEditModalVisible(false)}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#f1f8ff'},
  headText: {textAlign: 'center', fontWeight: 'bold', color: 'gray'},
  text: {textAlign: 'center', margin: 6, color: 'gray'},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
  actionButton: {
    alignSelf: 'center',
    padding: 5,
    borderRadius: 5,
    margin: 2,
    color: 'gray',
  },
  actionText: {color: 'gray', alignSelf: 'center'},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: 300,
  },
  modalButton: {
    backgroundColor: '#f1f8ff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    fontWeight: 'bold',
    color: 'gray',
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  paginationText: {
    marginHorizontal: 10,
    color: 'gray',
  },

  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 5,
    color: 'black',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
  },

  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    color: 'gray',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#f1f8ff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'green',
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  uploadButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectFileButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  selectFileButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  selectedFileName: {
    marginTop: 10,
    color: 'gray',
  },
});

export default HandleDokumen;
