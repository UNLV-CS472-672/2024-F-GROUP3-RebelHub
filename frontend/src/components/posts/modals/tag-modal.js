import React from "react";
import styles from "./tag-modal.module.css";
import Modal from "react-modal";
import { useState, useEffect } from "react";
import { getTagPostUrl, getPostTagsUrl } from "@/utils/url-segments";
import api from "@/utils/api";

const TagModal = ({post, hub, onClose}) => {
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState(null);
    const [temp, setTemp] = useState('');

    useEffect(() => {
        console.log("Fetching post tags...");
        const fetchPostTags = async () => {
            try {
                const response = await api.get(getPostTagsUrl(hub));
                console.log(response.data);
                setTags(response.data);
            } catch (error) { console.log("Error fetching post tags: ", error); }
        };
        fetchPostTags();
    }, []);

    const confirmTag = async () => {;
        try {
            // Make PATCH request to update the tag
            if(currentTag != null && currentTag != undefined) await api.patch(getTagPostUrl(post.id), { tag:currentTag.id });
            else await api.patch(getTagPostUrl(post.id), { tag:null });
            onClose();
        } catch (error) {
            console.log("Error updating tag: ", error);
        }
    };

    return (
        <Modal
            isOpen={true}
            onRequestClose={onClose}
            overlayClassName={styles.tagModalOverlay}
            className={styles.tagModal}
            ariaHideApp={false}
        >
            <div className={styles.tagModal}>
                <div className={styles.tagModalClose}>
                    <a href="#" onClick={onClose}>
                        X
                    </a>
                </div>
                <div style={{ marginTop: '.8rem' }} className={styles.buttons}>
                    {tags.map((current_tag) => (
                        <button
                            key={current_tag.id} 
                            style={{ marginBottom: '.3rem', '--bgColor': current_tag.color }}
                            className={`${currentTag == current_tag ? styles.current : ''} ${styles.tags}`} 
                            onClick={() => {setCurrentTag(currentTag == current_tag ? null : current_tag); setTemp(current_tag)}} 
                        >
                        {current_tag.name.split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </button>
                    ))}
                </div>
                <div className={styles.tagModalButtonContainer}>
                    <div>
                        <button className={styles.tagModalConfirm} onClick={() => confirmTag()}>{currentTag != null ? "Tag" : "Untag"}</button>
                    </div>
                    <div>
                        <button className={styles.tagModalCancel} onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>    
        </Modal>
    );
}

export default TagModal;