import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {upload, cekNISN} from '../Service/ServiceApi';
import image from '../Asset/smk.png';

const UploadScreen = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [namaSiswa, setNamaSiswa] = useState('');
  const [nisn, setNISN] = useState('');

  const handleFileSelection = async () => {
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
  const handleUpload = async () => {
    try {
      if (!selectedFile || !namaSiswa || !nisn) {
        return;
      }

      const nisnExistResponse = await cekNISN(nisn);

      if (nisnExistResponse.isExist) {
        Alert.alert('Gagal', 'NISN sudah terdaftar');
        return;
      }

      const response = await upload(selectedFile, namaSiswa, nisn);
      console.log(response.message);

      // Display success alert
      Alert.alert(
        'Berhasil',
        'File and student information uploaded successfully',
      );

      setSelectedFile(null);
      setNamaSiswa('');
      setNISN('');
    } catch (error) {
      console.error(error);
      // Handle error, if needed
    }
  };

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.logo1} />
      <TextInput
        style={styles.input}
        placeholder="Nama Siswa"
        placeholderTextColor="gray"
        value={namaSiswa}
        onChangeText={setNamaSiswa}
      />
      <TextInput
        style={styles.input}
        placeholder="NISN"
        placeholderTextColor="gray"
        value={nisn}
        onChangeText={setNISN}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.selectButton}
        onPress={handleFileSelection}>
        <Text style={styles.selectButtonText}>Pilih Dokumen</Text>
      </TouchableOpacity>
      {selectedFile && (
        <Text style={styles.selectedFileNameOutside}>
          File: {selectedFile.name}
        </Text>
      )}
      <View style={styles.selectedFileContainer}>
        <TouchableOpacity
          style={[
            styles.uploadButton,
            (!selectedFile || !namaSiswa || !nisn) && styles.disabledButton,
          ]}
          onPress={handleUpload}
          disabled={!selectedFile || !namaSiswa || !nisn}>
          <Icon name="upload" size={20} color="white" />
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
    color: 'black',
    borderRadius: 8,
    padding: 10,
  },
  selectButton: {
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    left:40,
    alignSelf:"flex-start",
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedFileContainer: {
    alignItems: 'center',
  },
  selectedFileName: {
    fontSize: 18,
    marginBottom: 10,
  },
  selectedFileNameOutside: {
    fontSize: 16,
    marginTop: 10,
    color: 'gray',
    borderWidth: 1,
    padding: 10,
    borderColor: 'skyblue',
  },
  uploadButton: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: 12,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: 'gray',
  },

  logo1: {
  
    alignSelf: 'center',
    marginBottom: 15,
    marginTop:30,
    padding: 5,
    width: 100,
    height: 100,
    borderWidth: 1,
  },
});

export default UploadScreen;
