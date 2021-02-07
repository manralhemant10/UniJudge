import React, { useState, useEffect } from 'react'
import axios from 'axios';
import ProjectCard from './ProjectCard'
import Modal from 'react-bootstrap/Modal'
import styles from './List.module.css'

const List = ({ hack }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [show, setShow] = useState(false);
    const [modalContent, setModalContent] = useState(null)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        axios.get(`http://localhost:4000/api/analyze-hackathon/?link=${hack.link}`)
        .then(res => {
            console.log(res)
            setLoading(false)
            setTimeout(() => {
                setData(res.data)
            }, 100)
        })
        .catch(function (error) {
            console.log(error)
        })
    }, [])

    return (
        <>
            {modalContent !== null ? (
                <Modal
                show={show}
                onHide={() => setShow(false)}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                            Similar Projects For <span>{modalContent.title}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {modalContent.similarProjects.map((project, i) => {
                            return (
                                <div key={"modalProject" + i} className={styles.projectCard} style={{ marginBottom: "14px" }}>
                                    <img src={project.thumbnail} style={{ marginBottom: "10px" }} alt={project.title + "_image"} width="200" height="auto" className={styles.image}/>
                                    <h2>{project.title}</h2>
                                    <div style={{ marginBottom: "10px" }}>Contributor: {project.contributor}</div>
                                    <div style={{ marginBottom: "10px" }}>Similarity: {project.similarity}</div>
                                    <div>Project Link: {project.projectLink}</div>
                                </div>
                            )
                        })}
                    </Modal.Body>
                </Modal>
            ):(
                <div/>
            )}

            <div className="d-flex flex-column align-items-center w-100">
                <div className={`${styles.headerCard} d-flex justify-content-center`} style={{ marginBottom: "20px" }}>
                    <h1>
                        Showing Results For <span style={{ color: "#000c79", fontWeight: "500" }}>{hack.title}</span> 
                    </h1>
                </div>
                {data.map((singleData, i) => {
                    return (
                        <div key={"data" + i} style={{ marginBottom: "20px", width: "100%" }}>
                            <ProjectCard project={singleData} handleModalContent={setModalContent} showModal={handleShow}/>
                        </div>
                    )
                })}
                {loading ? (
                    <div style={{ marginTop: "100px", fontSize: "30px" }}>
                        Loading...
                    </div>
                ):(
                    <div/>
                )}
            </div>
        </>
    )
}

export default List