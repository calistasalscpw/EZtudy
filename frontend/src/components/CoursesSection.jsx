import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Input, Button, Modal, Form, message, Dropdown, Space } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
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
  position: relative;

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

const AdminCourseActions = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    border-radius: 16px;
    padding: 4px;
`;

const CourseCard = ({ course, onEdit, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
        { key: 'edit', label: 'Edit', icon: <EditOutlined />, onClick: (e) => { e.stopPropagation(); onEdit(course); } },
        { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true, onClick: (e) => { e.stopPropagation(); onDelete(course._id); } }
  ];
  
  return (
    <CardWrapper onClick={() => navigate(`/course/${course._id}`)}>
        {user?.isAdmin && (
            <AdminCourseActions>
                <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                    <Button type="text" shape="circle" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
                </Dropdown>
            </AdminCourseActions>
        )}
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
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
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

    const handleFormSubmit = async (values) => {
        try {
            if (editingCourse) {
                await API.put(`/courses/${editingCourse._id}`, values);
                message.success('Course updated!');
            } else {
                await API.post('/courses', values);
                message.success('Course created!');
            }
            setIsModalVisible(false);
            form.resetFields();
            setEditingCourse(null);
            fetchCourses();
        } catch (error) {
            message.error('Operation failed.');
        }
    };

    const handleEditCourse = (course) => {
        setEditingCourse(course);
        form.setFieldsValue(course);
        setIsModalVisible(true);
    };

    const handleDeleteCourse = (courseId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this course?',
            content: 'All materials within this course will also be deleted.',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await API.delete(`/courses/${courseId}`);
                    message.success('Course deleted.');
                    fetchCourses();
                } catch (error) {
                    message.error('Failed to delete course.');
                }
            }
        });
    };

    const handleSearch = () => {
        fetchCourses();
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
            <CourseCard key={course._id} course={course} onEdit={handleEditCourse} onDelete={handleDeleteCourse} />
        ))}
      </Grid>
            
      <Modal
          title={editingCourse ? "Edit Course" : "Add New Course"}
          open={isModalVisible}
          onCancel={() => { setIsModalVisible(false); setEditingCourse(null); form.resetFields(); }}
          onOk={() => form.submit()}
          okText={editingCourse ? "Save Changes" : "Create"}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
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