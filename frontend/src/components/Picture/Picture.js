import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import './Picture.css';
import { getPicturesUrl } from '@/utils/url-segments';  


export default function PictureGallery({ username }){
    const [pictures, setPictures] = useState([]);  
    const [loading, setLoading] = useState(false);  
    const [hasMorePictures, setHasMorePictures] = useState(true); 
    const [page, setPage] = useState(1); 
    const [selectedImage, setSelectedImage] = useState(null);
  


  const fetchPictures = async (pageNum) => {
    setLoading(true);
    try {
      const response = await api.get(getPicturesUrl(username) + `?page=${pageNum}`);
      console.log("Fetched pictures from API:", response.data);

      const newPictures = response.data.results; 
      console.log("New pictures:", newPictures);

      setPictures((prevPictures) => {
        const combinedPictures = [...prevPictures, ...newPictures];
        const uniquePictures = [
          ...new Map(combinedPictures.map((pic) => [pic.id, pic])).values(),
        ]; 
        console.log("Unique pictures after deduplication:", uniquePictures);
        return uniquePictures;  
      });

      if (newPictures.length < 9) {
        setHasMorePictures(false);
      }
    } catch (error) {
      console.error("Error fetching pictures:", error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPictures(page);
  }, [username, page]);

  const loadMorePictures = () => {
    if (!loading && hasMorePictures) {
      setPage((prevPage) => prevPage + 1); 
    }
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className='gallery-container'>      
      <div className='gallery'>
        {console.log(pictures)}
        {pictures.map((pictures) => (
          <div key={pictures.id} className={'imageCard'} onClick={() => openModal(`http://localhost:8000${pictures.image_url}`)}>
            <img
                src={`http://localhost:8000${pictures.image_url}`}
                alt={`Picture ${pictures.id}`}
                className='image'
              />
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className={`${'modal'} ${selectedImage ? 'show' : ''}`} onClick={closeModal}>
          <button className={'close-btn'} onClick={closeModal}>
            &times;
          </button>
          <img
            src={selectedImage}
            alt="Selected"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {hasMorePictures && (
        <div className={'pagination'}>
          <button onClick={loadMorePictures} disabled={loading} className='load-more'>
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {!hasMorePictures && <p className='nomorepics'>No more pictures to load.</p>}
    </div>
  );
};

