import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Input, Button, Modal, Form, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import API from '../api';

// Styled components for the Course Card
const CardWrapper = styled.div`
  background-color: #FFFFFF;
  border: 1px solid #EAEAEA;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.08);
  }
`;

const ImagePlaceholder = styled.div`
  background-color: #A7C6FF; 
  height: 150px;
  width: 100%;
`;

const ContentWrapper = styled.div`
  padding: 1rem;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const CardDescription = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
  color: #8B8D98;
`;

const CourseCard = ({ course, onClick }) => {
  return (
    <CardWrapper onClick={onClick}>
      <ImagePlaceholder />
      <ContentWrapper>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </ContentWrapper>
    </CardWrapper>
  );
};

// Styled components for the main section
const CoursesContainer = styled.section`
  padding: 4rem 2rem;
  background-color: #F9FAFB;
  min-height: 80vh;
`;

const SectionHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem auto;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Toolbar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
`;

const Grid = styled.div`
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CoursesSection = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await API.get(`/courses?keyword=${searchTerm}`);
            setCourses(response.data.data);
        } catch (error) {
            message.error('Failed to fetch courses.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCourses();
    }, []); 

    const handleSearch = () => {
        fetchCourses();
    };
    
    const handleAddCourse = async (values) => {
        try {
            await API.post('/courses', values);
            message.success('Course created successfully!');
            setIsModalVisible(false);
            form.resetFields();
            fetchCourses(); 
        } catch (error) {
            message.error('Failed to create course.');
        }
    };

  return (
    <CoursesContainer>
      <SectionHeader>
          <SectionTitle>Our Courses</SectionTitle>
      </SectionHeader>
            
      <Toolbar>
        <Input
            placeholder="Search for courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
            style={{ maxWidth: '400px' }}
            prefix={<SearchOutlined />}
        />
        {user?.isAdmin && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                Add Course
            </Button>
        )}
      </Toolbar>

      <Grid>
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} onClick={() => navigate(`/course/${course._id}`)} />
        ))}
      </Grid>
            
      <Modal
          title="Add New Course"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={() => form.submit()}
          okText="Create"
      >
        <Form form={form} layout="vertical" onFinish={handleAddCourse}>
            <Form.Item name="title" label="Course Title" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                <Input.TextArea rows={4} />
            </Form.Item>
        </Form>
      </Modal>
    </CoursesContainer>
  );
};

export default CoursesSection;