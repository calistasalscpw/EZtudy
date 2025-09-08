import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const ViewerWrapper = styled.div``;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
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

const MaterialViewer = ({ material, onBack }) => {
    const renderContent = () => {
        switch (material.type) {
            case 'video':
                return (
                    <VideoContainer>
                        <iframe
                            src={`https://www.youtube.com/embed/${material.videoId}`}
                            title={material.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </VideoContainer>
                );
            case 'pdf':
                return <Placeholder>PDF Material: "{material.title}" would be displayed here.</Placeholder>;
            case 'quiz':
                return <Placeholder>Quiz: "{material.title}" would be displayed here.</Placeholder>;
            default:
                return <Placeholder>Content for "{material.title}"</Placeholder>;
        }
    };

    return (
        <ViewerWrapper>
            <Header>
                <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
                    Back to Overview
                </Button>
                <Title>{material.title}</Title>
            </Header>
            {renderContent()}
        </ViewerWrapper>
    );
};

export default MaterialViewer;