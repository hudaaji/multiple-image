import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import { Link } from 'react-router-dom';
import Masonry from "react-masonry-component";
import { axioz } from '../../../helpers/api';
import { useDropzone } from 'react-dropzone';
import Dropzone from "react-dropzone";

const Gallery = () => {
  document.title = "Gallery";

  const [selectedFiles, setselectedFiles] = useState([]);

  function handleAcceptedFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const [modal_list, setmodal_list] = useState(false);
  const tog_list = () => {
    setmodal_list(!modal_list);
  };

  const clearState = () => {
    setTitle('')
    setImages('')
  }

  const [data, setData] = useState([])
  const [xtitle, setTitle] = useState('')
  const [xid, setId] = useState('')
  const [ximages, setImages] = useState('')

  const onDrop = useCallback(async f => {
    try {
      setImages(f)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop,
    maxFiles: 1
  })

  const getData = () => {
    axioz.get(`/data`)
      .then(res => {
        setData(res.data.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleSubmit = e => {
    e.preventDefault()

    const form = new FormData()

    form.append('xtitle', xtitle)
    form.append('ximages', selectedFiles[0])

    axioz.post(`/create`, form)
      .then(res => {
        window.alert('Berhasil Upload Gambar')
        getData()
      })
      .catch(err => {
        window.alert('Gagal Upload Gambar')
      })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Gallery" pageTitle="Pages" />
          <Row>
            <Col lg={12}>
              <div className="">
                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <div style={{ paddingLeft: 7 }}>
                        <Button onClick={() => {
                          clearState()
                          tog_list()
                        }}>Tambah</Button>
                      </div>

                      <Masonry className="row gallery-wrapper">
                        {data.map((d, i) => (
                          <Col xxl={3} xl={4} sm={6} className="element-item project designing development" key={i}>
                            <Card className="gallery-box">
                              <div className="gallery-container">
                                <Link className="image-popup" to='#' title="">
                                  {/* <img className="gallery-img img-fluid" src={`http://127.0.0.1:8000/storage/${d.images}`} alt="" width="350px" height="350px" /> */}
                                  <img className="gallery-img img-fluid" src={`http://154.26.132.106:7002/storage/${d.images}`} alt="" width="350px" height="350px" />
                                  <div className="gallery-overlay">
                                    <h5 className="overlay-caption">{d.title}</h5>
                                  </div>
                                </Link>
                              </div>
                            </Card>
                          </Col>
                        ))}

                      </Masonry>
                    </Col>
                  </Row>
                </CardBody>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Modal isOpen={modal_list} toggle={() => { tog_list(); }} centered >
        <ModalHeader className="bg-light p-3" toggle={() => { tog_list(); }}>
          Tambah Gambar
        </ModalHeader>
        <ModalBody>
          <div className="mb-3" id="modal-id">
            <label htmlFor="id-field" className="form-label">Judul</label>
            <input type="text" id="id-field" onChange={e => setTitle(e.target.value)} value={xtitle} className="form-control" placeholder="Silahkan ketik judul gambar" />
          </div>
          <div className="mb-3">
            <label htmlFor="id-field" className="form-label">Gambar</label>
            <Dropzone
              onDrop={acceptedFiles => {
                handleAcceptedFiles(acceptedFiles);
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div className="dropzone dz-clickable">
                  <div
                    className="dz-message needsclick"
                    {...getRootProps()}
                  >
                    <div className="mb-3">
                      <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                    </div>
                    <h4>Drop files here to upload.</h4>
                  </div>
                </div>
              )}
            </Dropzone>
            <div className="list-unstyled mb-0" id="file-previews">
              {selectedFiles.map((f, i) => {
                return (
                  <Card
                    className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                    key={i + "-file"}
                  >
                    <div className="p-2">
                      <Row className="align-items-center">
                        <Col className="col-auto">
                          <img
                            data-dz-thumbnail=""
                            height="80"
                            className="avatar-sm rounded bg-light"
                            alt={f.name}
                            src={f.preview}
                          />
                        </Col>
                        <Col>
                          <Link
                            to="#"
                            className="text-muted font-weight-bold"
                          >
                            {f.name}
                          </Link>
                          <p className="mb-0">
                            <strong>{f.formattedSize}</strong>
                          </p>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="hstack gap-2 justify-content-end">
            <button type="button" className="btn btn-light" onClick={() => setmodal_list(false)}>Close</button>
            <button type="button" onClick={(e) => { handleSubmit(e); setmodal_list(false) }} className="btn btn-success" id="add-btn">Simpan</button>
          </div>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default Gallery;