import React, { useState } from 'react';
import { EyeOutlined } from '@ant-design/icons';

const ProductImage = ({ src, alt, style, fallbackIcon = <EyeOutlined />, fallbackText = "No Image" }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Check if src is valid
  const isValidUrl = src && typeof src === 'string' && src.trim() !== '';

  if (!isValidUrl || imageError) {
    return (
      <div style={{ 
        ...style,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'column',
        backgroundColor: '#f5f5f5',
        color: '#ccc'
      }}>
        <div style={{ fontSize: 48 }}>
          {fallbackIcon}
        </div>
        <div style={{ marginTop: 8, fontSize: 12 }}>
          {fallbackText}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', ...style }}>
      {imageLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#ccc'
        }}>
          Loading...
        </div>
      )}
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: imageLoading ? 'none' : 'block'
        }}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default ProductImage;
