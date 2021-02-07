import React from 'react'
import styles from './ProjectCard.module.css'

const ProjectCard = ({ project, handleModalContent, showModal }) => {
    return (
        <div className={`d-flex ${styles.container} justify-content-between w-100 align-items-center`}>
            <div className="d-flex" style={{ width: "70%" }}>
                <img src={project.thumbnail} alt={project.title + "_image"} width="200" height="auto" className={styles.image}/>
                <div className="d-flex flex-column justify-content-between" style={{ marginLeft: "24px" }}>
                    <h1>{project.title.replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, "")}</h1>
                    <div>
                        <span>Created by:</span>
                        <div className={styles.teamText}>
                            {project.contributors.map((member, i) => {
                                return (
                                    <span key={"member" + i} style={{ fontWeight: "500" }}>{member + (i !== project.contributors.length - 1 ? (",") : (""))} </span>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ width: "30%"}}>
                {project.similarProjects === undefined || project.similarProjects.length > 0 ? (
                    <div className="d-flex flex-column align-items-center">
                        <div style={{ marginBottom: "6px" }}>This Project is Similar to a Previous Project...</div>
                        <button className={styles.detailButton} onClick={() => {
                            handleModalContent({
                                title: project.title.replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, ""),
                                similarProjects: project.similarProjects
                                // title: "Not Real Project",
                                // similarProjects: [{
                                //     title: "Similar but also not real",
                                //     contributor: "sus guy",
                                //     projectLink: "https://www.youtube.com/watch?v=q76bMs-NwRk&t=904s&ab_channel=TheRelaxedGuy",
                                //     similarity: .5,
                                //     thumbnail: "https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/000/883/464/datas/medium.png"
                                // },{
                                //     title: "Fake af",
                                //     contributor: "More sus guy",
                                //     projectLink: "https://www.youtube.com/watch?v=q76bMs-NwRk&t=904s&ab_channel=TheRelaxedGuy",
                                //     similarity: .5,
                                //     thumbnail: "https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/000/883/464/datas/medium.png"
                                // }]
                            })
                            setTimeout(() => {
                                showModal()
                            }, 100)
                        }}>
                            View Details
                        </button>
                    </div>
                ):(
                    <div>
                        This Project Appears to be Unique!
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProjectCard