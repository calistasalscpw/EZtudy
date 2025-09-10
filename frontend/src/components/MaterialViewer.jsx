import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Dropdown, Space, Modal, message, Result } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, MoreOutlined, DownloadOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import API from '../api';

import PdfViewer from './PDFViewer';

const ViewerWrapper = styled.div``;

const ViewerHeader = styled.div`
    margin-bottom: 2rem;
`;

const HeaderActions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const VideoContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  border-radius: 8px;
  background: #000;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const Placeholder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  background-color: #ECF2FE;
  border-radius: 8px;
  color: #8B8D98;
  font-size: 1.5rem;
`;

const MaterialViewer = ({ material, onBack, onEdit, onDelete }) => {
    const { user } = useAuth();
    const fileUrl = `http://localhost:5000${material.source}`;

    const handleDelete = () => {
        if (onDelete) {
            onDelete(material);
        } else {
            message.error("Delete function not provided.");
        }
    };
    
    const handleEdit = () => {
        if (onEdit) {
            onEdit(material);
        } else {
            message.info('Edit functionality is not available.');
        }
    };

    const menuItems = [
        { key: 'edit', label: 'Edit', icon: <EditOutlined />, onClick: handleEdit },
        { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true, onClick: handleDelete }
    ];
    
    const renderContent = () => {
        if (!material) return null;
        const videoId = material.type === 'video' ? material.source : '';

        switch (material.type) {
            case 'video':
                return (
                    <VideoContainer>
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={material.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </VideoContainer>
                );
            case 'file':
                if (material.fileName && material.fileName.endsWith('.pdf')) {
                    return <PdfViewer fileUrl={fileUrl} />;
                } else if (material.fileName && /\.(jpg|jpeg|png|gif)$/i.test(material.fileName)) {
                    return <img src={fileUrl} alt={material.title} style={{ maxWidth: '100%' }} />;
                } else if (material.fileName && /\.(ppt|pptx|doc|docx)$/i.test(material.fileName)) {
                    <Result
                        status="info"
                        title="This file needs to be downloaded"
                        subTitle={`To view "${material.fileName}", please download the file to your computer.`}
                        extra={
                            <a href={fileUrl} download={material.fileName} rel="noopener noreferrer">
                                <Button type="primary" icon={<DownloadOutlined />}>
                                    Download Now
                                </Button>
                            </a>
                        }
                    />
                } else {
                    return <Placeholder>Cannot display this file type. Please download to view.</Placeholder>;
                }
            default:
                return <Placeholder>Content for "{material.title}"</Placeholder>;

        }
    };

    return (
        <ViewerWrapper>
            <ViewerHeader>
                <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
                    Back to Overview
                </Button>
                <HeaderActions>
                    <Title>{material.title}</Title>
                    <div> 
                        {material.type === 'file' && (
                            <a 
                                href={`http://localhost:5000/download/${material.source.split('/').pop()}`}
                                download={material.fileName} 
                                rel="noopener noreferrer">
                                <Button icon={<DownloadOutlined />} style={{ marginRight: '10px' }}>
                                    Download
                                </Button>
                            </a>
                        )}
                        {user?.isAdmin && (
                            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                                <Button icon={<MoreOutlined />}/>
                            </Dropdown>
                        )}
                    </div>
                </HeaderActions>
            </ViewerHeader>
            {renderContent()}
        </ViewerWrapper>
    );
};

export default MaterialViewer;