import { useEffect, useState } from 'react';
import { BlobFile } from 'src/models/blobFile';
import { useAuth } from 'src/providers/AuthProvider/AuthProvider';
import { server } from 'src/services/api';
import './HomePage.css';
import { Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import Modal from 'src/components/GeneralModal/Modal';

type FileUpload = {
  name: string;
  file?: File;
};

const HomePage = () => {
  const { user, loading } = useAuth();
  const [files, setFiles] = useState<BlobFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<BlobFile | undefined>();
  const [showCreate, setShowCreate] = useState(false);

  const getFiles = async () => {
    await server.getFiles().then((response) => {
      setFiles(response || []);
    });
  };
  useEffect(() => {
    getFiles();
  }, [loading]);
  useEffect(() => {
    console.log(selectedFile);
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
    const formData = new FormData();
    formData.append('file', values.file as Blob);
    formData.append('name', values.name);
    const response = await server.uploadFile(values.name, values.file);
    if (response) {
      handleClose();
      getFiles();
    }
  };

  const handleDelete = async () => {
    if (!selectedFile) return;
    if (user) {
      await server.deleteFile(selectedFile.name).then(() => {
        setSelectedFile(undefined);
        getFiles();
      });
    }
  };

  return (
    <div className="container">
      {user && (
        <div className="button-container">
          <Button onClick={() => setShowCreate(true)}>Upload image...</Button>
        </div>
      )}
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
      <Modal show={showCreate} type="Upload" formId="fileUpload" loading={false} handleClose={handleClose}>
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
        handleClose={() => setSelectedFile(undefined)}
        handleDelete={handleDelete}
      >
        <div className="d-flex flex-column">
          <img className="selected-image" src={selectedFile?.url} alt={selectedFile?.name}></img>
          <div className="d-flex flex-column">
            <div>Filename: {selectedFile?.name}</div>
            <div>Timestamp: {selectedFile?.updated}</div>
          </div>
        </div>
      </Modal>

      {/* <Modal show={show} backdrop="static" centered>
        <Modal.Header closeButton onHide={() => setShow((prev) => !prev)}>
          Upload picture
        </Modal.Header>
        <Modal.Body>
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
                <Button type="submit" form="fileUpload">
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal> */}
    </div>
  );
};

export default HomePage;
