import React from "react";
import styles from "./PostTagUpdateModal.module.css";
import Modal from "react-modal";
import { useState, useEffect } from "react";
import { getPostTagsUrl, getCreatePostTagUrl, getDeletePostTagUrl, getPostsHubUrl } from "@/utils/url-segments";
import api from "@/utils/api";

const PostTagUpdateModal = ({hub, onClose, setTags, setHubPosts}) => {
    const [modalTags, setModalTags] = useState([]);
    const [currentTag, setCurrentTag] = useState(null);
    const [deletedIDs, setDeletedIDs] = useState([]);
    const [name, setName] = useState('');
    const [color, setColor] = useState("#cfbc0d");

    useEffect(() => {
        console.log("Fetching post tags...");
        const fetchPostTags = async () => {
            try {
                const response = await api.get(getPostTagsUrl(hub));
                console.log(response.data);
                setModalTags(response.data);
            } catch (error) { console.log("Error fetching post tags: ", error); }
        };
        fetchPostTags();    
    }, []); 

    const changeTags = async (deletedIDs) => {
		try {
			const response = await api.get(getPostTagsUrl(hub));
			setTags(response.data);
		} catch (error) { console.log("Error fetching hub tags: ", error); }
		// Remove references to deleted tags from any posts containing deleted tags
		setHubPosts((prevPosts) => 
            prevPosts.map(post => {
            const postTagID = post.tag && post.tag.id ? post.tag.id : post.tag;
            if (post.tag && deletedIDs.includes(postTagID)) {
                return { ...post, tag: null }; 
        }
        return post;
    })
);
	};

    const handleCloseClick = async (e) => {
        e.preventDefault();
        await changeTags(deletedIDs);
        onClose();
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make POST request
            const response = await api.post(getCreatePostTagUrl(), { name, color, hub_id: hub});
            // Update list of tags
            setModalTags((prevTags) => [...prevTags, response.data]);
            // Reset the input
            setName('');

            console.log("Post Tag created successfully:", response.data);
        } catch (error) { console.log("Error creating tag: ", error); } 
    }

    const handleDelete = async () => {
        try {
            // Make PATCH request to update the tag
            await api.delete(getDeletePostTagUrl(currentTag.id));
            console.log("Delete post tag successful.");
            setModalTags((prevTags) => prevTags.filter((tag) => tag.id !== currentTag.id));
            setDeletedIDs((prevDeletedIDs) => [...prevDeletedIDs, currentTag.id]);
            setCurrentTag(null);
        } catch (error) {
            console.log("Error deleting tag: ", error.response.data);
        }
    };

    return (
        <Modal
            isOpen={true}
            onRequestClose={handleCloseClick}
            overlayClassName={styles.tagModalOverlay}
            className={styles.tagModal}
            ariaHideApp={false}
        >
            <div className={styles.tagModal}>
                <form className={styles.form} onSubmit={onSubmit}>
                    <label>
                    Name:
                    <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                    <label>
                    Color:
                    <input type="color" style={{cursor:"pointer", marginLeft:"1vw"}} name="color" value={color} onChange={(e) => setColor(e.target.value)} />
                    </label>
                    <button className={styles["create-button"]} type="submit">Create</button>
                </form>
                <div className={styles.tagModalClose}>
                    <a href="#" onClick={handleCloseClick}>
                        X
                    </a>
                </div>
                <div style={{ marginTop: '.8rem' }} className={styles.buttons}>
                    {modalTags.map((current_tag) => (
                        <button
                            key={current_tag.id} 
                            style={{ marginBottom: '.3rem', '--bgColor': current_tag.color }}
                            className={`${currentTag == current_tag ? styles.current : ''} ${styles.tags}`} 
                            onClick={() => {setCurrentTag(currentTag == current_tag ? null : current_tag)}} 
                        >
                        {current_tag.name.split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </button>
                    ))}
                </div>
                <div className={styles.tagModalButtonContainer}>
                    <div>
                        <button className={styles.tagModalConfirm} onClick={() => {if(currentTag != null) handleDelete()}}>{"Delete"}</button>
                    </div>
                    <div>
                        <button className={styles.tagModalCancel} onClick={handleCloseClick}>Cancel</button>
                    </div>
                </div>
            </div>    
        </Modal>
    );
}

export default PostTagUpdateModal;