import { useCallback, useEffect, useState } from 'react';
import { BlobFile } from 'src/models/blobFile';
import { useAuth } from 'src/providers/AuthProvider/AuthProvider';
import { server } from 'src/services/api';
import './HomePage.css';
import { Button, Form, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import Modal from 'src/components/GeneralModal/Modal';
import up from 'src/resources/up.png';
import down from 'src/resources/down.png';

type FileUpload = {
  name: string;
  file?: File;
};

const HomePage = () => {
  const { user, loading: autLoading } = useAuth();
  const [files, setFiles] = useState<BlobFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<BlobFile | undefined>();
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [filter, setFilter] = useState('name');
  const [order, setOrder] = useState('desc');

  const getSelectedFile = async (name?: string) => {
    if (!name || !name.includes('resized')) return;
    const fileName = name.split('-')[1];
    setLoading(true);
    await server
      .getFile(fileName)
      .then((response) => {
        setSelectedFile(response);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getFiles = useCallback(async () => {
    setLoadingAll(true);
    await server
      .getFiles(filter, order)
      .then((response) => {
        console.log('fetched');
        setFiles(response || []);
      })
      .finally(() => {
        setLoadingAll(false);
      });
  }, [filter, order]);

  useEffect(() => {
    getFiles();
  }, [autLoading, getFiles]);

  useEffect(() => {
    getSelectedFile(selectedFile?.name);
  }, [selectedFile]);

  const initialValues: FileUpload = {
    name: '',
    file: undefined,
  };

  const validationSchema = yup.object({
    name: yup.string().required(),
    file: yup.mixed().required(),
  });
  const handleClose = () => {
    setShowCreate(false);
  };

  const handleSubmit = async (values: FileUpload) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', values.file as Blob);
    formData.append('name', values.name);
    await server.uploadFile(values.name, values.file).then(() => {
      handleClose();
      getFiles();
    });
  };

  const handleDelete = async () => {
    if (!selectedFile) return;
    if (user) {
      setLoading(true);
      await server.deleteFile(selectedFile.name).then(() => {
        setSelectedFile(undefined);
        getFiles();
      });
    }
  };

  return (
    <div className="container">
      <div className="button-container">
        <Button
          className="me-2"
          variant={`${filter === 'name' ? 'outline-primary' : 'primary'}`}
          onClick={() => setFilter('name')}
        >
          Name
        </Button>
        <Button
          className="me-2"
          variant={`${filter === 'updated' ? 'outline-primary' : 'primary'}`}
          onClick={() => setFilter('updated')}
        >
          Timestamp
        </Button>
        <Button className="me-2" onClick={() => setOrder(order === 'desc' ? 'asc' : 'desc')}>
          Order
          <img className="ms-3" width="20px" height="20px" src={order === 'desc' ? down : up} alt="sort-img" />
        </Button>
        {user && <Button onClick={() => setShowCreate(true)}>Upload image...</Button>}
      </div>
      {loadingAll ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="gallery-grid">
          {files.length === 0 && <p>No images found</p>}
          {files.map((file) => (
            <img
              className="gallery-item"
              onClick={() => {
                if (user) setSelectedFile(file);
              }}
              key={file.name}
              src={file.url}
              alt={file.name}
            ></img>
          ))}
        </div>
      )}
      <Modal show={showCreate} type="Upload" formId="fileUpload" loading={loading} handleClose={handleClose}>
        <Formik<FileUpload>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {(formik) => (
            <Form id="fileUpload" onSubmit={formik.handleSubmit}>
              <Form.Label>File name</Form.Label>
              <Form.Control
                type="text"
                onChange={formik.handleChange}
                value={formik.values.name}
                name="name"
                placeholder="Enter file name"
              />
              <Form.Label>File</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => {
                  const { files } = e.currentTarget as HTMLInputElement;
                  if (files) {
                    formik.setFieldValue('file', files[0]);
                  }
                }}
              ></Form.Control>
            </Form>
          )}
        </Formik>
      </Modal>
      <Modal
        show={selectedFile !== undefined}
        type="Delete"
        size="lg"
        isBodyCentered
        formId="fileDelete"
        loading={loading}
        handleClose={() => setSelectedFile(undefined)}
        handleDelete={handleDelete}
      >
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <div className="d-flex flex-column">
            <img className="selected-image" src={selectedFile?.url} alt={selectedFile?.name}></img>
            <div className="d-flex flex-column">
              <div>Filename: {selectedFile?.name}</div>
              <div>Timestamp: {selectedFile?.updated}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HomePage;
