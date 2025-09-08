import React from 'react';
import styled from 'styled-components';
import { Progress, List } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

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

const CourseHome = ({ course, onSelectMaterial }) => {
    return (
        <Wrapper>
            <Header>
                <Title>{course.title}</Title>
                <ProgressText>Overall study progress: {course.progress}%</ProgressText>
                <Progress 
                    percent={course.progress} 
                    strokeColor={{
                        '0%': '#EDDD53',
                        '50%': '#57C785',
                        '100%': '#2A7B9B',
                    }} 
                    status="success" 
                />
            </Header>
            <MaterialListCard>
                <h2 style={{fontSize: '1.25rem'}}>List of learning materials</h2>
                <List
                    itemLayout="horizontal"
                    dataSource={course.materials}
                    renderItem={(item) => (
                        <List.Item
                            style={{cursor: 'pointer'}}
                            onClick={() => onSelectMaterial(item)}
                            actions={[<CheckCircleFilled style={{color: 'green', fontSize: '1.2rem'}}/>]}
                        >
                            <List.Item.Meta
                                title={<a onClick={() => onSelectMaterial(item)}>{item.title}</a>}
                            />
                        </List.Item>
                    )}
                />
            </MaterialListCard>
        </Wrapper>
    );
};

export default CourseHome;