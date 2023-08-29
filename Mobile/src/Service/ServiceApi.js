import axios from 'axios';

const service = "http://192.168.1.20:3001"; 

const api = axios.create({
  baseURL: service,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/login', { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getdocument = async (token) => {
  try {
    const response = await api.get('/documents', {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const upload = async (pdfFile, namaSiswa, nisn) => {
  try {
    const formData = new FormData();
    formData.append('pdfFile', pdfFile);
    formData.append('namaSiswa', namaSiswa);
    formData.append('nisn', nisn);

    const response = await axios.post(`${service}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const cekNISN = async (nisn) => {
  try {
    const response = await axios.post(`${service}/cek-nisn`, { nisn });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchDocuments = async (authToken, idSiswa, page = 1, itemsPerPage = 10) => {
  try {
    const response = await axios.get(`${service}/documents?id_siswa=${idSiswa}&page=${page}&itemsPerPage=${itemsPerPage}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteStudentAndDocument = async (nisn) => {
  try {
    const apiUrl = `${service}/delete/${nisn}`;

    const response = await axios.delete(apiUrl);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editDocument = async (authToken, idDokumen, editData) => {
  try {
    const response = await axios.put(
      `${service}/documents/edit/${idDokumen}`,
      editData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


async function uploadPDF(token, idDokumen, pdfFile) {
  const formData = new FormData();
  formData.append('pdfFile', pdfFile);

  try {
    const response = await fetch(`${service}/edit/${idDokumen}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        // Add any other headers you might need
      },
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error uploading PDF: ${errorMessage}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(`Error uploading PDF: ${error.message}`);
  }
}
export default uploadPDF;