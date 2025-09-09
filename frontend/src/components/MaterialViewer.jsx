import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Dropdown, Space, Modal, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import API from '../api';

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

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

const PDFViewerContainer = styled.div`
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1rem;
    .react-pdf__Page__canvas {
        margin: 0 auto; // Center the PDF page
    }
`;

const PaginationControls = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
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

const MaterialViewer = ({ material, onBack, refreshData, onEdit, onDelete }) => {
    const { user } = useAuth();

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages));

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
                const fileUrl = `http://localhost:5000${material.source}`;
                return (
                    <div>
                        {/* Download button first */}
                        <div style={{ marginBottom: '1.5rem' }}>
                           <a href={fileUrl} download={material.fileName}>
                                <Button type="primary">Download {material.fileName}</Button>
                            </a>
                        </div>
                        
                        {/* PDF Viewer */}
                        <PDFViewerContainer>
                            <Document
                                file={fileUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading="Loading PDF..."
                            >
                                <Page pageNumber={pageNumber} />
                            </Document>
                        </PDFViewerContainer>

                        {/* Pagination Controls */}
                        {numPages && (
                             <PaginationControls>
                                <Button onClick={goToPrevPage} disabled={pageNumber <= 1}>
                                    Previous
                                </Button>
                                <span>
                                    Page {pageNumber} of {numPages}
                                </span>
                                <Button onClick={goToNextPage} disabled={pageNumber >= numPages}>
                                    Next
                                </Button>
                            </PaginationControls>
                        )}
                    </div>
                );
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
                    {user?.isAdmin && (
                        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                            <Button icon={<MoreOutlined />}/>
                        </Dropdown>
                    )}
                </HeaderActions>
            </ViewerHeader>
            {renderContent()}
        </ViewerWrapper>
    );
};

export default MaterialViewer;