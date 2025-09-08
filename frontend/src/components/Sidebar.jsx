import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BookOutlined, PlaySquareOutlined, QuestionCircleOutlined, FolderOpenOutlined, LeftOutlined } from '@ant-design/icons';

// --- Styled Components ---
const SidebarWrapper = styled.aside`
  width: 300px;
  background-color: #FFFFFF;
  border-right: 1px solid #EAEAEA;
  padding: 1.5rem;
  flex-shrink: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const DashboardLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: #ECF2FE;
    color: #2E5A99;
  }
`;

const CourseTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  padding-bottom: 1rem;
  border-bottom: 1px solid #EAEAEA;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MaterialList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
`;

const MaterialItem = styled.li`
  padding: 0.75rem 0.5rem;
  margin: 0.25rem 0;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: ${props => props.$isActive ? '#2E5A99' : '#555'};
  background-color: ${props => props.$isActive ? '#ECF2FE' : 'transparent'};
  transition: background-color 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #ECF2FE;
  }
`;

const IconWrapper = styled.span`
  margin-right: 0.75rem;
  color: #8B8D98;
`;

const getIcon = (type) => {
    switch (type) {
        case 'video': return <PlaySquareOutlined />;
        case 'pdf': return <BookOutlined />;
        case 'quiz': return <QuestionCircleOutlined />;
        default: return <BookOutlined />;
    }
};

const Sidebar = ({ course, selectedMaterialId, onSelectMaterial }) => {
    return (
        <SidebarWrapper>
            <DashboardLink to="/">
                <LeftOutlined />
                Back to Dashboard
            </DashboardLink>
            <CourseTitle><FolderOpenOutlined /> {course.title}</CourseTitle>
            <MaterialList>
                {course.materials.map(material => (
                    <MaterialItem
                        key={material.id}
                        $isActive={material.id === selectedMaterialId}
                        onClick={() => onSelectMaterial(material)}
                    >
                        <IconWrapper>{getIcon(material.type)}</IconWrapper>
                        {material.title}
                    </MaterialItem>
                ))}
            </MaterialList>
        </SidebarWrapper>
    );
};

export default Sidebar;