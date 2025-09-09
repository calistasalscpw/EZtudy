import React from 'react';
import styled from 'styled-components';
import { Progress, List, Button, message } from 'antd';
import { CheckCircleFilled, PlusOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const Wrapper = styled.div``;

const Header = styled.div`
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #EAEAEA;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  margin: 0 0 0.5rem 0;
`;

const ProgressText = styled.p`
  font-size: 1rem;
  color: #8B8D98;
  margin-bottom: 1rem;
`;

const MaterialListCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #EAEAEA;
  padding: 1.5rem;
`;

const MaterialListHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
`;


const CourseHome = ({ course, onSelectMaterial, onAddMaterial, progress, refreshData }) => {
    const { user } = useAuth();

    const handleMarkAsComplete = async (materialId) => {
        if (user && !user.isAdmin) {
            try {
                // Prevent re-marking
                if (progress.completedMaterials.includes(materialId)) return;
                
                await API.post('/progress/complete', {
                    courseId: course._id,
                    materialId: materialId,
                });
                refreshData();
            } catch (error) {
                console.error("Failed to update progress", error);
            }
        }
    };
    
    return (
        <Wrapper>
            <Header>
                <Title>{course.title}</Title>
                <ProgressText>Overall study progress: {Math.round(progress.percentage)}%</ProgressText>
                <Progress 
                    percent={progress?.percentage || 0}
                    strokeColor={{
                        '0%': '#EDDD53',
                        '50%': '#57C785',
                        '100%': '#2A7B9B',
                    }} 
                    // status="success" 
                />
            </Header>
            <MaterialListCard>
                <MaterialListHeader>
                    <h2 style={{fontSize: '1.25rem', margin: 0}}>List of learning materials</h2>
                    {user?.isAdmin && (
                         <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={onAddMaterial}
                            style={{ background: 'linear-gradient(to right, #4C75C4, #80A8F1)', border: 'none' }}
                        >
                            Add Material
                        </Button>
                    )}
                </MaterialListHeader>
                <List
                    itemLayout="horizontal"
                    dataSource={course.materials}
                    renderItem={(item) => {
                        const isCompleted = progress?.completedMaterials?.includes(item._id);
                        return (
                            <List.Item
                                style={{cursor: 'pointer'}}
                                onClick={() => {
                                    onSelectMaterial(item);
                                    handleMarkAsComplete(item._id);
                                }}
                                actions={!user?.isAdmin && isCompleted ? 
                                    [<CheckCircleFilled style={{ color: '#57C785', fontSize: '1.2rem' }} />] : []}
                            >
                                <List.Item.Meta
                                    title={<a>{item.title}</a>}
                                />
                            </List.Item>
                        );
                    }}
                />
            </MaterialListCard>
        </Wrapper>
    );
};

export default CourseHome;